import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  role: z.enum(['patient', 'caregiver', 'provider']),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), 'Please enter a valid phone number'),
  emergency_contact_name: z.string()
    .optional()
    .refine((val) => !val || val.length >= 2, 'Emergency contact name must be at least 2 characters'),
  emergency_contact_phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), 'Please enter a valid emergency contact phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Health data validation schemas
export const healthMetricSchema = z.object({
  value: z.record(z.string(), z.union([z.string(), z.number()])),
  metric_type: z.string().min(1, 'Metric type is required'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const medicationSchema = z.object({
  medication_name: z.string()
    .min(1, 'Medication name is required')
    .max(100, 'Medication name must be less than 100 characters'),
  dosage: z.string()
    .min(1, 'Dosage is required')
    .max(50, 'Dosage must be less than 50 characters'),
  frequency: z.string().min(1, 'Frequency is required'),
  instructions: z.string()
    .max(500, 'Instructions must be less than 500 characters')
    .optional(),
});

// Profile validation schema
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  emergency_contact_name: z.string()
    .min(2, 'Emergency contact name must be at least 2 characters')
    .max(100, 'Emergency contact name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  emergency_contact_phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid emergency contact phone number')
    .optional()
    .or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type HealthMetricFormData = z.infer<typeof healthMetricSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;