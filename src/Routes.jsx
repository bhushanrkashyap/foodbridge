import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DonorDashboard from './pages/donor-dashboard';
import LoginPage from './pages/login';
import PostSurplusFood from './pages/post-surplus-food';
import FoodDetailsPage from './pages/food-details';
import RecipientDashboard from './pages/recipient-dashboard';
import Register from './pages/register';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/settings';
import AboutPage from './pages/about';
import HowItWorksPage from './pages/how-it-works';
import ImpactPage from './pages/impact';
import HelpCenterPage from './pages/help-center';
import ContactPage from './pages/contact';
import PrivacyPolicyPage from './pages/privacy-policy';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post-surplus-food" element={<PostSurplusFood />} />
        <Route path="/food-details" element={<FoodDetailsPage />} />
        <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
