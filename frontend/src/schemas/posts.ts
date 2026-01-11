import z from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  content: z.string().min(1, 'El contenido no puede estar vacío'),
});

export const updatePostSchema = createPostSchema.partial();
