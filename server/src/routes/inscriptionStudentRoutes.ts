import { Router } from "express"
import { createStudent, listStudents, deleteStudent, downloadPdf, updateStudent } from "../controllers/inscriptionStudentController"

const router = Router()

router.post("/create", createStudent)
router.get("/list", listStudents)
router.delete("/delete/:id", deleteStudent)
router.put("/update/:id", updateStudent)
router.get("/download-pdf/:id", downloadPdf)

export default router