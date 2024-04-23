import express from "express";
import UserController from "../controllers/userController.js";

// user router
const uR = express.Router();

const uC = new UserController();

// /users/...

uR.post("/signin", uC.signin);

uR.post("/signup", uC.signup);

export default uR;
