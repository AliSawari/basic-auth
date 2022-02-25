import { NextFunction, Request, Response } from "express";

export default function makeRequired(requiredParams: object) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (req.body && Object.keys(req.body).length) {
      const missing = [];
      for (let required in requiredParams) {
        if (!(required in req.body)) missing.push(required);
      }
      if (missing.length) {
        res.json({
          message: `Missing Required Params`,
          missing
        })
      } else next()
    } else {
      res.status(400).json({
        message: "No Request Body"
      })
    }
  }
}