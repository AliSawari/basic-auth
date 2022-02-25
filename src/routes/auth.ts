import { application, Router } from 'express';
import { sign } from 'jsonwebtoken';
import validateEmail from '../helpers/validateEmail';
import makeRequired from '../middlewares/makeRequired';
import { User } from '../models/User';
import { compare } from 'bcrypt';
import { SECRET_KEY, TOKEN_EXPIRE } from '../config';
import { scorePassword } from '../helpers/passwordScore';
import isAuth from '../middlewares/isAuth';
import { generateHash } from '../middlewares/generateHash';

const authRouter = Router();

authRouter.post('/login', makeRequired({ email: 1, password: 1 }), async (req, res) => {
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
})



authRouter.post('/signup', makeRequired({ fullName: 1, email: 1, password: 1 }), async (req, res) => {
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
})


authRouter.post('/change-password', isAuth, makeRequired({ newPassword: 1 }), async (req: any, res) => {
  try {
    const currentUser = req.user;
    const { newPassword } = req.body;
    if (scorePassword(newPassword) >= 70) {
      const hashed = await generateHash(newPassword);
      const saveRes = await User.findOneAndUpdate({ email: currentUser.email }, { password: hashed })
      console.log(saveRes)
      res.json({ message: "User Updated Successfully" })
    } else res.json({ message: "Password must be at least 8 characters and  contain lower case, upper case, numbers and special characters" })
  } catch (e) {

  }
})


export default authRouter;