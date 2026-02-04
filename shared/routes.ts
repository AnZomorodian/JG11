import { z } from "zod";
import { insertDownloadSchema, downloads, insertUserSchema, users } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized
      }
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: { 200: z.object({ success: z.boolean() }) }
    },
    me: {
      method: "GET" as const,
      path: "/api/me",
      responses: {
        200: z.custom<typeof users.$inferSelect | null>(),
      }
    }
  },
  downloads: {
    analyze: {
      method: "POST" as const,
      path: "/api/analyze",
      input: z.object({ url: z.string().url() }),
      responses: {
        200: z.object({
          title: z.string(),
          thumbnail: z.string().optional(),
          formats: z.array(z.object({
            url: z.string(),
            ext: z.string(),
            quality: z.string().optional(),
            label: z.string().optional()
          }))
        }),
        400: errorSchemas.validation,
        403: errorSchemas.unauthorized,
        500: errorSchemas.internal
      }
    },
    history: {
       method: "GET" as const,
       path: "/api/history",
       responses: {
         200: z.array(z.custom<typeof downloads.$inferSelect>())
       }
    }
  },
  admin: {
    users: {
      list: {
        method: "GET" as const,
        path: "/api/admin/users",
        responses: { 200: z.array(z.custom<typeof users.$inferSelect>()) }
      },
      create: {
        method: "POST" as const,
        path: "/api/admin/users",
        input: insertUserSchema,
        responses: { 201: z.custom<typeof users.$inferSelect>() }
      },
      update: {
        method: "PATCH" as const,
        path: "/api/admin/users/:id",
        input: z.object({
          isBanned: z.boolean().optional(),
          banUntil: z.string().optional(),
          dailyLimit: z.number().optional(),
        }),
        responses: { 200: z.custom<typeof users.$inferSelect>() }
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/admin/users/:id",
        responses: { 204: z.void() }
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
