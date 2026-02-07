import type { NextPage } from 'next'
import Head from 'next/head'

/**
 * Home Page / Login Page
 * 
 * This is the landing page of the application.
 * For now, it's a simple placeholder. Will be replaced with:
 * - Login form for authenticated users
 * - Redirect to dashboard if already logged in
 * 
 * Next Steps (Phase 2):
 * - Add login form
 * - Integrate with authentication API
 * - Add form validation
 * - Handle login errors
 */

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Clinical Lab Management</title>
        <meta name="description" content="Clinical Laboratory Management Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Clinical Lab Management
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Laboratory Information Management System
            </p>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome to LabApp V2
              </h2>
              <p className="text-gray-600 mb-4">
                Your comprehensive solution for clinical laboratory management.
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Exam Order Management</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Patient Clinical Records</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Multi-Branch Support</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Financial Reports & Billing</span>
                </div>
              </div>
              
              <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Login (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
