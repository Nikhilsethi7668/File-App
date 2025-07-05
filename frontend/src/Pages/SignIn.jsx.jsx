import React, { useContext, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { FiMail, FiLock, FiLogIn, FiUser, FiArrowRight } from "react-icons/fi";
import ForgetPasswordDialog from "../Components/ForgetPasswordDialog";
import SetPasswordDialog from "../Components/SetPasswordDialog";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const SignIn = () => {
  const { login, loading, user, logout, isAuthenticated } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [forgetOpen, setForgetOpen] = useState(params.get("forget") === "1");
  const [setPasswordOpen, setSetPasswordOpen] = useState(!!params.get("email"));
  const emailParam = params.get("email") || "";

  React.useEffect(() => {
    setForgetOpen(params.get("forget") === "1");
    setSetPasswordOpen(!!params.get("email"));
  }, [location.search]);

  const handleOpenForget = (e) => {
    e.preventDefault();
    params.set("forget", "1");
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleCloseForget = () => {
    params.delete("forget");
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleForgetSuccess = (email) => {
    params.delete("forget");
    params.set("email", email);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleCloseSetPassword = () => {
    params.delete("email");
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleLogin = async (data) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <h2 className="text-2xl font-bold">Welcome back, {user.name || "User"}! 👋</h2>
            <p className="opacity-90">You're already signed in to your account.</p>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-indigo-100 p-4 rounded-full">
                <FiUser className="text-indigo-600 text-2xl" />
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-all duration-200"
            >
              <span>Sign out</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <ForgetPasswordDialog
        open={forgetOpen}
        onClose={handleCloseForget}
        onSuccess={handleForgetSuccess}
      />
      <SetPasswordDialog
        open={setPasswordOpen}
        email={emailParam}
        onClose={handleCloseSetPassword}
      />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="opacity-90">Sign in to continue to your account</p>
        </div>

        <div className="p-8">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(data) => handleLogin({ ...data, email: data.email.toLowerCase() })}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <Field
                      name="email"
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <Field
                      name="password"
                      type="password"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:text-indigo-500 underline bg-transparent border-none p-0 focus:outline-none"
                    onClick={handleOpenForget}
                  >
                    Forgot password?
                  </button>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FiLogIn />
                      <span>Sign in</span>
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
};

export default SignIn;