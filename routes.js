import express from "express";

import { validateAadhar } from "./controller/AgentValidationController.js";

import {
  createServiceType,
  createService,
  updateService,
  deleteService,
  getServices,
} from "./controller/servicesController.js";
import loginController from "./controller/loginController.js";

const router = express.Router();

// ServiceType Routes
router.post("/service-types", createServiceType);

// Service Routes
router.post("/services", createService);
router.get("/services", getServices);

router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Authentication Routes
router.post("/login", loginController.sendCredentials);
router.post("/verify-otp", loginController.verifyOTP);
//Agent Verification
router.post("/validate-aadhar", validateAadhar);

export default router;
