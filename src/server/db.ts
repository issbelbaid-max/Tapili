import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { Customer, Job, Expense, Invoice, StripeSettings } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_JOBS, INITIAL_EXPENSES, INITIAL_INVOICE, INITIAL_STRIPE_SETTINGS } from '../data/mockData';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tapili.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance and integrity
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- 1. TENANTS TABLE
  CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    sort_code TEXT,
    account_no TEXT,
    stripe_account_id TEXT,
    stripe_status TEXT DEFAULT 'active',
    bank_name TEXT DEFAULT 'Barclays Business',
    bank_account_masked TEXT DEFAULT '•••• 0194',
    deposit_required INTEGER DEFAULT 1,
    allow_in_person_fallback INTEGER DEFAULT 1,
    link_expiration_hours TEXT DEFAULT '48',
    automated_reminders INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 2. CUSTOMERS TABLE
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    phone TEXT,
    email TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    postcode TEXT,
    cadence TEXT DEFAULT 'weekly',
    cadence_label TEXT DEFAULT 'Weekly',
    is_regular INTEGER DEFAULT 1,
    client_since TEXT,
    keys_held_note TEXT,
    household_notes TEXT,
    eco_notes TEXT,
    lockbox_code TEXT,
    lockbox_location TEXT,
    alarm_code TEXT,
    standard_rate_pence INTEGER DEFAULT 0,
    total_paid_lifetime_pence INTEGER DEFAULT 0,
    cleans_completed INTEGER DEFAULT 0,
    outstanding_balance_pence INTEGER DEFAULT 0,
    overdue_invoice_id TEXT,
    overdue_invoice_number TEXT,
    overdue_invoice_amount_pence INTEGER,
    overdue_invoice_days INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
  );

  -- 3. JOBS TABLE
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    job_number TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_avatar TEXT,
    date_str TEXT NOT NULL,
    date_label TEXT NOT NULL,
    time_window TEXT NOT NULL,
    service_category TEXT,
    service_title TEXT NOT NULL,
    service_details TEXT,
    property_address TEXT NOT NULL,
    postcode_area TEXT,
    price_pence INTEGER NOT NULL,
    deposit_paid_pence INTEGER DEFAULT 0,
    balance_due_pence INTEGER NOT NULL,
    status TEXT DEFAULT 'Scheduled',
    payment_method TEXT,
    access_note TEXT,
    lockbox_code TEXT,
    pet_note TEXT,
    travel_estimate_time TEXT,
    travel_estimate_distance TEXT,
    direct_cost_estimate_pence INTEGER DEFAULT 0,
    net_profit_estimate_pence INTEGER DEFAULT 0,
    hourly_rate_estimate_pence INTEGER DEFAULT 0,
    photos_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  );

  -- 4. JOB_TASKS TABLE
  CREATE TABLE IF NOT EXISTS job_tasks (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
  );

  -- 5. INVOICES TABLE (Protected ledger with JSON line items and audit log)
  CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_address TEXT,
    issued_date TEXT NOT NULL,
    due_date_label TEXT,
    status TEXT DEFAULT 'Pending',
    subtotal_pence INTEGER NOT NULL,
    deposit_collected_pence INTEGER DEFAULT 0,
    remaining_due_pence INTEGER NOT NULL,
    line_items_json TEXT NOT NULL DEFAULT '[]',
    payment_history_json TEXT NOT NULL DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
  );

  -- 6. EXPENSES TABLE
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    amount_pence INTEGER NOT NULL,
    date_str TEXT NOT NULL,
    date_label TEXT NOT NULL,
    job_link TEXT,
    description TEXT,
    receipt_name TEXT,
    receipt_size TEXT,
    status_label TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
  );

  -- 7. BOOKING_TOKENS TABLE (Cryptographic SHA-256 tokens)
  CREATE TABLE IF NOT EXISTS booking_tokens (
    id TEXT PRIMARY KEY,
    token_hash TEXT UNIQUE NOT NULL,
    token_preview TEXT NOT NULL,
    job_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    status TEXT DEFAULT 'active',
    payment_choice TEXT,
    terms_accepted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id),
    FOREIGN KEY(job_id) REFERENCES jobs(id)
  );

  -- INDEXES FOR TENANT ISOLATION AND HIGH CONCURRENCY
  CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_tenant_date ON jobs(tenant_id, date_str);
  CREATE INDEX IF NOT EXISTS idx_job_tasks_job ON job_tasks(job_id);
  CREATE INDEX IF NOT EXISTS idx_job_tasks_tenant ON job_tasks(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON expenses(tenant_id, date_str);
  CREATE INDEX IF NOT EXISTS idx_booking_tokens_hash ON booking_tokens(token_hash);
  CREATE INDEX IF NOT EXISTS idx_booking_tokens_tenant ON booking_tokens(tenant_id);
`);

// Utility to convert pounds to pence and vice versa
export const toPence = (pounds: number): number => Math.round(Number(pounds || 0) * 100);
export const toPounds = (pence: number): number => Number(pence || 0) / 100;

// Seed initial dataset if tenants table is empty
const tenantCheck = db.prepare('SELECT COUNT(*) as count FROM tenants').get() as { count: number };

if (tenantCheck.count === 0) {
  const insertTenant = db.prepare(`
    INSERT INTO tenants (
      id, name, owner_name, email, phone, sort_code, account_no,
      stripe_account_id, stripe_status, bank_name, bank_account_masked
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTenant.run(
    'tenant-1',
    'Sparkle & Shine Co.',
    'Emma',
    'info@sparkleshine.co.uk',
    '020 8940 2211',
    '20-04-15',
    '83920194',
    INITIAL_STRIPE_SETTINGS.accountId,
    INITIAL_STRIPE_SETTINGS.status,
    INITIAL_STRIPE_SETTINGS.bankName,
    INITIAL_STRIPE_SETTINGS.bankAccountMasked
  );

  // Seed Customers
  const insertCustomer = db.prepare(`
    INSERT INTO customers (
      id, tenant_id, name, avatar, phone, email, address_line1, address_line2, postcode,
      cadence, cadence_label, is_regular, client_since, keys_held_note, household_notes,
      eco_notes, lockbox_code, lockbox_location, alarm_code, standard_rate_pence,
      total_paid_lifetime_pence, cleans_completed, outstanding_balance_pence,
      overdue_invoice_id, overdue_invoice_number, overdue_invoice_amount_pence, overdue_invoice_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of INITIAL_CUSTOMERS) {
    insertCustomer.run(
      c.id,
      'tenant-1',
      c.name,
      c.avatar,
      c.phone,
      c.email,
      c.addressLine1,
      c.addressLine2,
      c.postcode,
      c.cadence,
      c.cadenceLabel,
      c.isRegular ? 1 : 0,
      c.clientSince,
      c.keysHeldNote,
      c.householdNotes,
      c.ecoNotes || null,
      c.lockboxCode,
      c.lockboxLocation,
      c.alarmCode || null,
      toPence(c.standardRate),
      toPence(c.totalPaidLifetime),
      c.cleansCompleted,
      toPence(c.outstandingBalance),
      c.overdueInvoice?.id || null,
      c.overdueInvoice?.number || null,
      c.overdueInvoice?.amount ? toPence(c.overdueInvoice.amount) : null,
      c.overdueInvoice?.daysOverdue || null
    );
  }

  // Seed Jobs & Tasks
  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, job_number, tenant_id, customer_id, customer_name, customer_avatar,
      date_str, date_label, time_window, service_category, service_title, service_details,
      property_address, postcode_area, price_pence, deposit_paid_pence, balance_due_pence, status,
      payment_method, access_note, lockbox_code, pet_note, travel_estimate_time,
      travel_estimate_distance, direct_cost_estimate_pence, net_profit_estimate_pence,
      hourly_rate_estimate_pence, photos_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTask = db.prepare(`
    INSERT INTO job_tasks (id, tenant_id, job_id, title, completed, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const j of INITIAL_JOBS) {
    insertJob.run(
      j.id,
      j.jobNumber,
      'tenant-1',
      j.customerId,
      j.customerName,
      j.customerAvatar || null,
      j.dateStr,
      j.dateLabel,
      j.timeWindow,
      j.serviceCategory,
      j.serviceTitle,
      j.serviceDetails,
      j.propertyAddress,
      j.postcodeArea,
      toPence(j.price),
      toPence(j.depositPaid),
      toPence(j.balanceDue),
      j.status,
      j.paymentMethod,
      j.accessNote,
      j.lockboxCode || null,
      j.petNote || null,
      j.travelEstimateTime || null,
      j.travelEstimateDistance || null,
      toPence(j.directCostEstimate),
      toPence(j.netProfitEstimate),
      toPence(j.hourlyRateEstimate),
      j.photosCount
    );

    let idx = 0;
    for (const t of j.tasks) {
      insertTask.run(t.id, 'tenant-1', j.id, t.title, t.completed ? 1 : 0, idx++);
    }
  }

  // Seed Invoices
  const insertInvoice = db.prepare(`
    INSERT INTO invoices (
      id, invoice_number, tenant_id, customer_id, customer_name, customer_address,
      issued_date, due_date_label, status, subtotal_pence, deposit_collected_pence,
      remaining_due_pence, line_items_json, payment_history_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertInvoice.run(
    INITIAL_INVOICE.id,
    INITIAL_INVOICE.invoiceNumber,
    'tenant-1',
    INITIAL_INVOICE.customerId,
    INITIAL_INVOICE.customerName,
    INITIAL_INVOICE.customerAddress,
    INITIAL_INVOICE.issuedDate,
    INITIAL_INVOICE.dueDateLabel,
    INITIAL_INVOICE.status,
    toPence(INITIAL_INVOICE.subtotal),
    toPence(INITIAL_INVOICE.depositCollected),
    toPence(INITIAL_INVOICE.remainingDue),
    JSON.stringify(INITIAL_INVOICE.items),
    JSON.stringify(INITIAL_INVOICE.paymentHistory)
  );

  // Seed Expenses
  const insertExpense = db.prepare(`
    INSERT INTO expenses (
      id, tenant_id, merchant, category, category_label, amount_pence, date_str, date_label,
      job_link, description, receipt_name, receipt_size, status_label
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const exp of INITIAL_EXPENSES) {
    insertExpense.run(
      exp.id,
      'tenant-1',
      exp.merchant,
      exp.category,
      exp.categoryLabel,
      toPence(exp.amount),
      exp.dateStr,
      exp.dateLabel,
      exp.jobLink || null,
      exp.description,
      exp.receiptName || null,
      exp.receiptSize || null,
      exp.statusLabel
    );
  }

  // Seed Initial Booking Token with SHA-256 Hash
  const rawToken = 'bkn_8f92ae07';
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const insertToken = db.prepare(`
    INSERT INTO booking_tokens (
      id, token_hash, token_preview, job_id, tenant_id, customer_id, expires_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+2 days'), 'active')
  `);
  insertToken.run(`tok-${Date.now()}`, tokenHash, rawToken.substring(0, 8), 'job-1', 'tenant-1', 'cust-charlotte');
}

export const getDatabase = () => db;

// Queries with Tenant Isolation & Pence Conversion
export const getCustomersByTenant = (tenantId = 'tenant-1'): Customer[] => {
  const stmt = db.prepare('SELECT * FROM customers WHERE tenant_id = ? ORDER BY name ASC');
  const rows = stmt.all(tenantId) as any[];
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    avatar: r.avatar,
    phone: r.phone,
    email: r.email,
    addressLine1: r.address_line1,
    addressLine2: r.address_line2,
    postcode: r.postcode,
    cadence: r.cadence,
    cadenceLabel: r.cadence_label,
    isRegular: Boolean(r.is_regular),
    clientSince: r.client_since,
    keysHeldNote: r.keys_held_note,
    householdNotes: r.household_notes,
    ecoNotes: r.eco_notes,
    lockboxCode: r.lockbox_code,
    lockboxLocation: r.lockbox_location,
    alarmCode: r.alarm_code,
    standardRate: toPounds(r.standard_rate_pence),
    totalPaidLifetime: toPounds(r.total_paid_lifetime_pence),
    cleansCompleted: r.cleans_completed,
    outstandingBalance: toPounds(r.outstanding_balance_pence),
    overdueInvoice: r.overdue_invoice_id ? {
      id: r.overdue_invoice_id,
      number: r.overdue_invoice_number,
      amount: toPounds(r.overdue_invoice_amount_pence),
      daysOverdue: r.overdue_invoice_days
    } : undefined
  }));
};

