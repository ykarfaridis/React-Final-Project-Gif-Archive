import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("archive", "routes/home.tsx"),
  route("gif/:title/:id", "routes/gif.tsx"),
] satisfies RouteConfig;
