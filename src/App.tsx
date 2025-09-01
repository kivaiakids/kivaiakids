import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Admin from "./pages/Admin";
import CreateCourse from "./pages/CreateCourse";
import ManageUsers from "./pages/ManageUsers";
import ManageCourses from "./pages/ManageCourses";
import UserProfile from "./pages/UserProfile";
import Terms from "./pages/Terms";
import Premium from "./pages/Premium";
import Pricing from "./pages/Pricing";
import EveilAuxLangues from "./pages/EveilAuxLangues";
import EveilSection from "./pages/EveilSection";
import EveilDetail from "./pages/EveilDetail";
import ManageEveil from "./pages/admin/ManageEveil";
import CreateEveil from "./pages/admin/CreateEveil";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<Course />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/create-course" element={<CreateCourse />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-courses" element={<ManageCourses />} />
            <Route path="/admin/eveil" element={<ManageEveil />} />
            <Route path="/admin/eveil/new" element={<CreateEveil />} />
            <Route path="/admin/eveil/:id/edit" element={<CreateEveil />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/eveil-aux-langues" element={<EveilAuxLangues />} />
            <Route path="/eveil-aux-langues/:section" element={<EveilSection />} />
            <Route path="/eveil/:slug" element={<EveilDetail />} />
            <Route path="/purchase-success" element={<PurchaseSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
