import { z } from "zod";

export const updateMenuFormSchema = z.object({
  id: z.string().uuid({ message: "Menu ID must be a valid UUID" }),
  depth: z.string(),
  sequence: z.number(),
  parentData: z.string(),
  name: z.string().min(2, { message: "Name must have at least 2 characters" }),
});

export const createMenuFormSchema = z.object({
  parent_id: z.string(),
  name: z.string().min(2, { message: "Name must have at least 2 characters" }),
});

export const moveMenuSchema = z.object({
  depth: z.number(),
  sequence: z.number(),
  parent_id: z.string().nullable,
});

export const reorderMenuSchema = z.object({
  sequence: z.number()
});

export type UpdateMenuFormSchema = z.infer<typeof updateMenuFormSchema>;
export type CreateMenuFormSchema = z.infer<typeof createMenuFormSchema>;
export type MoveMenuSchema = z.infer<typeof moveMenuSchema>;
export type ReorderMenuSchema = z.infer<typeof reorderMenuSchema>;
