import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient"; // Adjust path if needed
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "donor"
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Register with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Insert user into 'users' table
    const { error: dbError } = await supabase
      .from("users")
      .insert([{ email: formData.email, name: formData.name, role: formData.role }]);
    setLoading(false);
    
    // Redirect based on user role
    if (formData.role === 'donor') {
      navigate("/donor-dashboard");
    } else if (formData.role === 'recipient') {
      navigate("/recipient-dashboard");
    } else {
      // Default to donor dashboard
      navigate("/donor-dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-elevated p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="UserPlus" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Create Your Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Register to start donating with FoodBridge
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center">
            <Icon name="AlertCircle" size={16} className="text-error mr-2 flex-shrink-0" />
            <span className="text-error text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mb-4"
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mb-4"
          />
          <div className="relative mb-4">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-border rounded px-3 py-2"
            >
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
            </select>
          </div>
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={loading}
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        {/* Login Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
