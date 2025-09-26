import bcrypt from "bcrypt";
import { config } from "dotenv";
import "dotenv/config";
config({ path: "./config/dev.config.env" });

const hashPassword = async (password: string) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || "");
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, verifyPassword };
