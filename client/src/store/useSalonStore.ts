import { create } from "zustand"
import { createSalon, deleteSalon, listSalons } from "../services/salonsApi"

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

interface SalonState {
   salon: Salon | null
   salons: Salon[]
   error: string
   success: boolean
   message: string
   loading: boolean
   setSalon: (salon: Salon | null) => void
   clearSalon: () => void
   refreshSalons: () => Promise<void>
   addSalon: (salonData: Omit<Salon, 'id'>, is_administrator: boolean, token: string) => Promise<void>
   removeSalon: (salonId: number, is_administrator: boolean, token: string) => Promise<void>
}

export const useSalonStore = create<SalonState>((set) => ({
   salons: [],
   salon: null,
   error: '',
   success: false,
   message: '',
   loading: false,
   setSalon: (salon) => set({ salon }),
   clearSalon: () => set({ salon: null }),

   refreshSalons: async () => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await listSalons()
         set({ salons: response.data, loading: false, success: true, message: 'Salones cargados exitosamente.' })
      } catch (error) {
         console.error('Error fetching salons:', error)
         set({ error: 'Error al cargar los salones', loading: false, success: false, message: 'Error al cargar los salones.' })
      }
   },

   addSalon: async (salonData, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         const response = await createSalon(salonData, is_administrator, token)
         set((state) => ({
            salons: [...state.salons, { name: response.data.name, code: response.data.code, capacity: response.data.capacity, priority: response.data.priority, sede_id: response.data.sede_id, turn_id: response.data.turn_id, registration_process_id: response.data.registration_process_id, id: response.data.id }],

            loading: false,
            success: true,
            message: 'Salón creado exitosamente.'
         }))
      } catch (error) {
         console.error('Error creating salon:', error)
         set({ error: 'Error al crear el salón', loading: false, success: false, message: 'Error al crear el salón.' })
      }
   },

   removeSalon: async (salonId, is_administrator, token) => {
      set({ loading: true, error: '', success: false, message: '' })
      try {
         await deleteSalon(salonId, is_administrator, token)
         set((state) => ({
            salons: state.salons.filter((salon) => salon.id !== salonId),
            loading: false,
            success: true,
            message: 'Salón eliminado exitosamente.'
         }))
      } catch (error) {
         console.error('Error deleting salon:', error)
         set({ error: 'Error al eliminar el salón', loading: false, success: false, message: 'Error al eliminar el salón.' })
      }
   }
}))