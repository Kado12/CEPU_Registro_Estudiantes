import { Router } from "express";
import { createWeek, deleteWeek, listWeeks } from "../controllers/weeksControllers";

const router = Router();

router.get("/list", listWeeks);
router.post("/create", createWeek);
router.delete("/delete/:id", deleteWeek);

export default router;