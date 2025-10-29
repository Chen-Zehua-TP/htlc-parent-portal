import Navbar from "./components/Navbar";
import WhatsAppButton from "./components/WhatsAppButton";

import {Navigate, Route,Routes} from "react-router-dom"
import Login from "./pages/Login";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import { useAuthStore } from "./store/auth.store.js";
import {useAttendanceStore} from "./store/attendance.store.js";
import { useEffect } from "react";
import Loader from './components/FactsLoader';

import { Toaster } from "react-hot-toast"
const App = ()=>{
  const {authUser, isLoading: authLoading, initializeAuth} = useAuthStore()
  const { isLoading: attendanceLoading } = useAttendanceStore()

  useEffect(()=>{
    // Initialize auth from stored token on app load
    initializeAuth()
  }, [])

  console.log('[LOG] authUser:', authUser)

  if((!authUser && authLoading) || attendanceLoading){
    return (
     <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin size-10"/>
     </div>
     )}

 return(
  <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser?<Home/>: <Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser?<Login/>: <Navigate to="/"/>}/>
        <Route path="/attendance" element={authUser?<Attendance/>: <Navigate to="/login"/>}/>
      </Routes>

      <WhatsAppButton/>
      <Toaster/>

      </div>
  );
}

export default App