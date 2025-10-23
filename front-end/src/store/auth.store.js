import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isLoggingIn:false,

    checkAuth:async()=>{
        try {
            console.log('[LOG] checkAuth called - checking authentication status');
            // const response =await axiosInstance.get('/auth/check');
            // console.log(response.data + 'this is the response') 
            // set({authUser:response.data})
            console.log('[LOG] checkAuth: No backend available, auth check skipped');
        } catch (error) {
            set({authUser:null})
            console.log('[LOG] checkAuth error:', error)
            
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    login:async(formdata)=>{
      set({isLoggingIn:true})
      try {
        console.log('[LOG] login called with formData:', formdata);
        // const response = await axiosInstance.post('/auth/login',formdata)
        // Mock response - accept any credentials
        const mockResponse = {
          studentId: formdata.studentid,
          studentName: 'John Doe',
          studentLevel: 'Year 10'
        };
        console.log('[LOG] login: Mock response:', mockResponse);
        set({authUser:mockResponse})
        toast.success('Logged in successfully')
        
      } catch (error) {
        console.log('[LOG] login error:', error)
        toast.error(error.response?.data?.message || 'Login failed')
        set({authUser:null})
      }finally{
        set({isLoggingIn:false})
      }
    },


    logout:async()=>{
      try {
       console.log('[LOG] logout called');
       // await axiosInstance.post('/auth/logout')
        toast.success('successs')
        set({authUser:null})
        console.log('[LOG] logout: No backend available, logout completed locally');
      } catch (error) {
        console.log('[LOG] error in logging out', error)
        toast.error(error)
      }
    }

})) 