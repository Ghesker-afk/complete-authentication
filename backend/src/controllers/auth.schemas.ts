import { z } from "zod";

const emailSchema = z.email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional()
});


// extend() takes a schema and add more properties to it. The
// flox are: copies everything from loginSchema, adds a new
// field (confirmPassword), doesn't modify the loginSchema
// and creates a new schema (registerSchema).

// refine() adds a custom validation rule; is for rules that
// Zod can't express automatically. 
export const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6).max(255)
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

export const verificationCodeSchema = z.string().min(1).max(24);