import { Router } from "express";
import * as controller from "./locations.controller";

const router = Router();

router.get("/", controller.getLocations);
router.get("/:id", controller.getLocation);
router.post("/", controller.createLocation);
router.put("/:id", controller.updateLocation);
router.delete("/:id", controller.deleteLocation);

export default router;
