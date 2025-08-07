import { create } from "zustand"
import { createStudent, deleteStudent, downloadPDF, listStudents, updateStudent } from "../services/studentsApi"

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
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   pdf_file?: string | any
   photo_base_64?: string
}

interface PDF {
   dni: number,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   pdf_file?: string | any
}

interface StudentState {
   student: Student | null
   students: Student[]
   error: string
   success: boolean
   message: string
   loading: boolean
   setStudent: (student: Student | null) => void
   clearStudent: () => void
   refreshStudents: () => Promise<void>
   // addStudent: (studentData: Omit<Student, 'id'>, is_administrator: boolean, token: string) => Promise<>
   addStudent: (studentData: Omit<Student, 'id'>, is_administrator: boolean, token: string) => Promise<Student>
   removeStudent: (studentId: number, is_administrator: boolean, token: string) => Promise<void>
   downloadPDF: (studentId: number, is_administrator: boolean, token: string) => Promise<PDF>
   updateStudent: (studentId: number, studentData: Omit<Student, 'id'>, is_administrator: boolean, token: string) => Promise<Student>
}

export const useStudentStore = create<StudentState>((set) => ({
   students: [],
   student: null,
   error: '',
   success: false,
   message: '',
   loading: false,
   setStudent: (student) => set({ student }),
   clearStudent: () => set({ student: null }),
   refreshStudents: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const students = await listStudents()
         set({ students, loading: false, success: true, message: 'Estudiantes cargados exitosamente.' })
      } catch (error) {
         console.error('Error fetching students:', error)
         set({ error: 'Error al obtener los estudiantes', loading: false, success: false, message: 'Error al obtener los estudiantes.' })
      }
   },
   addStudent: async (studentData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const photo = studentData.photo_base_64 || ''
         const response = await createStudent(studentData, photo, is_administrator, token)
         set((state) => ({
            students: [...state.students, { ...studentData, id: response.data.id }],
            loading: false,
            success: true,
            message: 'Estudiante creado exitosamente.'
         }))
         return response.data
      } catch (error) {
         console.error('Error creating student:', error)
         set({ error: 'Error al crear el estudiante', loading: false, success: false, message: 'Error al crear el estudiante.' })
      }
   },
   removeStudent: async (studentId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deleteStudent(studentId, is_administrator, token)
         set((state) => ({
            students: state.students.filter((student) => student.id !== studentId),
            loading: false,
            success: true,
            message: 'Estudiante eliminado exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting student:', error)
         set({ error: 'Error al eliminar el estudiante', loading: false, success: false, message: 'Error al eliminar el estudiante.' })
      }
   },
   updateStudent: async (studentId, studentData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const photo = studentData.photo_base_64 || ''
         const response = await updateStudent(studentId, studentData, photo, is_administrator, token)
         set((state) => ({
            students: state.students.map(student =>
               student.id === studentId ? { ...studentData, id: studentId } : student
            ),
            loading: false,
            success: true,
            message: 'Estudiante actualizado exitosamente.'
         }))
         return response.data
      } catch (error) {
         console.error('Error updating student:', error)
         set({ error: 'Error al actualizar el estudiante', loading: false, success: false, message: 'Error al actualizar el estudiante.' })
      }
   },
   downloadPDF: async (studentId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await downloadPDF(studentId, is_administrator, token)
         return response.data[0]
      } catch (error) {
         console.error('Error creating student:', error)
         set({ error: 'Error al crear el estudiante', loading: false, success: false, message: 'Error al crear el estudiante.' })
      }
   },
}))