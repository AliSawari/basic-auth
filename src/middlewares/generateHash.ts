import { genSalt, hash } from "bcrypt";

export async function generateHash(password: string) {
  const salt = await genSalt();
  const hashed = await hash(password, salt);
  return hashed;
}