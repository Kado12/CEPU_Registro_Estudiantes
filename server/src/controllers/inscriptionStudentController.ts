import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { generateStudentPDF } from "../scripts/createPDF";
import { transformObjectToUpperCase } from "../utils/textTransform";

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      const { name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, turn_id } = transformObjectToUpperCase(req.body.studentData)
      const photo_base_64 = req.body.photo
      const [salonRows] = await pool.execute(
         `
         SELECT id, name, capacity
         FROM salons
         WHERE sede_id = ? AND turn_id = ? AND registration_process_id = ?
            AND (capacity - (
               SELECT COUNT(*)
               FROM students
               WHERE salon_id = salons.id
         )) > 0
         ORDER BY priority ASC, (capacity - (
               SELECT COUNT(*)
               FROM students
               WHERE salon_id = salons.id
         )) DESC
         LIMIT 1;
         `,
         [sede_id, turn_id, registration_process_id]
      )

      if (!Array.isArray(salonRows) || salonRows.length === 0) {
         return res.status(400).json({
            success: false,
            message: 'No hay salones disponibles para esta sede, turno y proceso de inscripción',
         });
      }

      const salon = salonRows[0] as { id: number; name: string; capacity: number }
      // Obtener nombres de sede, salón y turno
      const [sedeRows] = await pool.execute('SELECT name FROM sedes WHERE id = ?', [sede_id]);
      const sedeData = (sedeRows as Array<{ name: string }>)[0]
      const [turnRows] = await pool.execute('SELECT name FROM turns WHERE id = ?', [turn_id]);
      const turnData = (turnRows as Array<{ name: string }>)[0]
      // Generar el PDF
      const pdfBuffer = await generateStudentPDF({
         name,
         last_name,
         dni,
         phone,
         record_number,
         sede: sedeData.name,
         salon: salon.name,
         turn: turnData.name,
      }, photo_base_64);

      // Insertar estudiante con el PDF
      const response = await pool.execute(
         'INSERT INTO students (name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon_id, turn_id, photo_base_64) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
         [name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon.id, turn_id, photo_base_64]
      )

      res.json({
         success: true,
         message: 'Estudiante creado exitosamente',
         data: {
            id: (response as any)[0].insertId,
            pdf_file: pdfBuffer.toString('base64')
         }
      })
   } catch (error) {
      next(error)
   }
}

export const listStudents = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const [rows] = await pool.execute('SELECT id, name, last_name, dni, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, salon_id, turn_id FROM students')
      res.json({
         success: true,
         data: rows
      })
   } catch (error) {
      next(error)
   }
}

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator
      const student_id = req.params.id

      await pool.execute('DELETE FROM students WHERE id = ?', [student_id])

      res.json({
         success: true,
         message: 'Estudiante eliminado exitosamente.'
      })

   } catch (error) {
      next(error)
   }
}

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const userRole = req.body.is_administrator;
      const studentId = req.params.id;
      const { name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, turn_id } = transformObjectToUpperCase(req.body.studentData);
      const photo_base_64 = req.body.photo;

      // Verificar si el estudiante existe
      const [existingStudentRows] = await pool.execute('SELECT id, salon_id, photo_base_64 FROM students WHERE id = ?', [studentId]);

      if (!Array.isArray(existingStudentRows) || existingStudentRows.length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Estudiante no encontrado',
         });
      }

      const existingStudent = existingStudentRows[0] as { id: number; salon_id: number; photo_base_64: string | null };

      // Si no se proporciona una nueva foto, mantener la existente
      const finalPhoto = photo_base_64 || existingStudent.photo_base_64;

      // Actualizar el estudiante
      await pool.execute(
         'UPDATE students SET name = ?, last_name = ?, dni = ?, phone = ?, record_number = ?, date_inscription = ?, payment_plan_id = ?, need_to_pay = ?, registration_process_id = ?, sede_id = ?, turn_id = ?, photo_base_64 = ? WHERE id = ?',
         [name, last_name, dni, phone, record_number, date_inscription, payment_plan_id, need_to_pay, registration_process_id, sede_id, turn_id, finalPhoto, studentId]
      );

      // Obtener nombres de sede, salón y turno para generar el PDF
      const [sedeRows] = await pool.execute('SELECT name FROM sedes WHERE id = ?', [sede_id]);
      const sedeData = (sedeRows as Array<{ name: string }>)[0];

      const [salonRows] = await pool.execute('SELECT name FROM salons WHERE id = ?', [existingStudent.salon_id]);
      const salonData = (salonRows as Array<{ name: string }>)[0];

      const [turnRows] = await pool.execute('SELECT name FROM turns WHERE id = ?', [turn_id]);
      const turnData = (turnRows as Array<{ name: string }>)[0];

      // Generar el PDF con los datos actualizados
      const pdfBuffer = await generateStudentPDF({
         name,
         last_name,
         dni,
         phone,
         record_number,
         sede: sedeData.name,
         salon: salonData.name,
         turn: turnData.name,
      }, finalPhoto);

      res.json({
         success: true,
         message: 'Estudiante actualizado exitosamente',
         data: {
            id: studentId,
            pdf_file: pdfBuffer.toString('base64')
         }
      });
   } catch (error) {
      next(error);
   }
};

export const downloadPdf = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const studentId = req.params.id;

      const [rows] = await pool.execute('SELECT id, name, last_name, dni, phone, record_number, sede_id, salon_id, turn_id, photo_base_64 FROM students WHERE dni = ?', [studentId]);

      if (!Array.isArray(rows) || rows.length === 0) {
         return res.status(404).json({
            success: false,
            message: 'Estudiante no encontrado.',
         });
      }

      const student = rows[0] as {
         id: number,
         name: string,
         last_name: string,
         dni: number,
         phone: number,
         record_number: number,
         sede_id: number,
         salon_id: number,
         turn_id: number,
         photo_base_64: string
      };

      if (!student.photo_base_64) {
         return res.status(404).json({
            success: false,
            message: 'El estudiante no tiene una foto asociada.',
         });
      }

      // Obtener nombres de sede, salón y turno
      const [sedeRows] = await pool.execute('SELECT name FROM sedes WHERE id = ?', [student.sede_id]);
      const sedeData = (sedeRows as Array<{ name: string }>)[0];

      const [salonRows] = await pool.execute('SELECT name FROM salons WHERE id = ?', [student.salon_id]);
      const salonData = (salonRows as Array<{ name: string }>)[0];

      const [turnRows] = await pool.execute('SELECT name FROM turns WHERE id = ?', [student.turn_id]);
      const turnData = (turnRows as Array<{ name: string }>)[0];

      // Generar el PDF dinámicamente con los datos actuales
      const pdfBuffer = await generateStudentPDF({
         name: student.name,
         last_name: student.last_name,
         dni: student.dni,
         phone: student.phone,
         record_number: student.record_number,
         sede: sedeData.name,
         salon: salonData.name,
         turn: turnData.name,
      }, student.photo_base_64);

      return res.json({
         success: true,
         data: [{
            dni: student.dni,
            pdf_file: {
               data: [...new Uint8Array(pdfBuffer)]
            }
         }]
      });

   } catch (error) {
      console.error('Error al generar el PDF:', error);
      next(error);
   }
}