import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from "react-hot-toast";
export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isLoggingIn:false,

    checkAuth:async()=>{
        try {
            const response =await axiosInstance.get('/auth/check');
            console.log(response.data + 'this is the response') 
            set({authUser:response.data})
        } catch (error) {
            set({authUser:null})
            console.log(error)
            
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    login:async(formdata)=>{
      set({isLoggingIn:true})
      try {
        const response = await axiosInstance.post('/auth/login',formdata)
        set({authUser:response.data})
        if(response){toast.success('Logged in successfully')}
        
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        set({authUser:null})
      }finally{
        set({isLoggingIn:false})
      }
    },


    logout:async()=>{
      try {
       await axiosInstance.post('/auth/logout')
        toast.success('successs')
        set({authUser:null})
      } catch (error) {
        console.log('error in logging out', error)
        toast.error(error)
      }
    }

})) 