import * as z from 'zod';

export const QuestionsSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: 'Username must be at least 5 characters long',
    })
    .max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
