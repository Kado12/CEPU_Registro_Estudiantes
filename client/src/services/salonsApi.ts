import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface Salon {
   id: number
   name: string
   code: string
   capacity: number
   priority: number
   sede_id: number
   turn_id: number
   registration_process_id: number
}

export const createSalon = async (salonData: Omit<Salon, 'id'>, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.post(`${API_URL}/salons/create`, { salonData, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listSalons = async () => {
   const response = await axios.get(`${API_URL}/salons/list`)
   return response.data
}

export const deleteSalon = async (salonId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/salons/delete/${salonId}`, {
      headers: {
         Authorization: `Bearer ${token}`
      },
      data: {
         is_administrator: is_administrator // Assuming the user is an administrator
      }
   })
   return response.data
}