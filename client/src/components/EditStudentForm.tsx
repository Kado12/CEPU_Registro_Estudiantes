import { useEffect, useState } from "react"
import { useGetToken } from "../hooks/useGetToken"
import { useUserData } from "../hooks/useUserData"
import { useStudentStore } from "../store/useStudentStore"
import { useTurnStore } from "../store/useTurnStore"
import { useSedeStore } from "../store/useSedeStore"
import { useProcessStore } from "../store/useProcessStore"
import { useSalonStore } from "../store/useSalonStore"
import { usePaymentPlanStore } from "../store/usePaymentPlanStore"

interface EditStudentFormProps {
   studentId: number;
   onClose: () => void;
}

const EditStudentForm = ({ studentId, onClose }: EditStudentFormProps) => {
   const { user } = useUserData()
   const { token } = useGetToken()
   const isAdministrator = user?.role_id === 1

   const { turns, refreshTurns } = useTurnStore()
   const { sedes, refreshSedes } = useSedeStore()
   const { processes, refreshProcesses } = useProcessStore()
   const { salons, refreshSalons } = useSalonStore()
   const { paymentPlans, refreshPaymentPlans } = usePaymentPlanStore()

   useEffect(() => {
      refreshTurns()
      refreshSedes()
      refreshProcesses()
      refreshSalons()
      refreshPaymentPlans()
   }, [])

   const { students, updateStudent, success, message, loading } = useStudentStore()

   const [formData, setFormData] = useState({
      name: '',
      last_name: '',
      dni: Number(''),
      phone: Number(''),
      record_number: Number(''),
      date_inscription: '',
      payment_plan_id: Number(''),
      need_to_pay: false,
      registration_process_id: Number(''),
      sede_id: Number(''),
      turn_id: Number(''),
      salon_id: Number(''),
      photo_base_64: ''
   })
   const [displayMessage, setDisplayMessage] = useState('')
   const [isSuccess, setIsSuccess] = useState(false)
   const [newPhoto, setNewPhoto] = useState<File | null>(null)

   // Cargar los datos del estudiante al iniciar
   useEffect(() => {
      const student = students.find(s => s.id === studentId)
      if (student) {
         setFormData({
            name: student.name,
            last_name: student.last_name,
            dni: student.dni,
            phone: student.phone || 0,
            record_number: student.record_number,
            date_inscription: student.date_inscription.split('T')[0],
            payment_plan_id: student.payment_plan_id,
            need_to_pay: student.need_to_pay,
            registration_process_id: student.registration_process_id,
            sede_id: student.sede_id,
            turn_id: student.turn_id,
            salon_id: student.salon_id || 0,
            photo_base_64: student.photo_base_64 || ''
         })
      }
   }, [studentId, students])

   const [hasSubmitted, setHasSubmitted] = useState(false)

   useEffect(() => {
      if (message && hasSubmitted) {
         setDisplayMessage(message)
         setIsSuccess(success)
         if (success) {
            setTimeout(() => {
               onClose()
            }, 1500)
         }
      }
   }, [message, success, onClose, hasSubmitted])

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData({ ...formData, [id]: value })
   }

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setNewPhoto(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            const base64String = reader.result?.toString().split(',')[1] || '';
            setFormData({ ...formData, photo_base_64: base64String });
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setHasSubmitted(true) // Marcar que se intentó enviar
      try {
         if (!token) {
            setDisplayMessage("No se encontró el token de autenticación.")
            setIsSuccess(false)
            return
         }
         await updateStudent(studentId, formData, isAdministrator, token)
      } catch (error) {
         console.error('Error al actualizar el estudiante.', error)
      }
   }

   // Reemplaza todo el return del EditStudentForm con:

   return (
      <div className="p-6">
         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Columna 1 */}
            <div className="space-y-4">
               <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                     Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     id="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                     placeholder="Ingrese el nombre"
                  />
               </div>

               <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                     Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     id="last_name"
                     value={formData.last_name}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                     placeholder="Ingrese el apellido"
                  />
               </div>

               <div>
                  <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-2">
                     DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="number"
                     id="dni"
                     value={formData.dni || ''}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                     placeholder="Ingrese el DNI"
                  />
               </div>

               <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                     Teléfono
                  </label>
                  <input
                     type="number"
                     id="phone"
                     value={formData.phone || ''}
                     onChange={handleChange}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                     placeholder="Ingrese el teléfono"
                  />
               </div>

               <div>
                  <label htmlFor="record_number" className="block text-sm font-semibold text-gray-700 mb-2">
                     Número de Expediente <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="number"
                     id="record_number"
                     value={formData.record_number || ''}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                     placeholder="Ingrese el expediente"
                  />
               </div>

               <div>
                  <label htmlFor="date_inscription" className="block text-sm font-semibold text-gray-700 mb-2">
                     Fecha de Inscripción <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="date"
                     id="date_inscription"
                     value={formData.date_inscription}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
               </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
               <div>
                  <label htmlFor="payment_plan_id" className="block text-sm font-semibold text-gray-700 mb-2">
                     Plan de Pago <span className="text-red-500">*</span>
                  </label>
                  <select
                     id="payment_plan_id"
                     value={formData.payment_plan_id}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                     <option value="">Seleccione un plan</option>
                     {paymentPlans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                     ¿Necesita pagar? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                     <label className="flex items-center">
                        <input
                           type="radio"
                           name="need_to_pay"
                           checked={formData.need_to_pay === true}
                           onChange={() => setFormData({ ...formData, need_to_pay: true })}
                           className="mr-2 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-sm">Sí</span>
                     </label>
                     <label className="flex items-center">
                        <input
                           type="radio"
                           name="need_to_pay"
                           checked={formData.need_to_pay === false}
                           onChange={() => setFormData({ ...formData, need_to_pay: false })}
                           className="mr-2 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-sm">No</span>
                     </label>
                  </div>
               </div>

               <div>
                  <label htmlFor="registration_process_id" className="block text-sm font-semibold text-gray-700 mb-2">
                     Proceso de Inscripción <span className="text-red-500">*</span>
                  </label>
                  <select
                     id="registration_process_id"
                     value={formData.registration_process_id}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                     <option value="">Seleccione un proceso</option>
                     {processes.map(process => (
                        <option key={process.id} value={process.id}>{process.name}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor="sede_id" className="block text-sm font-semibold text-gray-700 mb-2">
                     Sede <span className="text-red-500">*</span>
                  </label>
                  <select
                     id="sede_id"
                     value={formData.sede_id}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                     <option value="">Seleccione una sede</option>
                     {sedes.map(sede => (
                        <option key={sede.id} value={sede.id}>{sede.name}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor="turn_id" className="block text-sm font-semibold text-gray-700 mb-2">
                     Turno <span className="text-red-500">*</span>
                  </label>
                  <select
                     id="turn_id"
                     value={formData.turn_id}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                     <option value="">Seleccione un turno</option>
                     {turns.map(turn => (
                        <option key={turn.id} value={turn.id}>{turn.name}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor="salon_id" className="block text-sm font-semibold text-gray-700 mb-2">
                     Salón <span className="text-red-500">*</span>
                  </label>
                  <select
                     id="salon_id"
                     value={formData.salon_id}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  >
                     <option value="">Seleccione un salón</option>
                     {salons.map(salon => (
                        <option key={salon.id} value={salon.id}>{salon.code}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                     Foto del Estudiante
                  </label>
                  <input
                     type="file"
                     id="photo"
                     accept="image/*"
                     onChange={handleFileChange}
                     className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition-all"
                  />
                  {formData.photo_base_64 && !newPhoto && (
                     <p className="text-xs text-gray-500 mt-1">✓ Ya hay una foto guardada</p>
                  )}
               </div>
            </div>

            {/* Botones de acción */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-200">
               <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
               >
                  Cancelar
               </button>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? 'Actualizando...' : 'Guardar Cambios'}
               </button>
            </div>
         </form>

         {/* Mensaje de estado */}
         {displayMessage && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${isSuccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
               {displayMessage}
            </div>
         )}
      </div>
   )
}

export default EditStudentForm