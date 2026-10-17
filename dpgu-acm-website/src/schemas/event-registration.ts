import { z } from "zod";

/**
 * Validation schema for public guest registration.
 * Ensures data cleanliness before insertion into the `registrations` table.
 */
export const guestRegistrationSchema = z.object({
  eventId: z.string().uuid("Invalid event identifier."),
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name cannot exceed 100 characters."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits.")
    .max(15, "Phone number cannot exceed 15 digits.")
    .regex(/^[0-9+\-\s]+$/, "Phone number can only contain numbers and basic symbols."),
  collegeName: z
    .string()
    .trim()
    .min(2, "College/University name must be at least 2 characters.")
    .max(150, "College name cannot exceed 150 characters."),
  department: z
    .string()
    .trim()
    .min(2, "Department/Branch is required.")
    .max(100, "Department cannot exceed 100 characters."),
  rollNumber: z
    .string()
    .trim()
    .min(1, "Student Roll Number / University ID is required.")
    .max(50, "Roll Number cannot exceed 50 characters."),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the chapter event code of conduct."),
});

export type GuestRegistrationInput = z.infer<typeof guestRegistrationSchema>;
