import { Request, Response } from "express";
import { generateHash } from "../../helpers/generateHash";
import { scorePassword } from "../../helpers/passwordScore";
import { User } from "../../models/User";

export async function changePasswordController(req: Request, res: Response) {
  try {
    const currentUser = (req as any).user;
    const { newPassword } = req.body;
    if (scorePassword(newPassword) >= 70) {
      const hashed = await generateHash(newPassword);
      const saveRes = await User.findOneAndUpdate({ email: currentUser.email }, { password: hashed })
      console.log(saveRes)
      res.json({ message: "User Updated Successfully" })
    } else res.json({ message: "Password must be at least 8 characters and  contain lower case, upper case, numbers and special characters" })
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
}