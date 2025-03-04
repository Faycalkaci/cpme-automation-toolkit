
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Spreadsheets from "./pages/dashboard/Spreadsheets";
import Documents from "./pages/dashboard/Documents";
import Templates from "./pages/dashboard/Templates";
import Emails from "./pages/dashboard/Emails";
import Settings from "./pages/dashboard/Settings";
import SuperAdmin from "./pages/dashboard/SuperAdmin";
import Users from "./pages/dashboard/Users";
import Billing from "./pages/dashboard/Billing";
import Licenses from "./pages/dashboard/Licenses";
import Statistics from "./pages/dashboard/Statistics";
import Forms from "./pages/dashboard/Forms";
import PaymentSuccess from "./pages/dashboard/PaymentSuccess";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PaymentRequiredRoute from "./components/auth/PaymentRequiredRoute";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Super admin route component
const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Chargement...</div>;
  }
  
  if (!user || user.role !== 'super-admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Payment success page - accessible without authentication */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spreadsheets" element={<Spreadsheets />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>} />
          
          {/* Routes that require payment */}
          <Route element={<PaymentRequiredRoute />}>
            <Route path="/forms" element={<Forms />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <FirebaseProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default App;
