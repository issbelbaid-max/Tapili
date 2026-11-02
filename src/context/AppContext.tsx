import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Job, Expense, Invoice, StripeSettings, ScreenId, TabType } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_JOBS, INITIAL_EXPENSES, INITIAL_INVOICE, INITIAL_STRIPE_SETTINGS } from '../data/mockData';

interface AppContextType {
  currentScreen: ScreenId;
  activeTab: TabType;
  selectedJobId: string;
  selectedCustomerId: string;
  jobs: Job[];
  customers: Customer[];
  expenses: Expense[];
  invoice: Invoice;
  stripeSettings: StripeSettings;
  isLogExpenseOpen: boolean;
  isAddCustomerOpen: boolean;
  isNotificationsOpen: boolean;
  toastMessage: string | null;
  bookingLink: string;
  bookingStatus: 'paid' | 'pending' | 'expired';
  isLoading: boolean;
  
  // Navigation & Modal triggers
  navigateTo: (screen: ScreenId, params?: { jobId?: string; customerId?: string }) => void;
  setActiveTab: (tab: TabType) => void;
  setIsLogExpenseOpen: (open: boolean) => void;
  setIsAddCustomerOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  setBookingStatus: (status: 'paid' | 'pending' | 'expired') => void;
  regenerateBookingLink: () => string;
  
