import React, { useContext, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
// import { signup } from '../store/useAuthStore.js';
import { UserContext } from '../Context/UserContext';
import { NavLink } from 'react-router-dom';


const validationSchema = Yup.object({
    userName: Yup.string()
        .required('user name is required')
        .min(2, 'user name must be at least 2 characters')
        .max(50, 'user name cannot be longer than 50 characters'),
    email: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot be longer than 50 characters'),
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
    const { user, signup, verifyEmail } = useContext(UserContext);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const submission = async (data) => {
        console.log(data);
        setIsSubmitting(true);

        // Destructure confirmPassword from the data object
        const { confirmPassword, ...signupData } = data;

        try {
            // Pass only the relevant fields to the signup function
            await signup(signupData);
            setRegistrationSuccess(true);
        } catch (error) {
            setRegistrationSuccess(false);
            alert(error.message);
        } finally {
            setIsSubmitting(false);  // Reset loading state
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-purple-300">


            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold text-purple-800 mb-6">Join GrantsHub Today</h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Unlock a world of opportunities and secure the funding you need to bring your ideas to life.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>}
                                title="Easy Application"
                                description="Streamlined process to apply for multiple grants with ease."
                            />
                            <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>}
                                title="Expert Support"
                                description="Get guidance from grant specialists to increase your chances."
                            />
                            <FeatureCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>}
                                title="Fund Matching"
                                description="We match you with grants that align with your goals."
                            />
                        </div>
                    </div>

                    <div className="lg:w-1/2">

                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            {registrationSuccess ? (
                                <div className="text-green-600 text-center mb-6">
                                    <h2 className="text-3xl font-bold text-purple-800 mb-6">Registration Successful</h2>
                                    <p className="mb-4">Enter 6 digit code sent to your email to verify your account</p>
                                    <Formik
                                        initialValues={{ code: '' }}
                                        validationSchema={Yup.object({
                                            code: Yup.string()
                                                .required('Code is required')
                                                .length(6, 'Code must be exactly 6 digits')
                                        })}
                                        onSubmit={(values) => {
                                            verifyEmail(values);
                                        }}
                                    >
                                        {({ errors, touched }) => (
                                            <Form className="space-y-4">
                                                <div>
                                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
                                                    <Field
                                                        type="text"
                                                        id="code"
                                                        name="code"
                                                        placeholder="Enter verification code"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    {errors.code && touched.code && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className={`px-6 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {isSubmitting ? 'Verifying...' : 'Verify'}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>



                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-purple-800 mb-6">Register</h2>
                                    <Formik
                                        initialValues={{ userName: '', email: '', password: '', confirmPassword: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => {
                                            submission(values);
                                        }}
                                    >
                                        {({ errors, touched }) => (
                                            <Form className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">UserName</label>
                                                        <Field
                                                            type="text"
                                                            id="userName"
                                                            name="userName"
                                                            placeholder="Enter your user name"
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                        />
                                                        {errors.userName && touched.userName && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                                    <Field
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Enter your email"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    {errors.email && touched.email && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                                    <Field
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        placeholder="Enter your password"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    {errors.password && touched.password && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                                    <Field
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        placeholder="Confirm your password"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                    {errors.confirmPassword && touched.confirmPassword && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                                    )}
                                                </div>

                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className={`px-6 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {isSubmitting ? 'Registering...' : 'Register'}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-purple-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

export default SignUp;