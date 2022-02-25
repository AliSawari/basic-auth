import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, TOKEN_EXPIRE } from '../config'

export default function isAuth(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: "Not Authorized" });
  jwt.verify(token, SECRET_KEY, { maxAge: TOKEN_EXPIRE }, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
    } else {
      req.user = user;
      next();
    }
  })
}
