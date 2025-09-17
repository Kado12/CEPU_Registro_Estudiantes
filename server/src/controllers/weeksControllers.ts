import { Response, Request, NextFunction } from "express"
import pool from "../config/db"
import { transformObjectToUpperCase } from "../utils/textTransform"

export const listWeeks = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute("SELECT id, name, code FROM weeks")
      res.json({
         success: true,
         data: rows,
      })
   } catch (error) {
      next(error)
   }
}

export const createWeek = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo los administradores pueden crear semanas.",
         })
      }

      const { name, code } = transformObjectToUpperCase(req.body.weekData)
      const response = await pool.execute(
         "INSERT INTO weeks (name, code) VALUES (?, ?)",
         [name, code]
      )
      res.json({
         success: true,
         message: "Semana creada exitosamente.",
         data: {
            id: (response as any)[0].insertId,
            name,
            code: code,
         },
      })
   } catch (error) {
      next(error)
   }
}

export const deleteWeek = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      if (!userRole) {
         return res.status(403).json({
            success: false,
            message: "Acceso denegado. Solo los administradores pueden eliminar semanas.",
         })
      }
      const week_id = req.params.id
      await pool.execute("DELETE FROM weeks WHERE id = ?", [week_id])
      res.json({
         success: true,
         message: "Semana eliminada exitosamente.",
      })
   } catch (error) {
      next(error)
   }
}
