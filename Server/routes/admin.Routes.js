import { Router } from "express";
import { adminLogin, getAllUsers } from "../controllers/user.controller.js";
import { isLoggedIn, authorizedRoles } from "../middlewares/auth.middlewares.js";


export const adminRouter = Router()

adminRouter.post("/login", adminLogin);
adminRouter.get("/users", isLoggedIn, authorizedRoles('ADMIN'), getAllUsers);