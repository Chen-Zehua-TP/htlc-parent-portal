import Navbar from "./components/Navbar";

import {Navigate, Route,Routes} from "react-router-dom"
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/auth.store.js";
import { useEffect } from "react";
import {Loader} from 'lucide-react'

import { Toaster } from "react-hot-toast"
const App = ()=>{
  const {authUser,isCheckingAuth,checkAuth} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log(authUser)

  if(!authUser && isCheckingAuth){
    return (
     <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin size-10"/>
     </div>
     )}

 return(
  <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser?<Home/>: <Navigate to="/Login"/>}/>
        <Route path="/Login" element={!authUser?<Login/>: <Navigate to="/"/>}/>
      </Routes>

      <Toaster/>

      </div>
  );
}

export default App