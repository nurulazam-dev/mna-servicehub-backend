import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envVars } from "../config/env";

const connectionString = envVars.DATABASE_URL; // Follow the (Better-Auth 8 No) step, then it will be work

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
