import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useEffect } from 'react'
import { useUserStore } from './stores/useUserStore'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoadingSpinner from './components/LoadingSpinner'
import HostPage from './pages/HostPage'
import PropertyPage from './pages/Property'
import BookingPage from './pages/yourBooking'
import BookingSuccessPage from './pages/PropertySuccess'
import BookingCancelPage from './pages/PropertyRejection'

const App = () => {
	const { user, checkAuth, checkingAuth } = useUserStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);
	if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/host-dashboard'
						element={user?.role === "host" ? <HostPage/> : <Navigate to='/login' />}
					/>
					<Route path='/property/:id' element={<PropertyPage />} />
					<Route path='/yourBooking' element={user ? <BookingPage /> : <Navigate to='/login' />} />
					<Route
						path='/booking-success'
						element={user ? <BookingSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/booking-cancel' element={user ? <BookingCancelPage /> : <Navigate to='/login' />} />
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App