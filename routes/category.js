import { Router } from "express";
import * as controller from "../controllers/category.js";

const router = Router();

router.get("/", controller.list);
router.get("/create", controller.createGet);
router.post("/create", controller.createPost);
router.get("/:id", controller.detail);
router.get("/:id/edit", controller.editGet);
router.post("/:id/edit", controller.editPost);
router.post("/:id/delete", controller.deletePost);

export default router;
