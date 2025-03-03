
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";

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
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spreadsheets" element={<Spreadsheets />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>} />
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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
