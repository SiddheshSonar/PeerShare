import bcrypt from "bcrypt";

import UserModel from "../models/userModel.js";

const userModel = new UserModel();

class UserController {

    constructor() { }
  
    signin = async (req, res) => {
      try {
        const { email, password } = req.body;
        // Check if email exists in the database and retrieve hashed password
        const userData = await userModel.getUserByEmail(email);
        if (!userData) {
          return res.status(404).json({
            status: 0,
            message: "Email doesn't exist",
          });
        }
        const hashedpasswd = userData.password;
        const uid = userData.uid;
        // Compare the provided password with the stored hashed password
        const matchPassword = await bcrypt.compare(password, hashedpasswd);
  
        if (!matchPassword) {
          return res.status(400).json({
            status: 0,
            message: "Incorrect Password",
          });
        }
  
        return res.status(200).json({
          status: 1,
          message: "Login successful",
          data: {
            uid: uid,
            name: userData.name,
          },
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 0,
          message: "Something went wrong",
          description: error, // for debugging purposes
        });
      }
    };

    signup = async (req, res) => {
        try {
          const { name, email, password } = req.body;
          if (!name || !email || !password ) {
            return res.status(400).json({
              status: 0,
              message: "Missing required fields",
            });
          }

          const userExists = await userModel.checkUserExists(email);
    
          if (userExists) {
            return res.status(400).json({
              status: 0,
              message: "User already exists",
            });
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          const userData = await userModel.createUser(
            name,
            email,
            hashedPassword,
          );
    
          return res.status(201).json({
            status: 1,
            message: "User created successfully",
            id: userData.insertId,
          });

        } catch (error) {
          console.log(error);
          return res.status(500).json({
            status: 0,
            message: "Something went wrong",
            description: error, // for debugging purposes
          });
        }
      };

}

export default UserController;