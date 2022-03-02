import { Request, Response } from "express";
import { scorePassword } from "../../helpers/passwordScore";
import validateEmail from "../../helpers/validateEmail";
import { generateHash } from "../../helpers/generateHash";
import { User } from "../../models/User";

export async function signUpController(req:Request, res:Response) {
  try {
    const { fullName, email, password } = req.body;
    if (validateEmail(email)) {
      const existing = await User.findOne({ email }).lean()
      if (existing) return res.json({ message: "User Already Exists" });
      if (scorePassword(password) >= 70) {
        const hashed = await generateHash(password);
        let newUser = await new User({ fullName, email, password: hashed }).save();
        delete newUser.password;
        res.json({ user: newUser });
      } else res.json({ message: "Password must be at least 8 characters and  contain lower case, upper case, numbers and special characters" })
    } else res.json({ message: "Email is not valid, Please provide a valid email address" })
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
}