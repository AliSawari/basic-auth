import { compare } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { SECRET_KEY, TOKEN_EXPIRE } from "../../config";
import validateEmail from "../../helpers/validateEmail";
import { User } from "../../models/User";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (validateEmail(email)) {
      const existing = await User.findOne({ email }).lean()
      if (existing) {
        const isMatch = await compare(password, existing.password);
        if (isMatch) {
          const token = sign(existing, SECRET_KEY, { expiresIn: TOKEN_EXPIRE });
          res.json({ message: "Login Successful", token })
        } else res.json({ message: "Wrong Password" })
      } else res.json({ message: "User Not Found" })
    } else res.json({ message: "Please provide a valid email" });
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
}