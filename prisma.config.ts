import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Load env vars before config is evaluated
dotenv.config();

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
});
