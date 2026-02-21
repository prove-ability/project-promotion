import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Better Auth API handler
  route("api/auth/*", "routes/auth/api.ts"),

  // Auth pages
  route("login", "routes/auth/login.tsx"),

  // API
  route("api/rebuild", "routes/api/rebuild.ts"),

  // Dashboard (authenticated)
  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
    route("dashboard/pages/:id/edit", "routes/dashboard/editor.tsx"),
    route("dashboard/pages/:id/analytics", "routes/dashboard/analytics.tsx"),
  ]),
] satisfies RouteConfig;
