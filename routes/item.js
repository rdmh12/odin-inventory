import { Router } from "express";
import * as controller from "../controllers/item.js";

const router = Router();

router.get("/", controller.list);
router.get("/create", controller.createGet);
router.post("/create", controller.itemValidator, controller.createPost);
router.get("/:id", controller.idValidator, controller.detail);
router.get("/:id/edit", controller.idValidator, controller.editGet);
router.post(
  "/:id/edit",
  controller.idValidator,
  controller.itemValidator,
  controller.editPost,
);
router.post(
  "/:id/delete",
  controller.idValidator,
  controller.itemValidator,
  controller.deletePost,
);

export default router;
