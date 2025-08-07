import { Request, Response, NextFunction } from "express"
import pool from '../config/db'
import { transformObjectToUpperCase } from "../utils/textTransform"

export const createSalon = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator

      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden crear salones.'
         })
      }

      const { name, code, capacity, priority, sede_id, turn_id, registration_process_id } = transformObjectToUpperCase(req.body.salonData)

      const response = await pool.execute(
         'INSERT INTO salons (name, code, capacity, priority, sede_id, turn_id, registration_process_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
         [name, code, capacity, priority, sede_id, turn_id, registration_process_id]
      )

      res.json({
         success: true,
         message: 'Salón creado exitosamente.',
         data: {
            id: (response as any)[0].insertId,
            name,
            code,
            capacity,
            priority,
            sede_id,
            turn_id,
            registration_process_id
         }
      })
   } catch (error) {
      next(error)
   }
}

export const listSalons = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name, code, capacity, sede_id, turn_id, registration_process_id FROM salons')
      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deleteSalon = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Solo los administradores pueden eliminar salones.'
         })
      }
      const salon_id = req.params.id

      await pool.execute('DELETE FROM salons WHERE id = ?', [salon_id])
      res.json({
         success: true,
         message: 'Salón eliminado exitosamente.'
      })
   } catch (error) {
      next(error)
   }
}