export const getJobsByTenant = (tenantId = 'tenant-1'): Job[] => {
  const jobStmt = db.prepare('SELECT * FROM jobs WHERE tenant_id = ? ORDER BY date_str ASC, time_window ASC');
  const jobRows = jobStmt.all(tenantId) as any[];

  const taskStmt = db.prepare('SELECT * FROM job_tasks WHERE tenant_id = ? AND job_id = ? ORDER BY sort_order ASC');

  return jobRows.map(j => {
    const taskRows = taskStmt.all(tenantId, j.id) as any[];
    return {
      id: j.id,
      jobNumber: j.job_number,
      customerId: j.customer_id,
      customerName: j.customer_name,
      customerAvatar: j.customer_avatar,
      dateStr: j.date_str,
      dateLabel: j.date_label,
      timeWindow: j.time_window,
      serviceCategory: j.service_category,
      serviceTitle: j.service_title,
      serviceDetails: j.service_details,
      propertyAddress: j.property_address,
      postcodeArea: j.postcode_area,
      price: toPounds(j.price_pence),
      depositPaid: toPounds(j.deposit_paid_pence),
      balanceDue: toPounds(j.balance_due_pence),
      status: j.status,
      paymentMethod: j.payment_method,
      accessNote: j.access_note,
      lockboxCode: j.lockbox_code,
      petNote: j.pet_note,
      travelEstimateTime: j.travel_estimate_time,
      travelEstimateDistance: j.travel_estimate_distance,
      directCostEstimate: toPounds(j.direct_cost_estimate_pence),
      netProfitEstimate: toPounds(j.net_profit_estimate_pence),
      hourlyRateEstimate: toPounds(j.hourly_rate_estimate_pence),
      tasks: taskRows.map(t => ({ id: t.id, title: t.title, completed: Boolean(t.completed) })),
      photosCount: j.photos_count,
    };
  });
};

