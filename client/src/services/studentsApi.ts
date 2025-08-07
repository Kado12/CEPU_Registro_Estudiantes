import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

interface Student {
   id: number
   name: string,
   last_name: string,
   dni: number
   phone?: number,
   record_number: number,
   date_inscription: string,
   payment_plan_id: number,
   need_to_pay: boolean,
   registration_process_id: number,
   sede_id: number
   turn_id: number
   salon_id?: number
   pdf_file?: string
   photo_base_64?: string
}

export const createStudent = async (studentData: Omit<Student, 'id'>, photo: string, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.post(`${API_URL}/students/create`, { studentData, photo, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const listStudents = async () => {
   const response = await axios.get(`${API_URL}/students/list`)
   return response.data.data
}

export const deleteStudent = async (studentId: number, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.delete(`${API_URL}/students/delete/${studentId}`, {
      headers: {
         Authorization: `Bearer ${token}`
      },
      data: {
         is_administrator: is_administrator
      }
   })
   return response.data
}

export const updateStudent = async (studentId: number, studentData: Omit<Student, 'id'>, photo: string, is_administrator: boolean, token: string) => {
   if (!token) {
      throw new Error("Token no encontrado")
   }
   const response = await axios.put(`${API_URL}/students/update/${studentId}`, { studentData, photo, is_administrator }, {
      headers: {
         Authorization: `Bearer ${token}`
      }
   })
   return response.data
}

export const downloadPDF = async (studentId: number, is_administrator: boolean, token: string) => {
   const response = await axios.get(`${API_URL}/students/download-pdf/${studentId}`, {
      headers: {
         Authorization: `Bearer ${token}`
      },
      data: {
         is_administrator: is_administrator
      }
   })
   return response.data
}