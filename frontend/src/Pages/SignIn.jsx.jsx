import React, { useContext, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
// import Navbar from '../Components/Navbar/Navbar/Navbar';

// Validation Schema
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

const SignIn = () => {
    const { login, loading, user, logout, isAuthenticated } = useContext(UserContext); // Use logout from UserContext
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (data, resetForm) => {
        try {
            await login(data); // Use the login function from UserContext
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Invalid email or password');
            resetForm();
        }
    };

    // If user is logged in, show the "already logged in" page with a logout button
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome, {user.name || 'User'}! 🎉
                    </h2>
                    <p className="text-gray-600">
                        You are already logged in.
                    </p>
                    <button
                        onClick={logout} // Call logout function to log out the user
                        className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                        Log out
                    </button>
                </div>
            </div>
        );
    }

    // If user is not logged in, show the SignIn form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-purple-300 py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(data, { resetForm }) => {
                        const formattedData = { ...data, email: data.email.toLowerCase() };
                        handleLogin(formattedData, resetForm);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="mt-8 space-y-6">
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Email address
                                    </label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="error text-red-500 text-sm mt-2">{errorMessage}</div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <NavLink
                                        to="/forgot"
                                        className="font-medium text-purple-600 hover:text-purple-500"
                                    >
                                        Forgot your password?
                                    </NavLink>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <NavLink
                            to="/register"
                            className="font-medium text-purple-600 hover:text-purple-500"
                        >
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;