import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";

import { validatePassword, getPasswordStrength } from "../../utils/validation";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      const validation = validatePassword(value);
      setPasswordErrors(validation.errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      setPasswordErrors(validation.errors);
      toast.error("Please fix password requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.signup(formData);
      if (response.data.success) {
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-[85vh] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent-cyan rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="border bg-gray-900 text-white font-extrabold text-lg rounded-xl py-3 px-6">
              C
            </span>
            <span className="text-4xl font-bold">CartVerse</span>
          </Link>
          <h1 className="text-3xl font-bold text-center mb-4">
            Join the Tech Revolution
          </h1>
          <p className="text-gray-500 text-center text-lg max-w-md">
            Create your account and start discovering the latest gadgets at
            unbeatable prices.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100"
            onSubmit={handleSubmit}
          >
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CUSTOMER" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === "CUSTOMER"
                      ? "border-green-500 bg-green-50 "
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* <User size={24} className={`mx-auto mb-2 ${formData.role === 'CUSTOMER' ? 'text-primary-600' : 'text-gray-400'}`} /> */}
                  <p
                    className={`font-semibold ${
                      formData.role === "CUSTOMER"
                        ? "text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    Shop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Browse & buy products
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "SELLER" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === "SELLER"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* <Store size={24} className={`mx-auto mb-2 ${formData.role === 'SELLER' ? 'text-green-600' : 'text-gray-400'}`} /> */}
                  <p
                    className={`font-semibold ${
                      formData.role === "SELLER"
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    Sell
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    List & sell products
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-gray-200 rounded">
                      <div
                        className={`h-1 rounded transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(5 - passwordErrors.length) * 20}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                  {passwordErrors.length > 0 && (
                    <ul className="text-xs text-red-600 space-y-1">
                      {passwordErrors.map((error, i) => (
                        <li key={i}>- {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full mt-5" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
