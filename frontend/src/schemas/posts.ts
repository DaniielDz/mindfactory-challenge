import z from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder los 100 caracteres'),
  content: z
    .string()
    .min(20, 'El contenido debe tener al menos 20 caracteres')
    .max(1500, 'El contenido no puede exceder los 1500 caracteres'),
});

export const updatePostSchema = createPostSchema.partial();
