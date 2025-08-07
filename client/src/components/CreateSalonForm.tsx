import React, { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useSalonStore } from "../store/useSalonStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSedeStore } from "../store/useSedeStore"
import { useProcessStore } from "../store/useProcessStore"

const CreateSalonForm = () => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const { turns, refreshTurns } = useTurnStore()
   const { sedes, refreshSedes } = useSedeStore()
   const { processes, refreshProcesses } = useProcessStore()

   useEffect(() => {
      refreshTurns()
      refreshSedes()
      refreshProcesses()
   }, [])

   const isAdministrator = user?.role_id === 1

   const { addSalon, success, message, loading } = useSalonStore()

   const [formData, setFormData] = useState({
      name: '',
      code: '',
      capacity: 0,
      priority: 0,
      sede_id: 0,
      turn_id: 0,
      registration_process_id: 0
   })
   const [displayMessage, setDisplayMessage] = useState('')
   const [isSuccess, setIsSuccess] = useState(false)

   useEffect(() => {
      if (message) {
         setDisplayMessage(message)
         setIsSuccess(success)
         const timer = setTimeout(() => {
            setDisplayMessage('')
         }, 3000) // Clear message after 3 seconds
         return () => clearTimeout(timer)
      }
   }, [message, success])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData(prevState => ({
         ...prevState,
         [id]: id === 'capacity' || id === 'sede_id' || id === 'turn_id' || id === 'registration_process_id' ? Number(value) : value
      }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         await addSalon(formData, isAdministrator, token || '')
         setFormData({
            name: '',
            code: '',
            capacity: 0,
            priority: 0,
            sede_id: 0,
            turn_id: 0,
            registration_process_id: 0
         })
      } catch (error) {
         console.error('Error al crear el salón:', error)
      }
   }

   return (
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
         {displayMessage && (
            <p style={{ color: isSuccess ? 'green' : 'red' }}>{displayMessage}</p>
         )}
         <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
            <input
               type="text"
               id="name"
               value={formData.name}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
         </div>
         <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2">Código:</label>
            <input
               type="text"
               id="code"
               value={formData.code}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
         </div>
         <div className="mb-4">
            <label htmlFor="capacity" className="block text-gray-700 text-sm font-bold mb-2">Capacidad:</label>
            <input
               type="number"
               id="capacity"
               value={formData.capacity}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
         </div>
         <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Prioridad:</label>
            <input
               type="number"
               id="priority"
               value={formData.priority}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
         </div>
         <div className="mb-4">
            <label htmlFor="sede_id" className="block text-gray-700 text-sm font-bold mb-2">Sede:</label>
            <select
               id="sede_id"
               value={formData.sede_id}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
               <option value="">Seleccione una sede</option>
               {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>
                     {sede.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="mb-4">
            <label htmlFor="turn_id" className="block text-gray-700 text-sm font-bold mb-2">Turno:</label>
            <select
               id="turn_id"
               value={formData.turn_id}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
               <option value="">Seleccione un turno</option>
               {turns.map(turn => (
                  <option key={turn.id} value={turn.id}>
                     {turn.name}
                  </option>
               ))}
            </select>
         </div>
         <div className="mb-4">
            <label htmlFor="registration_process_id" className="block text-gray-700 text-sm font-bold mb-2">Proceso de Registro:</label>
            <select
               id="registration_process_id"
               value={formData.registration_process_id}
               onChange={handleChange}
               required
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
               <option value="">Seleccione un proceso de registro</option>
               {processes.map(process => (
                  <option key={process.id} value={process.id}>
                     {process.name}
                  </option>
               ))}
            </select>
         </div>
         <button type="submit" disabled={loading} className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out cursor-pointer mb-4'>Crear Salón</button>
      </form>
   )
}

export default CreateSalonForm