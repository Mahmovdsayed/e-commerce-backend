import { NextFunction, Request, Response } from "express";
import { signUpValidationSchema } from "./user.validationSchemas.js";
import User from "../../DB/Models/user.model.js";
import { uploadImageToCloudinary } from "../../helpers/uploadImageToCloudinary.js";
import { hashPassword } from "../../helpers/hashPassword.js";

const signUpHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const image = req.file;
    
        const existingUser = await User.findOne({ email });
        if (existingUser) return next(new Error("Email already exists"));
        
        const hashedPassword = await hashPassword(password);
    
        let imageUrl = "https://res.cloudinary.com/dxvpvtcbg/image/upload/v1713493679/sqlpxs561zd9oretxkki.jpg";
        let publicId: string | null = null;
       
        if (image?.size) {
          try {
            const uploadResult = await uploadImageToCloudinary(image, name, "Avatar");
            if (uploadResult) {
              imageUrl = uploadResult.imageUrl;
              publicId = uploadResult.publicId;
            }
          } catch (uploadError) {
            return next(uploadError);
          }
        }
    
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          image: {
            url: imageUrl,
            public_id: publicId,
          },
        });
    
        await newUser.save();
    
        res.status(201).json({
          success: true,
          message: "User created successfully",
          data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
          },
        });
      } catch (error) {
        next(error);
      }
};

const signInHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {};

const signOutHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {};

const getUserHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {};

const updateUserHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {};

const deleteUserHandler = async (req: Request, res: Response , next: NextFunction):Promise<void> => {};




export {
  signUpHandler,
  signInHandler,
  signOutHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
};
