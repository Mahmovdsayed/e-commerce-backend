import { Request } from "express";

interface AuthRequest extends Request {
  authUser: { _id: string; role: string };
}

export default AuthRequest;
