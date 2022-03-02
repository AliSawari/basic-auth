import { NextFunction, Request, Response } from "express";

export default function makeRequired(requiredParams: string[]) {
  const required:any = {};
  if(requiredParams && requiredParams.length) {
    for(let req of requiredParams) required[req] = 1;
  }

  return async function (req: Request, res: Response, next: NextFunction) {
    if (req.body && Object.keys(req.body).length) {
      const missing = [];
      for (let r in required) {
        if (!(r in req.body)) missing.push(r);
      }
      if (missing.length) {
        res.json({
          message: `Missing Required Body Params`,
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