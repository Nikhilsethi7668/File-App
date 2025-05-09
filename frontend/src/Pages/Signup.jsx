import React, { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../Context/UserContext';

const validationSchema = Yup.object({
    userName: Yup.string()
        .required('User name is required')
        .min(2, 'User name must be at least 2 characters')
        .max(50, 'User name cannot be longer than 50 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot be longer than 20 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignUp = () => {
    const { signup } = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submission = async (data) => {
        setIsSubmitting(true);
        const { confirmPassword, ...signupData } = data;
        console.log(signupData);

        try {
            await signup(signupData);
            alert('Registration Successful!');
        } catch (error) {
            alert(error.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
                <p className="text-gray-500 text-center mb-8">Join us to get started</p>
                
                <Formik
                    initialValues={{ userName: '', email: '', password: '', confirmPassword: '', isAdmin: false }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => submission(values)}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-5">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                                <Field 
                                    type="text" 
                                    id="userName" 
                                    name="userName" 
                                    placeholder="Enter your name" 
                                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.userName && touched.userName ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200`} 
                                />
                                {errors.userName && touched.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <Field 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="your@email.com" 
                                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.email && touched.email ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200`} 
                                />
                                {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <Field 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.password && touched.password ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200`} 
                                />
                                {errors.password && touched.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <Field 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    placeholder="••••••••" 
                                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition duration-200`} 
                                />
                                {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                            
                            <div className="flex items-center">
                                <Field 
                                    type="checkbox" 
                                    id="isAdmin" 
                                    name="isAdmin" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                />
                                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">Admin privileges</label>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </Form>
                    )}
                </Formik>
                
                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;