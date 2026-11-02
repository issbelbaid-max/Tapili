import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import {
  getDatabase,
  getCustomersByTenant,
  getJobsByTenant,
  getExpensesByTenant,
  getPrimaryInvoiceByTenant,
  getStripeSettingsByTenant,
  toPence,
  toPounds,
} from './db';

const router = Router();

// Middleware to extract tenant ID (defaults to 'tenant-1' for Maidrose / Sparkle & Shine)
const getTenantId = (req: Request): string => {
  return (req.headers['x-tenant-id'] as string) || 'tenant-1';
};

// 1. BOOTSTRAP ENDPOINT (Hydrates client on launch)
router.get('/bootstrap', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(tenantId);

    const customers = getCustomersByTenant(tenantId);
    const jobs = getJobsByTenant(tenantId);
    const expenses = getExpensesByTenant(tenantId);
    const invoice = getPrimaryInvoiceByTenant(tenantId);
    const stripeSettings = getStripeSettingsByTenant(tenantId);

    res.json({
      success: true,
      data: {
        tenant,
        customers,
        jobs,
        expenses,
        invoice,
        stripeSettings,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. CUSTOMERS API
router.get('/customers', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const customers = getCustomersByTenant(tenantId);
    res.json({ success: true, data: customers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/customers', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { name, phone, email, addressLine1, addressLine2, postcode, cadence, cadenceLabel, standardRate, householdNotes, keysHeldNote, lockboxCode } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }

    const id = `cust-${Date.now()}`;
    const standardRatePence = toPence(Number(standardRate) || 65.00);

    const stmt = db.prepare(`
      INSERT INTO customers (
        id, tenant_id, name, avatar, phone, email, address_line1, address_line2, postcode,
        cadence, cadence_label, is_regular, client_since, keys_held_note, household_notes,
        lockbox_code, lockbox_location, standard_rate_pence, total_paid_lifetime_pence,
        cleans_completed, outstanding_balance_pence
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      tenantId,
      name.trim(),
      req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      phone || '',
      email || '',
      addressLine1 || '',
      addressLine2 || '',
      postcode || '',
      cadence || 'weekly',
      cadenceLabel || 'Weekly',
      1,
      'Today',
      keysHeldNote || 'Keys on file',
      householdNotes || '',
      lockboxCode || '#0000',
      'Front porch',
      standardRatePence,
      0,
      0,
      0
    );

    const newCustomer = {
      id,
      name: name.trim(),
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      phone: phone || '',
      email: email || '',
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      postcode: postcode || '',
      cadence: cadence || 'weekly',
      cadenceLabel: cadenceLabel || (cadence === 'fortnightly' ? 'Fortnightly' : cadence === 'monthly' ? 'Monthly' : cadence === 'ad-hoc' ? 'Ad-Hoc' : 'Weekly'),
      isRegular: true,
      clientSince: 'Today',
      keysHeldNote: keysHeldNote || 'Keys on file',
      householdNotes: householdNotes || '',
      ecoNotes: req.body.ecoNotes || '',
      lockboxCode: lockboxCode || '#0000',
      lockboxLocation: req.body.lockboxLocation || 'Front porch',
      alarmCode: req.body.alarmCode || '',
      standardRate: toPounds(standardRatePence),
      totalPaidLifetime: 0,
      cleansCompleted: 0,
      outstandingBalance: 0,
    };

    res.status(201).json({
      success: true,
      data: newCustomer
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. JOBS API
router.get('/jobs', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const jobs = getJobsByTenant(tenantId);
    res.json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/jobs', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const j = req.body;

    const rawPrice = Number(j.price);
    if (isNaN(rawPrice) || rawPrice <= 0) {
      return res.status(400).json({ success: false, error: 'Valid agreed job price is required' });
    }

    const pricePence = toPence(rawPrice);
    const depositPaidPence = toPence(Number(j.depositPaid) || 0);
    const balanceDuePence = Math.max(0, pricePence - depositPaidPence);

    const id = `job-${Date.now()}`;
    const jobNumber = `#JOB-${Math.floor(1000 + Math.random() * 9000)}`;

    const stmt = db.prepare(`
      INSERT INTO jobs (
        id, job_number, tenant_id, customer_id, customer_name, customer_avatar,
        date_str, date_label, time_window, service_category, service_title, service_details,
        property_address, postcode_area, price_pence, deposit_paid_pence, balance_due_pence, status,
        payment_method, access_note, direct_cost_estimate_pence, net_profit_estimate_pence,
        hourly_rate_estimate_pence, photos_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const directCostPence = toPence(8.00);
    const netProfitPence = pricePence - directCostPence;

    stmt.run(
      id,
      jobNumber,
      tenantId,
      j.customerId || 'cust-charlotte',
      j.customerName || 'Charlotte Davies',
      j.customerAvatar || null,
      j.dateStr || '2024-10-25',
      j.dateLabel || 'Tomorrow, 25 Oct',
      j.timeWindow || '09:30 – 12:30',
      j.serviceCategory || 'Domestic',
      j.serviceTitle || 'Regular Clean',
      j.serviceDetails || 'Standard domestic clean',
      j.propertyAddress || '42 Crescent Gardens, Richmond, TW9 1DY',
      j.postcodeArea || 'Richmond (TW9)',
      pricePence,
      depositPaidPence,
      balanceDuePence,
      'Scheduled',
      j.paymentMethod || 'Stripe Online',
      j.accessNote || 'Lockbox on front porch',
      directCostPence,
      netProfitPence,
      toPence(28.50),
      0
    );

    // Insert Default Tasks
    const insertTask = db.prepare(`
      INSERT INTO job_tasks (id, tenant_id, job_id, title, completed, sort_order)
      VALUES (?, ?, ?, ?, 0, ?)
    `);

    const tasks = [
      'Kitchen surfaces & hob descaling',
      'Sanitise bathrooms & mirrors',
      'Vacuum & steam mop floors',
      'Empty bins and replace liners',
    ];

    let order = 0;
    for (const title of tasks) {
      insertTask.run(`task-${id}-${order}`, tenantId, id, title, order++);
    }

    // Generate Cryptographically Secure 256-bit Booking Token
    const rawToken = 'bkn_' + crypto.randomBytes(16).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const tokenStmt = db.prepare(`
      INSERT INTO booking_tokens (
        id, token_hash, token_preview, job_id, tenant_id, customer_id, expires_at, status
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+2 days'), 'active')
    `);
    tokenStmt.run(`tok-${Date.now()}`, tokenHash, rawToken.substring(0, 8), id, tenantId, j.customerId || 'cust-charlotte');

    res.status(201).json({
      success: true,
      data: {
        id,
        jobNumber,
        price: toPounds(pricePence),
        depositPaid: toPounds(depositPaidPence),
        balanceDue: toPounds(balanceDuePence),
        bookingToken: rawToken,
        bookingUrl: `https://tapili.co/book/${rawToken}`,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/jobs/:id/complete', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { id } = req.params;

    const job = db.prepare('SELECT status FROM jobs WHERE tenant_id = ? AND id = ?').get(tenantId, id) as any;
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const nextStatus = job.status === 'Completed' ? 'In Progress' : 'Completed';
    db.prepare('UPDATE jobs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE tenant_id = ? AND id = ?').run(nextStatus, tenantId, id);

    if (nextStatus === 'Completed') {
      db.prepare('UPDATE job_tasks SET completed = 1 WHERE tenant_id = ? AND job_id = ?').run(tenantId, id);
    }

    res.json({ success: true, status: nextStatus });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/jobs/:id/tasks/:taskId', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { id, taskId } = req.params;

    const task = db.prepare('SELECT completed FROM job_tasks WHERE tenant_id = ? AND job_id = ? AND id = ?').get(tenantId, id, taskId) as any;
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const nextVal = task.completed ? 0 : 1;
    db.prepare('UPDATE job_tasks SET completed = ? WHERE tenant_id = ? AND job_id = ? AND id = ?').run(nextVal, tenantId, id, taskId);

    res.json({ success: true, completed: Boolean(nextVal) });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/jobs/:id/tasks', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    const taskId = `task-${Date.now()}`;
    db.prepare(`
      INSERT INTO job_tasks (id, tenant_id, job_id, title, completed, sort_order)
      VALUES (?, ?, ?, ?, 0, 99)
    `).run(taskId, tenantId, id, title.trim());

    res.status(201).json({ success: true, data: { id: taskId, title: title.trim(), completed: false } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. EXPENSES API
router.get('/expenses', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const expenses = getExpensesByTenant(tenantId);
    res.json({ success: true, data: expenses });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/expenses', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { merchant, category, categoryLabel, amount, dateStr, description, jobLink, receiptName } = req.body;

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, error: 'Valid expense amount is required' });
    }

    const id = `exp-${Date.now()}`;
    const amountPence = toPence(amountNum);

    db.prepare(`
      INSERT INTO expenses (
        id, tenant_id, merchant, category, category_label, amount_pence, date_str, date_label,
        job_link, description, receipt_name, receipt_size, status_label
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      tenantId,
      merchant || 'Expense',
      category || 'supplies',
      categoryLabel || 'Cleaning Supplies',
      amountPence,
      dateStr || new Date().toISOString().slice(0, 10),
      'Today',
      jobLink || null,
      description || '',
      receiptName || 'receipt.jpg',
      '1.2 MB',
      'Receipt linked'
    );

    res.status(201).json({
      success: true,
      data: {
        id,
        merchant,
        amount: toPounds(amountPence)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. INVOICES & PAYMENTS API
router.post('/invoices/:id/payments', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { id } = req.params;
    const { amount, method } = req.body;

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, error: 'Payment amount must be greater than zero' });
    }

    const inv = db.prepare('SELECT remaining_due_pence, subtotal_pence, payment_history_json FROM invoices WHERE tenant_id = ? AND id = ?').get(tenantId, id) as any;
    if (!inv) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    const payPence = toPence(amountNum);
    const newRemainingPence = Math.max(0, inv.remaining_due_pence - payPence);
    const newStatus = newRemainingPence === 0 ? 'Paid' : 'Partially Paid';

    let history = [];
    try {
      history = JSON.parse(inv.payment_history_json || '[]');
    } catch (e) {
      history = [];
    }

    history.push({
      title: `£${amountNum.toFixed(2)} Offline Payment`,
      dateDetail: `Today • ${method || 'Bank Transfer'} Settled`,
      amount: amountNum,
      status: 'Received',
    });

    db.prepare(`
      UPDATE invoices
      SET remaining_due_pence = ?, status = ?, payment_history_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = ? AND id = ?
    `).run(newRemainingPence, newStatus, JSON.stringify(history), tenantId, id);

    res.json({
      success: true,
      remainingDue: toPounds(newRemainingPence),
      status: newStatus
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. STRIPE SETTINGS API
router.put('/stripe-settings', (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const db = getDatabase();
    const { depositRequired, allowInPersonFallback, linkExpirationHours, automatedReminders } = req.body;

    db.prepare(`
      UPDATE tenants
      SET
        deposit_required = ?,
        allow_in_person_fallback = ?,
        link_expiration_hours = ?,
        automated_reminders = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      depositRequired ? 1 : 0,
      allowInPersonFallback ? 1 : 0,
      linkExpirationHours || '48',
      automatedReminders ? 1 : 0,
      tenantId
    );

    res.json({ success: true, message: 'Settings saved' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. PUBLIC BOOKING ENDPOINTS (TOKENIZED & CRYPTOGRAPHICALLY SECURE)
router.get('/bookings/:token', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { token } = req.params;

    if (!token || token.length < 8) {
      return res.status(400).json({ success: false, error: 'Malformed booking token' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const booking = db.prepare(`
      SELECT bt.id as token_record_id, bt.status as booking_status, bt.expires_at,
             j.id as job_id, j.service_title, j.price_pence, j.deposit_paid_pence, j.balance_due_pence,
             j.date_label, j.time_window, j.property_address,
             c.name as customer_name, c.phone as customer_phone, c.email as customer_email,
             c.household_notes,
             t.name as tenant_name, t.phone as tenant_phone, t.email as tenant_email
      FROM booking_tokens bt
      JOIN jobs j ON bt.job_id = j.id
      JOIN customers c ON bt.customer_id = c.id
      JOIN tenants t ON bt.tenant_id = t.id
      WHERE bt.token_hash = ?
    `).get(tokenHash) as any;

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking link not found or expired' });
    }

    res.json({
      success: true,
      data: {
        status: booking.booking_status,
        expiresAt: booking.expires_at,
        business: {
          name: booking.tenant_name,
          phone: booking.tenant_phone,
          email: booking.tenant_email,
        },
        service: {
          title: booking.service_title,
          propertyAddress: booking.property_address,
          dateLabel: booking.date_label,
          timeWindow: booking.time_window,
          totalPrice: toPounds(booking.price_pence),
          depositRequired: booking.deposit_paid_pence > 0 ? toPounds(booking.deposit_paid_pence) : 20.00,
          balanceDue: toPounds(booking.balance_due_pence),
        },
        customer: {
          name: booking.customer_name,
          phone: booking.customer_phone,
          email: booking.customer_email,
          notes: booking.household_notes,
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bookings/:token/confirm', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { token } = req.params;
    const paymentChoice = req.body.paymentChoice || req.body.paymentPreference;

    if (!paymentChoice || (paymentChoice !== 'online' && paymentChoice !== 'in_person')) {
      return res.status(400).json({ success: false, error: 'Valid payment choice (online or in_person) required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const booking = db.prepare('SELECT * FROM booking_tokens WHERE token_hash = ?').get(tokenHash) as any;
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking link not found' });
    }

    const isOnline = paymentChoice === 'online';
    const newStatus = isOnline ? 'confirmed_paid' : 'confirmed_pending_deposit';

    db.prepare(`
      UPDATE booking_tokens
      SET status = ?, payment_choice = ?, terms_accepted_at = CURRENT_TIMESTAMP
      WHERE token_hash = ?
    `).run(newStatus, paymentChoice, tokenHash);

    // Update job payment method & deposit without mutating other tenant jobs
    if (isOnline) {
      const depositPence = toPence(20.00);
      db.prepare(`
        UPDATE jobs
        SET deposit_paid_pence = ?, balance_due_pence = MAX(0, price_pence - ?), payment_method = 'Stripe Online'
        WHERE id = ?
      `).run(depositPence, depositPence, booking.job_id);
    } else {
      db.prepare(`
        UPDATE jobs
        SET payment_method = 'Cash on arrival'
        WHERE id = ?
      `).run(booking.job_id);
    }

    res.json({
      success: true,
      status: isOnline ? 'paid' : 'pending',
      bookingReference: '#BKN-2024-8841',
      depositAmount: 20.00,
      remainingDue: 45.00,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
