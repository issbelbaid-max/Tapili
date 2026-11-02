import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { NotificationModal } from './components/NotificationModal';
import { ScreenSwitcher } from './components/ScreenSwitcher';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { JobsScreen } from './components/screens/JobsScreen';
import { JobDetailScreen } from './components/screens/JobDetailScreen';
import { CustomersScreen } from './components/screens/CustomersScreen';
import { CustomerProfileScreen } from './components/screens/CustomerProfileScreen';
import { MoneyScreen } from './components/screens/MoneyScreen';
import { LogExpenseModal } from './components/screens/LogExpenseModal';
import { InvoiceDetailScreen } from './components/screens/InvoiceDetailScreen';
import { NewInvoiceScreen } from './components/screens/NewInvoiceScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { NewJobScreen } from './components/screens/NewJobScreen';
import { StripeConnectScreen } from './components/screens/StripeConnectScreen';
import { CustomerCheckoutScreen } from './components/screens/CustomerCheckoutScreen';
import { BookingConfirmationScreen } from './components/screens/BookingConfirmationScreen';
import { AddCustomerModal } from './components/screens/AddCustomerModal';

const MainContent: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  // Check URL path on mount to handle direct /book/:token links
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/book/')) {
      navigateTo('customer-checkout');
    }
  }, []);

  const isPublicCustomerView = currentScreen === 'customer-checkout' || currentScreen === 'booking-confirmed';

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'jobs':
        return <JobsScreen />;
      case 'job-detail':
        return <JobDetailScreen />;
      case 'new-job':
        return <NewJobScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'customer-profile':
        return <CustomerProfileScreen />;
      case 'money':
        return <MoneyScreen />;
      case 'invoice-detail':
        return <InvoiceDetailScreen />;
      case 'new-invoice':
        return <NewInvoiceScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'stripe-settings':
        return <StripeConnectScreen />;
      case 'customer-checkout':
        return <CustomerCheckoutScreen />;
      case 'booking-confirmed':
        return <BookingConfirmationScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center selection:bg-[#dfe0ff] selection:text-[#000b62]">
      {!isPublicCustomerView ? (
        <>
          <Header />
          <main className="w-full flex-1 pt-16 flex flex-col">
            {renderScreen()}
          </main>
          <BottomNav />
          <LogExpenseModal />
          <AddCustomerModal />
          <NotificationModal />
          <Toast />
          <ScreenSwitcher />
        </>
      ) : (
        <div className="w-full flex-1 flex flex-col items-center">
          {/* Customer Top Bar */}
          <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#eaedff] sticky top-0 z-40 py-2.5 px-4 shadow-xs">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[17px] text-[#3040b6] tracking-tight">Tapili</span>
                <span className="h-3.5 w-px bg-[#dae2fd]"></span>
                <span className="text-[12px] text-[#006f66] bg-[#86f2e4] px-2 py-0.5 rounded-full font-medium">
                  Client Booking Portal
                </span>
              </div>
              <button
                onClick={() => navigateTo('home')}
                className="text-[11px] font-semibold text-[#3040b6] bg-[#eaedff] px-2.5 py-1 rounded-full hover:bg-[#dae2fd] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>Cleaner App</span>
              </button>
            </div>
          </header>

          <main className="w-full flex-1 flex flex-col">
            {renderScreen()}
          </main>
          <Toast />
          <ScreenSwitcher />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