  // Domain actions
  toggleJobTask: (jobId: string, taskId: string) => void;
  addJobTask: (jobId: string, title: string) => void;
  markJobComplete: (jobId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addCustomer: (customerData: Partial<Customer>) => Promise<Customer>;
  addJob: (newJobData: Partial<Job>) => string;
  recordPayment: (amount: number, method: string) => void;
  updateStripeSettings: (patch: Partial<StripeSettings>) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-charlotte');
  
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [invoice, setInvoice] = useState<Invoice>(INITIAL_INVOICE);
  const [stripeSettings, setStripeSettings] = useState<StripeSettings>(INITIAL_STRIPE_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [bookingLink, setBookingLink] = useState('https://tapili.co/book/bkn_8f92ae07');
  const [bookingStatus, setBookingStatus] = useState<'paid' | 'pending' | 'expired'>('paid');

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Hydrate persistent state from SQLite via /api/bootstrap
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.customers?.length) setCustomers(json.data.customers);
          if (json.data.jobs?.length) setJobs(json.data.jobs);
          if (json.data.expenses?.length) setExpenses(json.data.expenses);
          if (json.data.invoice) setInvoice(json.data.invoice);
          if (json.data.stripeSettings) setStripeSettings(json.data.stripeSettings);
        }
      }
    } catch (err) {
      console.warn('API hydration fallback to local memory state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const navigateTo = (screen: ScreenId, params?: { jobId?: string; customerId?: string }) => {
    if (params?.jobId) setSelectedJobId(params.jobId);
    if (params?.customerId) setSelectedCustomerId(params.customerId);
    
    setCurrentScreen(screen);
    if (screen === 'home') setActiveTabState('home');
    else if (screen === 'jobs' || screen === 'job-detail' || screen === 'calendar') setActiveTabState('jobs');
    else if (screen === 'customers' || screen === 'customer-profile') setActiveTabState('customers');
    else if (screen === 'money' || screen === 'invoice-detail' || screen === 'new-invoice') setActiveTabState('money');
    else if (screen === 'stripe-settings') setActiveTabState('more');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'jobs') setCurrentScreen('jobs');
    else if (tab === 'customers') setCurrentScreen('customers');
    else if (tab === 'money') setCurrentScreen('money');
    else if (tab === 'more') setCurrentScreen('stripe-settings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleJobTask = async (jobId: string, taskId: string) => {
    // Optimistic UI update
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        tasks: job.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
      };
    }));

    try {
      await fetch(`/api/jobs/${jobId}/tasks/${taskId}`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to sync task toggle to backend:', err);
    }
  };

  const addJobTask = async (jobId: string, title: string) => {
    const tempId = `task-${Date.now()}`;
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        tasks: [...job.tasks, { id: tempId, title, completed: false }]
      };
    }));
    showToast(`Added task: ${title}`);

    try {
      const res = await fetch(`/api/jobs/${jobId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.id) {
          setJobs(prev => prev.map(j => {
            if (j.id !== jobId) return j;
            return {
              ...j,
              tasks: j.tasks.map(t => t.id === tempId ? { ...t, id: json.data.id } : t)
            };
          }));
        }
      }
    } catch (err) {
      console.error('Failed to persist task:', err);
    }
  };

  const markJobComplete = async (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      const willBeCompleted = job.status !== 'Completed';
      return {
        ...job,
        status: willBeCompleted ? 'Completed' : 'In Progress',
        tasks: willBeCompleted ? job.tasks.map(t => ({ ...t, completed: true })) : job.tasks
      };
    }));
    showToast('Job status updated');

    try {
      await fetch(`/api/jobs/${jobId}/complete`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to sync complete status:', err);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    const tempId = `exp-${Date.now()}`;
    const newExp: Expense = {
      ...expenseData,
      id: tempId,
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense recorded (-£${newExp.amount.toFixed(2)})`);

    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
    } catch (err) {
      console.error('Failed to persist expense:', err);
    }
  };

  const addCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save customer');
      }

      const newCust: Customer = json.data;
      setCustomers(prev => [newCust, ...prev]);
      showToast(`Client "${newCust.name}" added successfully`);
      return newCust;
    } catch (err: any) {
      console.error('Error adding customer:', err);
      throw err;
    }
  };

  const addJob = (newJobData: Partial<Job>) => {
    const newId = `job-${Date.now()}`;
    const price = newJobData.price || 75.00;
    const deposit = newJobData.depositPaid || 20.00;
    const newJob: Job = {
      id: newId,
      jobNumber: `#JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: newJobData.customerId || 'cust-charlotte',
      customerName: newJobData.customerName || 'Charlotte Davies',
      dateStr: newJobData.dateStr || '2024-10-25',
      dateLabel: newJobData.dateLabel || 'Tomorrow, 25 Oct',
      timeWindow: newJobData.timeWindow || '09:30 – 12:30',
      serviceCategory: newJobData.serviceCategory || 'Domestic',
      serviceTitle: newJobData.serviceTitle || 'Regular Clean',
      serviceDetails: newJobData.serviceDetails || 'Standard domestic refresh',
      propertyAddress: newJobData.propertyAddress || '14 Richmond Crescent, London N1 0TR',
      postcodeArea: newJobData.postcodeArea || 'Islington (N1)',
      price: price,
      depositPaid: deposit,
      balanceDue: Math.max(0, price - deposit),
      status: 'Scheduled',
      paymentMethod: 'Stripe Online',
      accessNote: 'Lockbox code #4920 on front porch',
      directCostEstimate: 8.00,
      netProfitEstimate: price - 8.00,
      hourlyRateEstimate: 28.50,
      tasks: [
        { id: `t_${newId}_1`, title: 'Kitchen surfaces & hob descaling', completed: false },
        { id: `t_${newId}_2`, title: 'Sanitise bathrooms & mirrors', completed: false },
        { id: `t_${newId}_3`, title: 'Vacuum & steam mop floors', completed: false },
      ],
      photosCount: 0,
    };
    setJobs(prev => [newJob, ...prev]);
    showToast('Job confirmed & scheduled!');

    // Persist to backend asynchronously
    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJobData)
    }).then(res => res.json()).then(json => {
      if (json.data?.bookingUrl) {
        setBookingLink(json.data.bookingUrl);
      }
    }).catch(err => {
      console.error('Failed to persist job to backend:', err);
    });

    return newId;
  };

  const recordPayment = async (amount: number, method: string) => {
    setInvoice(prev => {
      const newRemaining = Math.max(0, prev.remainingDue - amount);
      return {
        ...prev,
        remainingDue: newRemaining,
        status: newRemaining === 0 ? 'Paid' : 'Partially Paid',
        paymentHistory: [
          ...prev.paymentHistory,
          {
            title: `£${amount.toFixed(2)} Offline Payment`,
            dateDetail: `Today • ${method} Settled`,
            amount,
            status: 'Received',
          }
        ]
      };
    });
    showToast(`Recorded £${amount.toFixed(2)} payment via ${method}`);

    try {
      await fetch(`/api/invoices/${invoice.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method })
      });
    } catch (err) {
      console.error('Failed to persist offline payment:', err);
    }
  };

  const updateStripeSettings = async (patch: Partial<StripeSettings>) => {
    const updated = { ...stripeSettings, ...patch };
    setStripeSettings(updated);
    showToast('Payment settings saved');

    try {
      await fetch('/api/stripe-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Failed to persist Stripe settings:', err);
    }
  };

  const regenerateBookingLink = () => {
    const randId = Math.random().toString(36).substring(2, 10);
    const newUrl = `https://tapili.co/book/bkn_${randId}`;
    setBookingLink(newUrl);
    showToast('Booking link refreshed');
    return newUrl;
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        activeTab,
        selectedJobId,
        selectedCustomerId,
        jobs,
        customers,
        expenses,
        invoice,
        stripeSettings,
        isLogExpenseOpen,
        isAddCustomerOpen,
        isNotificationsOpen,
        toastMessage,
        bookingLink,
        bookingStatus,
        isLoading,
        navigateTo,
        setActiveTab,
        setIsLogExpenseOpen,
        setIsAddCustomerOpen,
        setIsNotificationsOpen,
        showToast,
        setBookingStatus,
        regenerateBookingLink,
        toggleJobTask,
        addJobTask,
        markJobComplete,
        addExpense,
        addCustomer,
        addJob,
        recordPayment,
        updateStripeSettings,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
