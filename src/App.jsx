import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DonorDashboard from "./pages/donor-dashboard"; // Adjust path if needed
import LoginForm from "./pages/login/components/LoginForm";
import RegisterForm from "./pages/login/components/RegisterForm";
// import RecipientDashboard from "./pages/recipient/RecipientDashboard"; // Commented out, file missing
import PostSurplusFood from "./pages/post-surplus-food"; // Import the main page, not just PhotoUpload

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        {/* <Route path="/recipient-dashboard" element={<RecipientDashboard />} /> */}
        <Route path="donor-dashboard" element={<LoginForm />} />
        <Route path="/post-surplus-food" element={<PostSurplusFood />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