export const getExpensesByTenant = (tenantId = 'tenant-1'): Expense[] => {
  const stmt = db.prepare('SELECT * FROM expenses WHERE tenant_id = ? ORDER BY date_str DESC, created_at DESC');
  const rows = stmt.all(tenantId) as any[];
  return rows.map(r => ({
    id: r.id,
    merchant: r.merchant,
    category: r.category,
    categoryLabel: r.category_label,
    amount: toPounds(r.amount_pence),
    dateStr: r.date_str,
    dateLabel: r.date_label,
    jobLink: r.job_link,
    description: r.description,
    receiptName: r.receipt_name,
    receiptSize: r.receipt_size,
    statusLabel: r.status_label,
  }));
};

export const getPrimaryInvoiceByTenant = (tenantId = 'tenant-1'): Invoice => {
  const invStmt = db.prepare('SELECT * FROM invoices WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 1');
  const inv = invStmt.get(tenantId) as any;
  if (!inv) return INITIAL_INVOICE;

  let items = [];
  try {
    items = JSON.parse(inv.line_items_json || '[]');
  } catch (e) {
    items = [];
  }

  let paymentHistory = [];
  try {
    paymentHistory = JSON.parse(inv.payment_history_json || '[]');
  } catch (e) {
    paymentHistory = [];
  }

  return {
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    customerId: inv.customer_id,
    customerName: inv.customer_name,
    customerAddress: inv.customer_address,
    issuedDate: inv.issued_date,
    dueDateLabel: inv.due_date_label,
    status: inv.status,
    subtotal: toPounds(inv.subtotal_pence),
    depositCollected: toPounds(inv.deposit_collected_pence),
    remainingDue: toPounds(inv.remaining_due_pence),
    items,
    paymentHistory,
  };
};

export const getStripeSettingsByTenant = (tenantId = 'tenant-1'): StripeSettings => {
  const stmt = db.prepare('SELECT * FROM tenants WHERE id = ?');
  const t = stmt.get(tenantId) as any;
  if (!t) return INITIAL_STRIPE_SETTINGS;

  return {
    accountId: t.stripe_account_id || INITIAL_STRIPE_SETTINGS.accountId,
    status: t.stripe_status || 'active',
    bankName: t.bank_name || 'Barclays Business',
    bankAccountMasked: t.bank_account_masked || '•••• 0194',
    dailyRollingPayouts: true,
    depositRequired: Boolean(t.deposit_required),
    allowInPersonFallback: Boolean(t.allow_in_person_fallback),
    linkExpirationHours: t.link_expiration_hours || '48',
    automatedReminders: Boolean(t.automated_reminders),
  };
};
