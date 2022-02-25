import express from 'express'
import mongoose from 'mongoose';
import { urlencoded, json } from 'body-parser';
import { PORT, DB_URL } from './config';
import authRouter from './routes/auth';

const app = express();

app.use(urlencoded({ extended: true }))
app.use(json())

mongoose.connect(DB_URL).then(_ => {
  console.log("connected to DB")
}).catch(e => console.log(e));



app.get("/", (req, res) => {
  res.json({ msg: "welcome!" })
})

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
  console.log("server started on port ", PORT);
})