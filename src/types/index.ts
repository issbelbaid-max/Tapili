export type TabType = 'home' | 'jobs' | 'customers' | 'money' | 'more';

export type ScreenId = 
  | 'home'
  | 'jobs'
  | 'job-detail'
  | 'new-job'
  | 'customers'
  | 'customer-profile'
  | 'money'
  | 'invoice-detail'
  | 'new-invoice'
  | 'calendar'
  | 'stripe-settings'
  | 'customer-checkout'
  | 'booking-confirmed';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  cadence: 'weekly' | 'fortnightly' | 'monthly' | 'ad-hoc';
  cadenceLabel: string;
  isRegular: boolean;
  clientSince: string;
  keysHeldNote: string;
  householdNotes: string;
  ecoNotes?: string;
  lockboxCode: string;
  lockboxLocation: string;
  alarmCode?: string;
  standardRate: number;
  totalPaidLifetime: number;
  cleansCompleted: number;
  outstandingBalance: number;
  overdueInvoice?: {
    id: string;
    number: string;
    amount: number;
    daysOverdue: number;
  };
}

export interface JobTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  dateStr: string;
  dateLabel: string;
  timeWindow: string;
  serviceCategory: string;
  serviceTitle: string;
  serviceDetails: string;
  propertyAddress: string;
  postcodeArea: string;
  price: number;
  depositPaid: number;
  balanceDue: number;
  status: 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled';
  paymentMethod: 'Cash on arrival' | 'Card Payment setup' | 'Bank Transfer • Auto-invoiced' | 'Stripe Online' | 'BACS';
  accessNote: string;
  lockboxCode?: string;
  petNote?: string;
  travelEstimateTime?: string;
  travelEstimateDistance?: string;
  directCostEstimate: number;
  netProfitEstimate: number;
  hourlyRateEstimate: number;
  tasks: JobTask[];
  photosCount: number;
}

export interface Expense {
  id: string;
  merchant: string;
  category: 'supplies' | 'equipment' | 'transport' | 'staff' | 'insurance';
  categoryLabel: string;
  amount: number;
  dateStr: string;
  dateLabel: string;
  jobLink?: string;
  description: string;
  receiptName?: string;
  receiptSize?: string;
  statusLabel: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  detail: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  issuedDate: string;
  dueDateLabel: string;
  status: 'Partially Paid' | 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceLineItem[];
  subtotal: number;
  depositCollected: number;
  remainingDue: number;
  paymentHistory: {
    title: string;
    dateDetail: string;
    amount: number;
    status: 'Received' | 'Pending';
  }[];
}

export interface StripeSettings {
  accountId: string;
  status: 'active' | 'verification' | 'paused' | 'disconnected';
  bankName: string;
  bankAccountMasked: string;
  dailyRollingPayouts: boolean;
  depositRequired: boolean;
  allowInPersonFallback: boolean;
  linkExpirationHours: '24' | '48' | '72' | 'never';
  automatedReminders: boolean;
}
