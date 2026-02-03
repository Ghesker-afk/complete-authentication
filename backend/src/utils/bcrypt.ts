import bcrypt from "bcrypt";

export async function hashValue(value: string, saltRounds?: number) {
  return bcrypt.hash(value, saltRounds || 10);
};

export async function compareValue(value: string, hashedValue: string) {
  return bcrypt.compare(value, hashedValue).catch(() => false);
}