import z from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email('Correo inválido'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
