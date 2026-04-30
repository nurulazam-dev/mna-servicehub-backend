var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express5 from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file!`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app.ts
import qs from "qs";

// src/app/routes/index.ts
import { Router as Router13 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/module/auth/auth.service.ts
import status2 from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String           @id @default(uuid())\n  name               String\n  email              String\n  emailVerified      Boolean          @default(false)\n  image              String?\n  address            String?\n  phone              String\n  role               UserRole         @default(CUSTOMER)\n  status             UserStatus       @default(ACTIVE)\n  needPasswordChange Boolean          @default(false)\n  isDeleted          Boolean          @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime         @default(now())\n  updatedAt          DateTime         @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  serviceProvider    ServiceProvider?\n  serviceRequests    ServiceRequest[] @relation("CustomerServiceRequests")\n  jobApplications    JobApplication[]\n  reviews            Review[]         @relation("CustomerReviews")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel CostBreakdown {\n  id             String         @id @default(uuid())\n  requestId      String         @unique\n  serviceRequest ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)\n  serviceCharge  Decimal        @default(0) @db.Decimal(10, 2)\n  productCost    Decimal        @default(0) @db.Decimal(10, 2)\n  additionalCost Decimal        @default(0) @db.Decimal(10, 2)\n  totalAmount    Decimal        @default(0) @db.Decimal(10, 2)\n\n  @@map("cost_breakdowns")\n}\n\nenum UserRole {\n  ADMIN\n  MANAGER\n  SERVICE_PROVIDER\n  CUSTOMER\n  JOB_CANDIDATE\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum ServiceRequestStatus {\n  PENDING\n  ACCEPTED\n  IN_PROGRESS\n  COMPLETED\n  REJECTED\n}\n\nenum JobApplicationStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  UNPAID\n  FAILED\n}\n\nmodel JobApplication {\n  id        String               @id @default(uuid())\n  userId    String\n  user      User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  jobPostId String?\n  jobPost   JobPost?             @relation(fields: [jobPostId], references: [id], onDelete: Cascade)\n  cvUrl     String\n  status    JobApplicationStatus @default(PENDING)\n  feedback  String?\n  createdAt DateTime             @default(now())\n\n  @@unique([userId, jobPostId])\n  @@index([jobPostId])\n  @@index([status])\n  @@map("job_applications")\n}\n\nmodel JobPost {\n  id           String           @id @default(uuid())\n  title        String\n  description  String           @db.Text\n  requirements String           @db.Text\n  location     String?          @default("Remote")\n  serviceType  String\n  vacancy      Int              @default(1)\n  salaryRange  String?\n  deadline     DateTime\n  isActive     Boolean          @default(true)\n  createdAt    DateTime         @default(now())\n  updatedAt    DateTime         @updatedAt\n  applications JobApplication[]\n\n  @@index([serviceType])\n  @@index([isActive])\n  @@map("job_posts")\n}\n\nmodel Payment {\n  id                 String         @id @default(uuid())\n  amount             Decimal        @db.Decimal(10, 2)\n  transactionId      String         @unique\n  stripeEventId      String?        @unique\n  stripeCustomerId   String?\n  invoiceUrl         String?        @db.Text\n  paymentGatewayData Json?\n  status             PaymentStatus  @default(PENDING)\n  createdAt          DateTime       @default(now())\n  updatedAt          DateTime       @updatedAt\n  requestId          String         @unique\n  serviceRequest     ServiceRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)\n\n  @@index([requestId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Review {\n  id              String          @id @default(uuid())\n  requestId       String          @unique\n  serviceRequest  ServiceRequest  @relation(fields: [requestId], references: [id], onDelete: Cascade)\n  serviceId       String\n  service         Service         @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n  providerId      String\n  serviceProvider ServiceProvider @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  customerId      String\n  customer        User            @relation("CustomerReviews", fields: [customerId], references: [id], onDelete: Cascade)\n  rating          Int\n  comment         String          @db.Text\n  createdAt       DateTime        @default(now())\n\n  @@index([requestId])\n  @@index([providerId])\n  @@index([customerId])\n  @@index([serviceId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id              String           @id @default(uuid())\n  name            String           @unique\n  description     String           @db.Text\n  imageUrl        String?\n  averageRating   Float            @default(0.0)\n  totalReviews    Int              @default(0)\n  isActive        Boolean          @default(true)\n  // isDeleted       Boolean          @default(false)\n  serviceRequests ServiceRequest[]\n  reviews         Review[]\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n\n  @@map("services")\n}\n\nmodel ServiceProvider {\n  id            String            @id @default(uuid())\n  userId        String            @unique\n  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  serviceType   String\n  bio           String?\n  isActive      Boolean           @default(true)\n  experience    Int               @default(0)\n  designation   String?\n  schedules     ServiceSchedule[]\n  assignedJobs  ServiceRequest[]  @relation("ServiceProviderJobs")\n  averageRating Float             @default(0.0)\n  totalReviews  Int               @default(0)\n  reviews       Review[]\n\n  @@index([serviceType])\n  @@map("service_providers")\n}\n\nmodel ServiceRequest {\n  id                 String               @id @default(uuid())\n  customerId         String\n  customer           User                 @relation("CustomerServiceRequests", fields: [customerId], references: [id], onDelete: Cascade)\n  providerId         String?\n  provider           ServiceProvider?     @relation("ServiceProviderJobs", fields: [providerId], references: [id], onDelete: Cascade)\n  serviceId          String\n  service            Service              @relation(fields: [serviceId], references: [id])\n  scheduleId         String?              @unique\n  schedule           ServiceSchedule?     @relation(fields: [scheduleId], references: [id], onDelete: Cascade)\n  serviceDescription String               @db.Text\n  serviceAddress     String\n  activePhone        String\n  status             ServiceRequestStatus @default(PENDING)\n  isDeleted          Boolean              @default(false)\n  rejectionReason    String?\n  createdAt          DateTime             @default(now())\n  updatedAt          DateTime             @updatedAt\n  costBreakdown      CostBreakdown?\n  payment            Payment?\n  paymentStatus      PaymentStatus        @default(UNPAID)\n  review             Review?\n\n  @@index([customerId])\n  @@index([providerId])\n  @@index([status])\n  @@map("service_requests")\n}\n\nmodel ServiceSchedule {\n  id             String          @id @default(uuid())\n  scheduleDate   DateTime\n  startTime      String\n  endTime        String\n  slotNumber     Int\n  isBooked       Boolean         @default(false)\n  providerId     String\n  provider       ServiceProvider @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  serviceRequest ServiceRequest?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n\n  @@unique([providerId, scheduleDate, startTime])\n  @@index([providerId, scheduleDate])\n  @@map("service_schedules")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"serviceProvider","kind":"object","type":"ServiceProvider","relationName":"ServiceProviderToUser"},{"name":"serviceRequests","kind":"object","type":"ServiceRequest","relationName":"CustomerServiceRequests"},{"name":"jobApplications","kind":"object","type":"JobApplication","relationName":"JobApplicationToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"CustomerReviews"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"CostBreakdown":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"serviceRequest","kind":"object","type":"ServiceRequest","relationName":"CostBreakdownToServiceRequest"},{"name":"serviceCharge","kind":"scalar","type":"Decimal"},{"name":"productCost","kind":"scalar","type":"Decimal"},{"name":"additionalCost","kind":"scalar","type":"Decimal"},{"name":"totalAmount","kind":"scalar","type":"Decimal"}],"dbName":"cost_breakdowns"},"JobApplication":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"JobApplicationToUser"},{"name":"jobPostId","kind":"scalar","type":"String"},{"name":"jobPost","kind":"object","type":"JobPost","relationName":"JobApplicationToJobPost"},{"name":"cvUrl","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"JobApplicationStatus"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"job_applications"},"JobPost":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"requirements","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"serviceType","kind":"scalar","type":"String"},{"name":"vacancy","kind":"scalar","type":"Int"},{"name":"salaryRange","kind":"scalar","type":"String"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"applications","kind":"object","type":"JobApplication","relationName":"JobApplicationToJobPost"}],"dbName":"job_posts"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"invoiceUrl","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"serviceRequest","kind":"object","type":"ServiceRequest","relationName":"PaymentToServiceRequest"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"requestId","kind":"scalar","type":"String"},{"name":"serviceRequest","kind":"object","type":"ServiceRequest","relationName":"ReviewToServiceRequest"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"ReviewToService"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"serviceProvider","kind":"object","type":"ServiceProvider","relationName":"ReviewToServiceProvider"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerReviews"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"serviceRequests","kind":"object","type":"ServiceRequest","relationName":"ServiceToServiceRequest"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToService"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"services"},"ServiceProvider":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ServiceProviderToUser"},{"name":"serviceType","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"designation","kind":"scalar","type":"String"},{"name":"schedules","kind":"object","type":"ServiceSchedule","relationName":"ServiceProviderToServiceSchedule"},{"name":"assignedJobs","kind":"object","type":"ServiceRequest","relationName":"ServiceProviderJobs"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToServiceProvider"}],"dbName":"service_providers"},"ServiceRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerServiceRequests"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ServiceProvider","relationName":"ServiceProviderJobs"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"service","kind":"object","type":"Service","relationName":"ServiceToServiceRequest"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"ServiceSchedule","relationName":"ServiceRequestToServiceSchedule"},{"name":"serviceDescription","kind":"scalar","type":"String"},{"name":"serviceAddress","kind":"scalar","type":"String"},{"name":"activePhone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ServiceRequestStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"costBreakdown","kind":"object","type":"CostBreakdown","relationName":"CostBreakdownToServiceRequest"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToServiceRequest"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToServiceRequest"}],"dbName":"service_requests"},"ServiceSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"scheduleDate","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"slotNumber","kind":"scalar","type":"Int"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ServiceProvider","relationName":"ServiceProviderToServiceSchedule"},{"name":"serviceRequest","kind":"object","type":"ServiceRequest","relationName":"ServiceRequestToServiceSchedule"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"service_schedules"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","provider","customer","serviceRequests","serviceRequest","service","serviceProvider","reviews","_count","schedule","costBreakdown","payment","review","schedules","assignedJobs","applications","jobPost","jobApplications","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","CostBreakdown.findUnique","CostBreakdown.findUniqueOrThrow","CostBreakdown.findFirst","CostBreakdown.findFirstOrThrow","CostBreakdown.findMany","CostBreakdown.createOne","CostBreakdown.createMany","CostBreakdown.createManyAndReturn","CostBreakdown.updateOne","CostBreakdown.updateMany","CostBreakdown.updateManyAndReturn","CostBreakdown.upsertOne","CostBreakdown.deleteOne","CostBreakdown.deleteMany","_avg","_sum","CostBreakdown.groupBy","CostBreakdown.aggregate","JobApplication.findUnique","JobApplication.findUniqueOrThrow","JobApplication.findFirst","JobApplication.findFirstOrThrow","JobApplication.findMany","JobApplication.createOne","JobApplication.createMany","JobApplication.createManyAndReturn","JobApplication.updateOne","JobApplication.updateMany","JobApplication.updateManyAndReturn","JobApplication.upsertOne","JobApplication.deleteOne","JobApplication.deleteMany","JobApplication.groupBy","JobApplication.aggregate","JobPost.findUnique","JobPost.findUniqueOrThrow","JobPost.findFirst","JobPost.findFirstOrThrow","JobPost.findMany","JobPost.createOne","JobPost.createMany","JobPost.createManyAndReturn","JobPost.updateOne","JobPost.updateMany","JobPost.updateManyAndReturn","JobPost.upsertOne","JobPost.deleteOne","JobPost.deleteMany","JobPost.groupBy","JobPost.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","ServiceProvider.findUnique","ServiceProvider.findUniqueOrThrow","ServiceProvider.findFirst","ServiceProvider.findFirstOrThrow","ServiceProvider.findMany","ServiceProvider.createOne","ServiceProvider.createMany","ServiceProvider.createManyAndReturn","ServiceProvider.updateOne","ServiceProvider.updateMany","ServiceProvider.updateManyAndReturn","ServiceProvider.upsertOne","ServiceProvider.deleteOne","ServiceProvider.deleteMany","ServiceProvider.groupBy","ServiceProvider.aggregate","ServiceRequest.findUnique","ServiceRequest.findUniqueOrThrow","ServiceRequest.findFirst","ServiceRequest.findFirstOrThrow","ServiceRequest.findMany","ServiceRequest.createOne","ServiceRequest.createMany","ServiceRequest.createManyAndReturn","ServiceRequest.updateOne","ServiceRequest.updateMany","ServiceRequest.updateManyAndReturn","ServiceRequest.upsertOne","ServiceRequest.deleteOne","ServiceRequest.deleteMany","ServiceRequest.groupBy","ServiceRequest.aggregate","ServiceSchedule.findUnique","ServiceSchedule.findUniqueOrThrow","ServiceSchedule.findFirst","ServiceSchedule.findFirstOrThrow","ServiceSchedule.findMany","ServiceSchedule.createOne","ServiceSchedule.createMany","ServiceSchedule.createManyAndReturn","ServiceSchedule.updateOne","ServiceSchedule.updateMany","ServiceSchedule.updateManyAndReturn","ServiceSchedule.upsertOne","ServiceSchedule.deleteOne","ServiceSchedule.deleteMany","ServiceSchedule.groupBy","ServiceSchedule.aggregate","AND","OR","NOT","id","scheduleDate","startTime","endTime","slotNumber","isBooked","providerId","createdAt","updatedAt","equals","not","in","notIn","lt","lte","gt","gte","contains","startsWith","endsWith","customerId","serviceId","scheduleId","serviceDescription","serviceAddress","activePhone","ServiceRequestStatus","status","isDeleted","rejectionReason","PaymentStatus","paymentStatus","userId","serviceType","bio","isActive","experience","designation","averageRating","totalReviews","every","some","none","name","description","imageUrl","requestId","rating","comment","amount","transactionId","stripeEventId","stripeCustomerId","invoiceUrl","paymentGatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","title","requirements","location","vacancy","salaryRange","deadline","jobPostId","cvUrl","JobApplicationStatus","feedback","serviceCharge","productCost","additionalCost","totalAmount","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","image","address","phone","UserRole","role","UserStatus","needPasswordChange","deletedAt","userId_jobPostId","providerId_scheduleDate_startTime","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "yQZ70AEXBAAAugMAIAUAALsDACAIAACOAwAgCwAAvAMAIAwAAI8DACAWAAChAwAg7wEAALYDADDwAQAAOAAQ8QEAALYDADDyAQEAAAAB-QFAAJIDACH6AUAAkgMAIY0CAAC4A9MCIo4CIACJAwAhnQIBAIcDACHLAgEAAAABzAIgAIkDACHNAgEAiAMAIc4CAQCIAwAhzwIBAIcDACHRAgAAtwPRAiLTAiAAiQMAIdQCQAC5AwAhAQAAAAEAIAwDAACMAwAg7wEAAM4DADDwAQAAAwAQ8QEAAM4DADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACGSAgEAhwMAIb8CQACSAwAhyAIBAIcDACHJAgEAiAMAIcoCAQCIAwAhAwMAAMAEACDJAgAAhgQAIMoCAACGBAAgDAMAAIwDACDvAQAAzgMAMPABAAADABDxAQAAzgMAMPIBAQAAAAH5AUAAkgMAIfoBQACSAwAhkgIBAIcDACG_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_ADAUBAAAogUAIAUAAKMFACAIAAClBQAgCwAApAUAIAwAAKcFACAWAACmBQAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAKEF0wIijgIgANcDACGdAgEA1AMAIcsCAQDUAwAhzAIgANcDACHNAgEA4AMAIc4CAQDgAwAhzwIBANQDACHRAgAAoAXRAiLTAiAA1wMAIdQCQACVBQAhAgAAAAEAIBwAAEIAIA7yAQEA1AMAIfkBQADVAwAh-gFAANUDACGNAgAAoQXTAiKOAiAA1wMAIZ0CAQDUAwAhywIBANQDACHMAiAA1wMAIc0CAQDgAwAhzgIBAOADACHPAgEA1AMAIdECAACgBdECItMCIADXAwAh1AJAAJUFACECAAAAOAAgHAAARAAgAgAAADgAIBwAAEQAIAMAAAABACAjAAA9ACAkAABCACABAAAAAQAgAQAAADgAIAYNAACdBQAgKQAAnwUAICoAAJ4FACDNAgAAhgQAIM4CAACGBAAg1AIAAIYEACAR7wEAAK8DADDwAQAASwAQ8QEAAK8DADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACGNAgAAsQPTAiKOAiAA7gIAIZ0CAQDrAgAhywIBAOsCACHMAiAA7gIAIc0CAQD5AgAhzgIBAPkCACHPAgEA6wIAIdECAACwA9ECItMCIADuAgAh1AJAAKsDACEDAAAAOAAgAQAASgAwKAAASwAgAwAAADgAIAEAADkAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAJwFACDyAQEAAAAB-QFAAAAAAfoBQAAAAAGSAgEAAAABvwJAAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAQEcAABTACAI8gEBAAAAAfkBQAAAAAH6AUAAAAABkgIBAAAAAb8CQAAAAAHIAgEAAAAByQIBAAAAAcoCAQAAAAEBHAAAVQAwARwAAFUAMAkDAACbBQAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhkgIBANQDACG_AkAA1QMAIcgCAQDUAwAhyQIBAOADACHKAgEA4AMAIQIAAAAFACAcAABYACAI8gEBANQDACH5AUAA1QMAIfoBQADVAwAhkgIBANQDACG_AkAA1QMAIcgCAQDUAwAhyQIBAOADACHKAgEA4AMAIQIAAAADACAcAABaACACAAAAAwAgHAAAWgAgAwAAAAUAICMAAFMAICQAAFgAIAEAAAAFACABAAAAAwAgBQ0AAJgFACApAACaBQAgKgAAmQUAIMkCAACGBAAgygIAAIYEACAL7wEAAK4DADDwAQAAYQAQ8QEAAK4DADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACGSAgEA6wIAIb8CQADsAgAhyAIBAOsCACHJAgEA-QIAIcoCAQD5AgAhAwAAAAMAIAEAAGAAMCgAAGEAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAACXBQAg8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAZICAQAAAAHAAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAJAAAAAAcUCQAAAAAHGAgEAAAABxwIBAAAAAQEcAABpACAN8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAZICAQAAAAHAAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAJAAAAAAcUCQAAAAAHGAgEAAAABxwIBAAAAAQEcAABrADABHAAAawAwDgMAAJYFACDyAQEA1AMAIfgBAQDUAwAh-QFAANUDACH6AUAA1QMAIZICAQDUAwAhwAIBANQDACHBAgEA4AMAIcICAQDgAwAhwwIBAOADACHEAkAAlQUAIcUCQACVBQAhxgIBAOADACHHAgEA4AMAIQIAAAAJACAcAABuACAN8gEBANQDACH4AQEA1AMAIfkBQADVAwAh-gFAANUDACGSAgEA1AMAIcACAQDUAwAhwQIBAOADACHCAgEA4AMAIcMCAQDgAwAhxAJAAJUFACHFAkAAlQUAIcYCAQDgAwAhxwIBAOADACECAAAABwAgHAAAcAAgAgAAAAcAIBwAAHAAIAMAAAAJACAjAABpACAkAABuACABAAAACQAgAQAAAAcAIAoNAACSBQAgKQAAlAUAICoAAJMFACDBAgAAhgQAIMICAACGBAAgwwIAAIYEACDEAgAAhgQAIMUCAACGBAAgxgIAAIYEACDHAgAAhgQAIBDvAQAAqgMAMPABAAB3ABDxAQAAqgMAMPIBAQDrAgAh-AEBAOsCACH5AUAA7AIAIfoBQADsAgAhkgIBAOsCACHAAgEA6wIAIcECAQD5AgAhwgIBAPkCACHDAgEA-QIAIcQCQACrAwAhxQJAAKsDACHGAgEA-QIAIccCAQD5AgAhAwAAAAcAIAEAAHYAMCgAAHcAIAMAAAAHACABAAAIADACAAAJACAJ7wEAAKkDADDwAQAAfQAQ8QEAAKkDADDyAQEAAAAB-QFAAJIDACH6AUAAkgMAIb0CAQCHAwAhvgIBAIcDACG_AkAAkgMAIQEAAAB6ACABAAAAegAgCe8BAACpAwAw8AEAAH0AEPEBAACpAwAw8gEBAIcDACH5AUAAkgMAIfoBQACSAwAhvQIBAIcDACG-AgEAhwMAIb8CQACSAwAhAAMAAAB9ACABAAB-ADACAAB6ACADAAAAfQAgAQAAfgAwAgAAegAgAwAAAH0AIAEAAH4AMAIAAHoAIAbyAQEAAAAB-QFAAAAAAfoBQAAAAAG9AgEAAAABvgIBAAAAAb8CQAAAAAEBHAAAggEAIAbyAQEAAAAB-QFAAAAAAfoBQAAAAAG9AgEAAAABvgIBAAAAAb8CQAAAAAEBHAAAhAEAMAEcAACEAQAwBvIBAQDUAwAh-QFAANUDACH6AUAA1QMAIb0CAQDUAwAhvgIBANQDACG_AkAA1QMAIQIAAAB6ACAcAACHAQAgBvIBAQDUAwAh-QFAANUDACH6AUAA1QMAIb0CAQDUAwAhvgIBANQDACG_AkAA1QMAIQIAAAB9ACAcAACJAQAgAgAAAH0AIBwAAIkBACADAAAAegAgIwAAggEAICQAAIcBACABAAAAegAgAQAAAH0AIAMNAACPBQAgKQAAkQUAICoAAJAFACAJ7wEAAKgDADDwAQAAkAEAEPEBAACoAwAw8gEBAOsCACH5AUAA7AIAIfoBQADsAgAhvQIBAOsCACG-AgEA6wIAIb8CQADsAgAhAwAAAH0AIAEAAI8BADAoAACQAQAgAwAAAH0AIAEAAH4AMAIAAHoAIAoJAACeAwAg7wEAAKcDADDwAQAAHgAQ8QEAAKcDADDyAQEAAAABoAIBAAAAAbkCEACbAwAhugIQAJsDACG7AhAAmwMAIbwCEACbAwAhAQAAAJMBACABAAAAkwEAIAEJAADrBAAgAwAAAB4AIAEAAJYBADACAACTAQAgAwAAAB4AIAEAAJYBADACAACTAQAgAwAAAB4AIAEAAJYBADACAACTAQAgBwkAAI4FACDyAQEAAAABoAIBAAAAAbkCEAAAAAG6AhAAAAABuwIQAAAAAbwCEAAAAAEBHAAAmgEAIAbyAQEAAAABoAIBAAAAAbkCEAAAAAG6AhAAAAABuwIQAAAAAbwCEAAAAAEBHAAAnAEAMAEcAACcAQAwBwkAAI0FACDyAQEA1AMAIaACAQDUAwAhuQIQAPgDACG6AhAA-AMAIbsCEAD4AwAhvAIQAPgDACECAAAAkwEAIBwAAJ8BACAG8gEBANQDACGgAgEA1AMAIbkCEAD4AwAhugIQAPgDACG7AhAA-AMAIbwCEAD4AwAhAgAAAB4AIBwAAKEBACACAAAAHgAgHAAAoQEAIAMAAACTAQAgIwAAmgEAICQAAJ8BACABAAAAkwEAIAEAAAAeACAFDQAAiAUAICkAAIsFACAqAACKBQAgawAAiQUAIGwAAIwFACAJ7wEAAKYDADDwAQAAqAEAEPEBAACmAwAw8gEBAOsCACGgAgEA6wIAIbkCEACVAwAhugIQAJUDACG7AhAAlQMAIbwCEACVAwAhAwAAAB4AIAEAAKcBADAoAACoAQAgAwAAAB4AIAEAAJYBADACAACTAQAgAQAAACsAIAEAAAArACADAAAAKQAgAQAAKgAwAgAAKwAgAwAAACkAIAEAACoAMAIAACsAIAMAAAApACABAAAqADACAAArACAJAwAAgAUAIBUAAIcFACDyAQEAAAAB-QFAAAAAAY0CAAAAuAICkgIBAAAAAbUCAQAAAAG2AgEAAAABuAIBAAAAAQEcAACwAQAgB_IBAQAAAAH5AUAAAAABjQIAAAC4AgKSAgEAAAABtQIBAAAAAbYCAQAAAAG4AgEAAAABARwAALIBADABHAAAsgEAMAEAAAAtACAJAwAA_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-gFAAOwCACGNAgAA-wKRAiKgAgEA6wIAIaMCEACVAwAhpAIBAOsCACGlAgEA-QIAIaYCAQD5AgAhpwIBAPkCACGoAgAAlgMAIAMAAAAgACABAADvAQAwKAAA8AEAIAMAAAAgACABAADeAQAwAgAA2wEAIAEAAAAZACABAAAAGQAgAwAAABcAIAEAABgAMAIAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgDAcAAPIDACAJAACjBAAgCgAA8AMAIAsAAPEDACDyAQEAAAAB-AEBAAAAAfkBQAAAAAGGAgEAAAABhwIBAAAAAaACAQAAAAGhAgIAAAABogIBAAAAAQEcAAD4AQAgCPIBAQAAAAH4AQEAAAAB-QFAAAAAAYYCAQAAAAGHAgEAAAABoAIBAAAAAaECAgAAAAGiAgEAAAABARwAAPoBADABHAAA-gEAMAwHAADvAwAgCQAAoQQAIAoAAO0DACALAADuAwAg8gEBANQDACH4AQEA1AMAIfkBQADVAwAhhgIBANQDACGHAgEA1AMAIaACAQDUAwAhoQICANYDACGiAgEA1AMAIQIAAAAZACAcAAD9AQAgCPIBAQDUAwAh-AEBANQDACH5AUAA1QMAIYYCAQDUAwAhhwIBANQDACGgAgEA1AMAIaECAgDWAwAhogIBANQDACECAAAAFwAgHAAA_wEAIAIAAAAXACAcAAD_AQAgAwAAABkAICMAAPgBACAkAAD9AQAgAQAAABkAIAEAAAAXACAFDQAA3wQAICkAAOIEACAqAADhBAAgawAA4AQAIGwAAOMEACAL7wEAAJMDADDwAQAAhgIAEPEBAACTAwAw8gEBAOsCACH4AQEA6wIAIfkBQADsAgAhhgIBAOsCACGHAgEA6wIAIaACAQDrAgAhoQICAO0CACGiAgEA6wIAIQMAAAAXACABAACFAgAwKAAAhgIAIAMAAAAXACABAAAYADACAAAZACAOCAAAjgMAIAwAAI8DACDvAQAAkQMAMPABAACMAgAQ8QEAAJEDADDyAQEAAAAB-QFAAJIDACH6AUAAkgMAIZUCIACJAwAhmAIIAIsDACGZAgIAigMAIZ0CAQAAAAGeAgEAhwMAIZ8CAQCIAwAhAQAAAIkCACABAAAAiQIAIA4IAACOAwAgDAAAjwMAIO8BAACRAwAw8AEAAIwCABDxAQAAkQMAMPIBAQCHAwAh-QFAAJIDACH6AUAAkgMAIZUCIACJAwAhmAIIAIsDACGZAgIAigMAIZ0CAQCHAwAhngIBAIcDACGfAgEAiAMAIQMIAADCBAAgDAAAwwQAIJ8CAACGBAAgAwAAAIwCACABAACNAgAwAgAAiQIAIAMAAACMAgAgAQAAjQIAMAIAAIkCACADAAAAjAIAIAEAAI0CADACAACJAgAgCwgAAN0EACAMAADeBAAg8gEBAAAAAfkBQAAAAAH6AUAAAAABlQIgAAAAAZgCCAAAAAGZAgIAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABARwAAJECACAJ8gEBAAAAAfkBQAAAAAH6AUAAAAABlQIgAAAAAZgCCAAAAAGZAgIAAAABnQIBAAAAAZ4CAQAAAAGfAgEAAAABARwAAJMCADABHAAAkwIAMAsIAADJBAAgDAAAygQAIPIBAQDUAwAh-QFAANUDACH6AUAA1QMAIZUCIADXAwAhmAIIAJEEACGZAgIA1gMAIZ0CAQDUAwAhngIBANQDACGfAgEA4AMAIQIAAACJAgAgHAAAlgIAIAnyAQEA1AMAIfkBQADVAwAh-gFAANUDACGVAiAA1wMAIZgCCACRBAAhmQICANYDACGdAgEA1AMAIZ4CAQDUAwAhnwIBAOADACECAAAAjAIAIBwAAJgCACACAAAAjAIAIBwAAJgCACADAAAAiQIAICMAAJECACAkAACWAgAgAQAAAIkCACABAAAAjAIAIAYNAADEBAAgKQAAxwQAICoAAMYEACBrAADFBAAgbAAAyAQAIJ8CAACGBAAgDO8BAACQAwAw8AEAAJ8CABDxAQAAkAMAMPIBAQDrAgAh-QFAAOwCACH6AUAA7AIAIZUCIADuAgAhmAIIAIQDACGZAgIA7QIAIZ0CAQDrAgAhngIBAOsCACGfAgEA-QIAIQMAAACMAgAgAQAAngIAMCgAAJ8CACADAAAAjAIAIAEAAI0CADACAACJAgAgEAMAAIwDACAMAACPAwAgEgAAjQMAIBMAAI4DACDvAQAAhgMAMPABAAALABDxAQAAhgMAMPIBAQAAAAGSAgEAAAABkwIBAIcDACGUAgEAiAMAIZUCIACJAwAhlgICAIoDACGXAgEAiAMAIZgCCACLAwAhmQICAIoDACEBAAAAogIAIAEAAACiAgAgBgMAAMAEACAMAADDBAAgEgAAwQQAIBMAAMIEACCUAgAAhgQAIJcCAACGBAAgAwAAAAsAIAEAAKUCADACAACiAgAgAwAAAAsAIAEAAKUCADACAACiAgAgAwAAAAsAIAEAAKUCADACAACiAgAgDQMAALwEACAMAAC_BAAgEgAAvQQAIBMAAL4EACDyAQEAAAABkgIBAAAAAZMCAQAAAAGUAgEAAAABlQIgAAAAAZYCAgAAAAGXAgEAAAABmAIIAAAAAZkCAgAAAAEBHAAAqQIAIAnyAQEAAAABkgIBAAAAAZMCAQAAAAGUAgEAAAABlQIgAAAAAZYCAgAAAAGXAgEAAAABmAIIAAAAAZkCAgAAAAEBHAAAqwIAMAEcAACrAgAwDQMAAJIEACAMAACVBAAgEgAAkwQAIBMAAJQEACDyAQEA1AMAIZICAQDUAwAhkwIBANQDACGUAgEA4AMAIZUCIADXAwAhlgICANYDACGXAgEA4AMAIZgCCACRBAAhmQICANYDACECAAAAogIAIBwAAK4CACAJ8gEBANQDACGSAgEA1AMAIZMCAQDUAwAhlAIBAOADACGVAiAA1wMAIZYCAgDWAwAhlwIBAOADACGYAggAkQQAIZkCAgDWAwAhAgAAAAsAIBwAALACACACAAAACwAgHAAAsAIAIAMAAACiAgAgIwAAqQIAICQAAK4CACABAAAAogIAIAEAAAALACAHDQAAjAQAICkAAI8EACAqAACOBAAgawAAjQQAIGwAAJAEACCUAgAAhgQAIJcCAACGBAAgDO8BAACDAwAw8AEAALcCABDxAQAAgwMAMPIBAQDrAgAhkgIBAOsCACGTAgEA6wIAIZQCAQD5AgAhlQIgAO4CACGWAgIA7QIAIZcCAQD5AgAhmAIIAIQDACGZAgIA7QIAIQMAAAALACABAAC2AgAwKAAAtwIAIAMAAAALACABAAClAgAwAgAAogIAIAEAAAAVACABAAAAFQAgAwAAABEAIAEAABQAMAIAABUAIAMAAAARACABAAAUADACAAAVACADAAAAEQAgAQAAFAAwAgAAFQAgFQYAAP8DACAHAAD-AwAgCgAAgAQAIA4AAIsEACAPAACBBAAgEAAAggQAIBEAAIMEACDyAQEAAAAB-AEBAAAAAfkBQAAAAAH6AUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIAAACNAgKOAiAAAAABjwIBAAAAAZECAAAAkQICARwAAL8CACAO8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAY0CAAAAjQICjgIgAAAAAY8CAQAAAAGRAgAAAJECAgEcAADBAgAwARwAAMECADABAAAACwAgAQAAAA0AIBUGAADjAwAgBwAA4gMAIAoAAOQDACAOAACKBAAgDwAA5QMAIBAAAOYDACARAADnAwAg8gEBANQDACH4AQEA4AMAIfkBQADVAwAh-gFAANUDACGGAgEA1AMAIYcCAQDUAwAhiAIBAOADACGJAgEA1AMAIYoCAQDUAwAhiwIBANQDACGNAgAA3wONAiKOAiAA1wMAIY8CAQDgAwAhkQIAAOEDkQIiAgAAABUAIBwAAMYCACAO8gEBANQDACH4AQEA4AMAIfkBQADVAwAh-gFAANUDACGGAgEA1AMAIYcCAQDUAwAhiAIBAOADACGJAgEA1AMAIYoCAQDUAwAhiwIBANQDACGNAgAA3wONAiKOAiAA1wMAIY8CAQDgAwAhkQIAAOEDkQIiAgAAABEAIBwAAMgCACACAAAAEQAgHAAAyAIAIAEAAAALACABAAAADQAgAwAAABUAICMAAL8CACAkAADGAgAgAQAAABUAIAEAAAARACAGDQAAhwQAICkAAIkEACAqAACIBAAg-AEAAIYEACCIAgAAhgQAII8CAACGBAAgEe8BAAD4AgAw8AEAANECABDxAQAA-AIAMPIBAQDrAgAh-AEBAPkCACH5AUAA7AIAIfoBQADsAgAhhgIBAOsCACGHAgEA6wIAIYgCAQD5AgAhiQIBAOsCACGKAgEA6wIAIYsCAQDrAgAhjQIAAPoCjQIijgIgAO4CACGPAgEA-QIAIZECAAD7ApECIgMAAAARACABAADQAgAwKAAA0QIAIAMAAAARACABAAAUADACAAAVACABAAAADwAgAQAAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAsGAACEBAAgCQAAhQQAIPIBAQAAAAHzAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQIAAAAB9wEgAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAQEcAADZAgAgCfIBAQAAAAHzAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQIAAAAB9wEgAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAQEcAADbAgAwARwAANsCADALBgAA2AMAIAkAANkDACDyAQEA1AMAIfMBQADVAwAh9AEBANQDACH1AQEA1AMAIfYBAgDWAwAh9wEgANcDACH4AQEA1AMAIfkBQADVAwAh-gFAANUDACECAAAADwAgHAAA3gIAIAnyAQEA1AMAIfMBQADVAwAh9AEBANQDACH1AQEA1AMAIfYBAgDWAwAh9wEgANcDACH4AQEA1AMAIfkBQADVAwAh-gFAANUDACECAAAADQAgHAAA4AIAIAIAAAANACAcAADgAgAgAwAAAA8AICMAANkCACAkAADeAgAgAQAAAA8AIAEAAAANACAFDQAAzwMAICkAANIDACAqAADRAwAgawAA0AMAIGwAANMDACAM7wEAAOoCADDwAQAA5wIAEPEBAADqAgAw8gEBAOsCACHzAUAA7AIAIfQBAQDrAgAh9QEBAOsCACH2AQIA7QIAIfcBIADuAgAh-AEBAOsCACH5AUAA7AIAIfoBQADsAgAhAwAAAA0AIAEAAOYCADAoAADnAgAgAwAAAA0AIAEAAA4AMAIAAA8AIAzvAQAA6gIAMPABAADnAgAQ8QEAAOoCADDyAQEA6wIAIfMBQADsAgAh9AEBAOsCACH1AQEA6wIAIfYBAgDtAgAh9wEgAO4CACH4AQEA6wIAIfkBQADsAgAh-gFAAOwCACEODQAA8AIAICkAAPcCACAqAAD3AgAg-wEBAAAAAfwBAQD2AgAh_QEBAAAABP4BAQAAAAT_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABCw0AAPACACApAAD1AgAgKgAA9QIAIPsBQAAAAAH8AUAA9AIAIf0BQAAAAAT-AUAAAAAE_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAAAAAQ0NAADwAgAgKQAA8AIAICoAAPACACBrAADzAgAgbAAA8AIAIPsBAgAAAAH8AQIA8gIAIf0BAgAAAAT-AQIAAAAE_wECAAAAAYACAgAAAAGBAgIAAAABggICAAAAAQUNAADwAgAgKQAA8QIAICoAAPECACD7ASAAAAAB_AEgAO8CACEFDQAA8AIAICkAAPECACAqAADxAgAg-wEgAAAAAfwBIADvAgAhCPsBAgAAAAH8AQIA8AIAIf0BAgAAAAT-AQIAAAAE_wECAAAAAYACAgAAAAGBAgIAAAABggICAAAAAQL7ASAAAAAB_AEgAPECACENDQAA8AIAICkAAPACACAqAADwAgAgawAA8wIAIGwAAPACACD7AQIAAAAB_AECAPICACH9AQIAAAAE_gECAAAABP8BAgAAAAGAAgIAAAABgQICAAAAAYICAgAAAAEI-wEIAAAAAfwBCADzAgAh_QEIAAAABP4BCAAAAAT_AQgAAAABgAIIAAAAAYECCAAAAAGCAggAAAABCw0AAPACACApAAD1AgAgKgAA9QIAIPsBQAAAAAH8AUAA9AIAIf0BQAAAAAT-AUAAAAAE_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAAAAAQj7AUAAAAAB_AFAAPUCACH9AUAAAAAE_gFAAAAABP8BQAAAAAGAAkAAAAABgQJAAAAAAYICQAAAAAEODQAA8AIAICkAAPcCACAqAAD3AgAg-wEBAAAAAfwBAQD2AgAh_QEBAAAABP4BAQAAAAT_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABC_sBAQAAAAH8AQEA9wIAIf0BAQAAAAT-AQEAAAAE_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAARHvAQAA-AIAMPABAADRAgAQ8QEAAPgCADDyAQEA6wIAIfgBAQD5AgAh-QFAAOwCACH6AUAA7AIAIYYCAQDrAgAhhwIBAOsCACGIAgEA-QIAIYkCAQDrAgAhigIBAOsCACGLAgEA6wIAIY0CAAD6Ao0CIo4CIADuAgAhjwIBAPkCACGRAgAA-wKRAiIODQAAgQMAICkAAIIDACAqAACCAwAg-wEBAAAAAfwBAQCAAwAh_QEBAAAABf4BAQAAAAX_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABBw0AAPACACApAAD_AgAgKgAA_wIAIPsBAAAAjQIC_AEAAP4CjQIi_QEAAACNAgj-AQAAAI0CCAcNAADwAgAgKQAA_QIAICoAAP0CACD7AQAAAJECAvwBAAD8ApECIv0BAAAAkQII_gEAAACRAggHDQAA8AIAICkAAP0CACAqAAD9AgAg-wEAAACRAgL8AQAA_AKRAiL9AQAAAJECCP4BAAAAkQIIBPsBAAAAkQIC_AEAAP0CkQIi_QEAAACRAgj-AQAAAJECCAcNAADwAgAgKQAA_wIAICoAAP8CACD7AQAAAI0CAvwBAAD-Ao0CIv0BAAAAjQII_gEAAACNAggE-wEAAACNAgL8AQAA_wKNAiL9AQAAAI0CCP4BAAAAjQIIDg0AAIEDACApAACCAwAgKgAAggMAIPsBAQAAAAH8AQEAgAMAIf0BAQAAAAX-AQEAAAAF_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAQj7AQIAAAAB_AECAIEDACH9AQIAAAAF_gECAAAABf8BAgAAAAGAAgIAAAABgQICAAAAAYICAgAAAAEL-wEBAAAAAfwBAQCCAwAh_QEBAAAABf4BAQAAAAX_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABDO8BAACDAwAw8AEAALcCABDxAQAAgwMAMPIBAQDrAgAhkgIBAOsCACGTAgEA6wIAIZQCAQD5AgAhlQIgAO4CACGWAgIA7QIAIZcCAQD5AgAhmAIIAIQDACGZAgIA7QIAIQ0NAADwAgAgKQAA8wIAICoAAPMCACBrAADzAgAgbAAA8wIAIPsBCAAAAAH8AQgAhQMAIf0BCAAAAAT-AQgAAAAE_wEIAAAAAYACCAAAAAGBAggAAAABggIIAAAAAQ0NAADwAgAgKQAA8wIAICoAAPMCACBrAADzAgAgbAAA8wIAIPsBCAAAAAH8AQgAhQMAIf0BCAAAAAT-AQgAAAAE_wEIAAAAAYACCAAAAAGBAggAAAABggIIAAAAARADAACMAwAgDAAAjwMAIBIAAI0DACATAACOAwAg7wEAAIYDADDwAQAACwAQ8QEAAIYDADDyAQEAhwMAIZICAQCHAwAhkwIBAIcDACGUAgEAiAMAIZUCIACJAwAhlgICAIoDACGXAgEAiAMAIZgCCACLAwAhmQICAIoDACEL-wEBAAAAAfwBAQD3AgAh_QEBAAAABP4BAQAAAAT_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABC_sBAQAAAAH8AQEAggMAIf0BAQAAAAX-AQEAAAAF_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAQL7ASAAAAAB_AEgAPECACEI-wECAAAAAfwBAgDwAgAh_QECAAAABP4BAgAAAAT_AQIAAAABgAICAAAAAYECAgAAAAGCAgIAAAABCPsBCAAAAAH8AQgA8wIAIf0BCAAAAAT-AQgAAAAE_wEIAAAAAYACCAAAAAGBAggAAAABggIIAAAAARkEAAC6AwAgBQAAuwMAIAgAAI4DACALAAC8AwAgDAAAjwMAIBYAAKEDACDvAQAAtgMAMPABAAA4ABDxAQAAtgMAMPIBAQCHAwAh-QFAAJIDACH6AUAAkgMAIY0CAAC4A9MCIo4CIACJAwAhnQIBAIcDACHLAgEAhwMAIcwCIACJAwAhzQIBAIgDACHOAgEAiAMAIc8CAQCHAwAh0QIAALcD0QIi0wIgAIkDACHUAkAAuQMAIdcCAAA4ACDYAgAAOAAgA5oCAAANACCbAgAADQAgnAIAAA0AIAOaAgAAEQAgmwIAABEAIJwCAAARACADmgIAABcAIJsCAAAXACCcAgAAFwAgDO8BAACQAwAw8AEAAJ8CABDxAQAAkAMAMPIBAQDrAgAh-QFAAOwCACH6AUAA7AIAIZUCIADuAgAhmAIIAIQDACGZAgIA7QIAIZ0CAQDrAgAhngIBAOsCACGfAgEA-QIAIQ4IAACOAwAgDAAAjwMAIO8BAACRAwAw8AEAAIwCABDxAQAAkQMAMPIBAQCHAwAh-QFAAJIDACH6AUAAkgMAIZUCIACJAwAhmAIIAIsDACGZAgIAigMAIZ0CAQCHAwAhngIBAIcDACGfAgEAiAMAIQj7AUAAAAAB_AFAAPUCACH9AUAAAAAE_gFAAAAABP8BQAAAAAGAAkAAAAABgQJAAAAAAYICQAAAAAEL7wEAAJMDADDwAQAAhgIAEPEBAACTAwAw8gEBAOsCACH4AQEA6wIAIfkBQADsAgAhhgIBAOsCACGHAgEA6wIAIaACAQDrAgAhoQICAO0CACGiAgEA6wIAIQ7vAQAAlAMAMPABAADwAQAQ8QEAAJQDADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACGNAgAA-wKRAiKgAgEA6wIAIaMCEACVAwAhpAIBAOsCACGlAgEA-QIAIaYCAQD5AgAhpwIBAPkCACGoAgAAlgMAIA0NAADwAgAgKQAAmQMAICoAAJkDACBrAACZAwAgbAAAmQMAIPsBEAAAAAH8ARAAmAMAIf0BEAAAAAT-ARAAAAAE_wEQAAAAAYACEAAAAAGBAhAAAAABggIQAAAAAQ8NAACBAwAgKQAAlwMAICoAAJcDACD7AYAAAAAB_AGAAAAAAf8BgAAAAAGAAoAAAAABgQKAAAAAAYICgAAAAAGpAgEAAAABqgIBAAAAAasCAQAAAAGsAoAAAAABrQKAAAAAAa4CgAAAAAEM-wGAAAAAAfwBgAAAAAH_AYAAAAABgAKAAAAAAYECgAAAAAGCAoAAAAABqQIBAAAAAaoCAQAAAAGrAgEAAAABrAKAAAAAAa0CgAAAAAGuAoAAAAABDQ0AAPACACApAACZAwAgKgAAmQMAIGsAAJkDACBsAACZAwAg-wEQAAAAAfwBEACYAwAh_QEQAAAABP4BEAAAAAT_ARAAAAABgAIQAAAAAYECEAAAAAGCAhAAAAABCPsBEAAAAAH8ARAAmQMAIf0BEAAAAAT-ARAAAAAE_wEQAAAAAYACEAAAAAGBAhAAAAABggIQAAAAAQ8JAACeAwAg7wEAAJoDADDwAQAAIAAQ8QEAAJoDADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACGNAgAAnQORAiKgAgEAhwMAIaMCEACbAwAhpAIBAIcDACGlAgEAiAMAIaYCAQCIAwAhpwIBAIgDACGoAgAAnAMAIAj7ARAAAAAB_AEQAJkDACH9ARAAAAAE_gEQAAAABP8BEAAAAAGAAhAAAAABgQIQAAAAAYICEAAAAAEM-wGAAAAAAfwBgAAAAAH_AYAAAAABgAKAAAAAAYECgAAAAAGCAoAAAAABqQIBAAAAAaoCAQAAAAGrAgEAAAABrAKAAAAAAa0CgAAAAAGuAoAAAAABBPsBAAAAkQIC_AEAAP0CkQIi_QEAAACRAgj-AQAAAJECCBoGAAC8AwAgBwAAjAMAIAoAAMIDACAOAADGAwAgDwAAxwMAIBAAAMgDACARAADJAwAg7wEAAMQDADDwAQAAEQAQ8QEAAMQDADDyAQEAhwMAIfgBAQCIAwAh-QFAAJIDACH6AUAAkgMAIYYCAQCHAwAhhwIBAIcDACGIAgEAiAMAIYkCAQCHAwAhigIBAIcDACGLAgEAhwMAIY0CAADFA40CIo4CIACJAwAhjwIBAIgDACGRAgAAnQORAiLXAgAAEQAg2AIAABEAIA_vAQAAnwMAMPABAADYAQAQ8QEAAJ8DADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACGTAgEA6wIAIZUCIADuAgAhngIBAOsCACGvAgEA6wIAIbACAQDrAgAhsQIBAPkCACGyAgIA7QIAIbMCAQD5AgAhtAJAAOwCACEQFAAAoQMAIO8BAACgAwAw8AEAAC0AEPEBAACgAwAw8gEBAIcDACH5AUAAkgMAIfoBQACSAwAhkwIBAIcDACGVAiAAiQMAIZ4CAQCHAwAhrwIBAIcDACGwAgEAhwMAIbECAQCIAwAhsgICAIoDACGzAgEAiAMAIbQCQACSAwAhA5oCAAApACCbAgAAKQAgnAIAACkAIArvAQAAogMAMPABAADAAQAQ8QEAAKIDADDyAQEA6wIAIfkBQADsAgAhjQIAAKMDuAIikgIBAOsCACG1AgEA-QIAIbYCAQDrAgAhuAIBAPkCACEHDQAA8AIAICkAAKUDACAqAAClAwAg-wEAAAC4AgL8AQAApAO4AiL9AQAAALgCCP4BAAAAuAIIBw0AAPACACApAAClAwAgKgAApQMAIPsBAAAAuAIC_AEAAKQDuAIi_QEAAAC4Agj-AQAAALgCCAT7AQAAALgCAvwBAAClA7gCIv0BAAAAuAII_gEAAAC4AggJ7wEAAKYDADDwAQAAqAEAEPEBAACmAwAw8gEBAOsCACGgAgEA6wIAIbkCEACVAwAhugIQAJUDACG7AhAAlQMAIbwCEACVAwAhCgkAAJ4DACDvAQAApwMAMPABAAAeABDxAQAApwMAMPIBAQCHAwAhoAIBAIcDACG5AhAAmwMAIboCEACbAwAhuwIQAJsDACG8AhAAmwMAIQnvAQAAqAMAMPABAACQAQAQ8QEAAKgDADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACG9AgEA6wIAIb4CAQDrAgAhvwJAAOwCACEJ7wEAAKkDADDwAQAAfQAQ8QEAAKkDADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACG9AgEAhwMAIb4CAQCHAwAhvwJAAJIDACEQ7wEAAKoDADDwAQAAdwAQ8QEAAKoDADDyAQEA6wIAIfgBAQDrAgAh-QFAAOwCACH6AUAA7AIAIZICAQDrAgAhwAIBAOsCACHBAgEA-QIAIcICAQD5AgAhwwIBAPkCACHEAkAAqwMAIcUCQACrAwAhxgIBAPkCACHHAgEA-QIAIQsNAACBAwAgKQAArQMAICoAAK0DACD7AUAAAAAB_AFAAKwDACH9AUAAAAAF_gFAAAAABf8BQAAAAAGAAkAAAAABgQJAAAAAAYICQAAAAAELDQAAgQMAICkAAK0DACAqAACtAwAg-wFAAAAAAfwBQACsAwAh_QFAAAAABf4BQAAAAAX_AUAAAAABgAJAAAAAAYECQAAAAAGCAkAAAAABCPsBQAAAAAH8AUAArQMAIf0BQAAAAAX-AUAAAAAF_wFAAAAAAYACQAAAAAGBAkAAAAABggJAAAAAAQvvAQAArgMAMPABAABhABDxAQAArgMAMPIBAQDrAgAh-QFAAOwCACH6AUAA7AIAIZICAQDrAgAhvwJAAOwCACHIAgEA6wIAIckCAQD5AgAhygIBAPkCACER7wEAAK8DADDwAQAASwAQ8QEAAK8DADDyAQEA6wIAIfkBQADsAgAh-gFAAOwCACGNAgAAsQPTAiKOAiAA7gIAIZ0CAQDrAgAhywIBAOsCACHMAiAA7gIAIc0CAQD5AgAhzgIBAPkCACHPAgEA6wIAIdECAACwA9ECItMCIADuAgAh1AJAAKsDACEHDQAA8AIAICkAALUDACAqAAC1AwAg-wEAAADRAgL8AQAAtAPRAiL9AQAAANECCP4BAAAA0QIIBw0AAPACACApAACzAwAgKgAAswMAIPsBAAAA0wIC_AEAALID0wIi_QEAAADTAgj-AQAAANMCCAcNAADwAgAgKQAAswMAICoAALMDACD7AQAAANMCAvwBAACyA9MCIv0BAAAA0wII_gEAAADTAggE-wEAAADTAgL8AQAAswPTAiL9AQAAANMCCP4BAAAA0wIIBw0AAPACACApAAC1AwAgKgAAtQMAIPsBAAAA0QIC_AEAALQD0QIi_QEAAADRAgj-AQAAANECCAT7AQAAANECAvwBAAC1A9ECIv0BAAAA0QII_gEAAADRAggXBAAAugMAIAUAALsDACAIAACOAwAgCwAAvAMAIAwAAI8DACAWAAChAwAg7wEAALYDADDwAQAAOAAQ8QEAALYDADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACGNAgAAuAPTAiKOAiAAiQMAIZ0CAQCHAwAhywIBAIcDACHMAiAAiQMAIc0CAQCIAwAhzgIBAIgDACHPAgEAhwMAIdECAAC3A9ECItMCIACJAwAh1AJAALkDACEE-wEAAADRAgL8AQAAtQPRAiL9AQAAANECCP4BAAAA0QIIBPsBAAAA0wIC_AEAALMD0wIi_QEAAADTAgj-AQAAANMCCAj7AUAAAAAB_AFAAK0DACH9AUAAAAAF_gFAAAAABf8BQAAAAAGAAkAAAAABgQJAAAAAAYICQAAAAAEDmgIAAAMAIJsCAAADACCcAgAAAwAgA5oCAAAHACCbAgAABwAgnAIAAAcAIBIDAACMAwAgDAAAjwMAIBIAAI0DACATAACOAwAg7wEAAIYDADDwAQAACwAQ8QEAAIYDADDyAQEAhwMAIZICAQCHAwAhkwIBAIcDACGUAgEAiAMAIZUCIACJAwAhlgICAIoDACGXAgEAiAMAIZgCCACLAwAhmQICAIoDACHXAgAACwAg2AIAAAsAIAKSAgEAAAABtQIBAAAAAQwDAACMAwAgFQAAwAMAIO8BAAC-AwAw8AEAACkAEPEBAAC-AwAw8gEBAIcDACH5AUAAkgMAIY0CAAC_A7gCIpICAQCHAwAhtQIBAIgDACG2AgEAhwMAIbgCAQCIAwAhBPsBAAAAuAIC_AEAAKUDuAIi_QEAAAC4Agj-AQAAALgCCBIUAAChAwAg7wEAAKADADDwAQAALQAQ8QEAAKADADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACGTAgEAhwMAIZUCIACJAwAhngIBAIcDACGvAgEAhwMAIbACAQCHAwAhsQIBAIgDACGyAgIAigMAIbMCAQCIAwAhtAJAAJIDACHXAgAALQAg2AIAAC0AIA8HAACMAwAgCQAAngMAIAoAAMIDACALAADDAwAg7wEAAMEDADDwAQAAFwAQ8QEAAMEDADDyAQEAhwMAIfgBAQCHAwAh-QFAAJIDACGGAgEAhwMAIYcCAQCHAwAhoAIBAIcDACGhAgIAigMAIaICAQCHAwAhEAgAAI4DACAMAACPAwAg7wEAAJEDADDwAQAAjAIAEPEBAACRAwAw8gEBAIcDACH5AUAAkgMAIfoBQACSAwAhlQIgAIkDACGYAggAiwMAIZkCAgCKAwAhnQIBAIcDACGeAgEAhwMAIZ8CAQCIAwAh1wIAAIwCACDYAgAAjAIAIBIDAACMAwAgDAAAjwMAIBIAAI0DACATAACOAwAg7wEAAIYDADDwAQAACwAQ8QEAAIYDADDyAQEAhwMAIZICAQCHAwAhkwIBAIcDACGUAgEAiAMAIZUCIACJAwAhlgICAIoDACGXAgEAiAMAIZgCCACLAwAhmQICAIoDACHXAgAACwAg2AIAAAsAIBgGAAC8AwAgBwAAjAMAIAoAAMIDACAOAADGAwAgDwAAxwMAIBAAAMgDACARAADJAwAg7wEAAMQDADDwAQAAEQAQ8QEAAMQDADDyAQEAhwMAIfgBAQCIAwAh-QFAAJIDACH6AUAAkgMAIYYCAQCHAwAhhwIBAIcDACGIAgEAiAMAIYkCAQCHAwAhigIBAIcDACGLAgEAhwMAIY0CAADFA40CIo4CIACJAwAhjwIBAIgDACGRAgAAnQORAiIE-wEAAACNAgL8AQAA_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-BgAg3QIAAIkCACAHIwAA-QMAICQAAPwDACDZAgAA-gMAINoCAAD7AwAg2wIAAB4AINwCAAAeACDdAgAAkwEAIAcjAADzAwAgJAAA9gMAINkCAAD0AwAg2gIAAPUDACDbAgAAIAAg3AIAACAAIN0CAADbAQAgByMAAOgDACAkAADrAwAg2QIAAOkDACDaAgAA6gMAINsCAAAXACDcAgAAFwAg3QIAABkAIAoHAADyAwAgCgAA8AMAIAsAAPEDACDyAQEAAAAB-AEBAAAAAfkBQAAAAAGGAgEAAAABhwIBAAAAAaECAgAAAAGiAgEAAAABAgAAABkAICMAAOgDACADAAAAFwAgIwAA6AMAICQAAOwDACAMAAAAFwAgBwAA7wMAIAoAAO0DACALAADuAwAgHAAA7AMAIPIBAQDUAwAh-AEBANQDACH5AUAA1QMAIYYCAQDUAwAhhwIBANQDACGhAgIA1gMAIaICAQDUAwAhCgcAAO8DACAKAADtAwAgCwAA7gMAIPIBAQDUAwAh-AEBANQDACH5AUAA1QMAIYYCAQDUAwAhhwIBANQDACGhAgIA1gMAIaICAQDUAwAhBSMAALMGACAkAAC8BgAg2QIAALQGACDaAgAAuwYAIN0CAACJAgAgBSMAALEGACAkAAC5BgAg2QIAALIGACDaAgAAuAYAIN0CAACiAgAgBSMAAK8GACAkAAC2BgAg2QIAALAGACDaAgAAtQYAIN0CAAABACADIwAAswYAINkCAAC0BgAg3QIAAIkCACADIwAAsQYAINkCAACyBgAg3QIAAKICACADIwAArwYAINkCAACwBgAg3QIAAAEAIAryAQEAAAAB-QFAAAAAAfoBQAAAAAGNAgAAAJECAqMCEAAAAAGkAgEAAAABpQIBAAAAAaYCAQAAAAGnAgEAAAABqAKAAAAAAQIAAADbAQAgIwAA8wMAIAMAAAAgACAjAADzAwAgJAAA9wMAIAwAAAAgACAcAAD3AwAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAOEDkQIiowIQAPgDACGkAgEA1AMAIaUCAQDgAwAhpgIBAOADACGnAgEA4AMAIagCgAAAAAEK8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAOEDkQIiowIQAPgDACGkAgEA1AMAIaUCAQDgAwAhpgIBAOADACGnAgEA4AMAIagCgAAAAAEF3wIQAAAAAeICEAAAAAHjAhAAAAAB5AIQAAAAAeUCEAAAAAEF8gEBAAAAAbkCEAAAAAG6AhAAAAABuwIQAAAAAbwCEAAAAAECAAAAkwEAICMAAPkDACADAAAAHgAgIwAA-QMAICQAAP0DACAHAAAAHgAgHAAA_QMAIPIBAQDUAwAhuQIQAPgDACG6AhAA-AMAIbsCEAD4AwAhvAIQAPgDACEF8gEBANQDACG5AhAA-AMAIboCEAD4AwAhuwIQAPgDACG8AhAA-AMAIQMjAACtBgAg2QIAAK4GACDdAgAAAQAgAyMAAKsGACDZAgAArAYAIN0CAACiAgAgAyMAAKkGACDZAgAAqgYAIN0CAACJAgAgAyMAAPkDACDZAgAA-gMAIN0CAACTAQAgAyMAAPMDACDZAgAA9AMAIN0CAADbAQAgAyMAAOgDACDZAgAA6QMAIN0CAAAZACADIwAApwYAINkCAACoBgAg3QIAAKICACADIwAA2gMAINkCAADbAwAg3QIAABUAIAAAAAAHIwAAogYAICQAAKUGACDZAgAAowYAINoCAACkBgAg2wIAAA0AINwCAAANACDdAgAADwAgAyMAAKIGACDZAgAAowYAIN0CAAAPACAAAAAAAAXfAggAAAAB4gIIAAAAAeMCCAAAAAHkAggAAAAB5QIIAAAAAQUjAACVBgAgJAAAoAYAINkCAACWBgAg2gIAAJ8GACDdAgAAAQAgCyMAALAEADAkAAC1BAAw2QIAALEEADDaAgAAsgQAMNsCAAC0BAAw3AIAALQEADDdAgAAtAQAMN4CAACzBAAg3wIAALQEADDgAgAAtgQAMOECAAC3BAAwCyMAAKQEADAkAACpBAAw2QIAAKUEADDaAgAApgQAMNsCAACoBAAw3AIAAKgEADDdAgAAqAQAMN4CAACnBAAg3wIAAKgEADDgAgAAqgQAMOECAACrBAAwCyMAAJYEADAkAACbBAAw2QIAAJcEADDaAgAAmAQAMNsCAACaBAAw3AIAAJoEADDdAgAAmgQAMN4CAACZBAAg3wIAAJoEADDgAgAAnAQAMOECAACdBAAwCgcAAPIDACAJAACjBAAgCgAA8AMAIPIBAQAAAAH5AUAAAAABhgIBAAAAAYcCAQAAAAGgAgEAAAABoQICAAAAAaICAQAAAAECAAAAGQAgIwAAogQAIAMAAAAZACAjAACiBAAgJAAAoAQAIAEcAACeBgAwDwcAAIwDACAJAACeAwAgCgAAwgMAIAsAAMMDACDvAQAAwQMAMPABAAAXABDxAQAAwQMAMPIBAQAAAAH4AQEAhwMAIfkBQACSAwAhhgIBAIcDACGHAgEAhwMAIaACAQAAAAGhAgIAigMAIaICAQCHAwAhAgAAABkAIBwAAKAEACACAAAAngQAIBwAAJ8EACAL7wEAAJ0EADDwAQAAngQAEPEBAACdBAAw8gEBAIcDACH4AQEAhwMAIfkBQACSAwAhhgIBAIcDACGHAgEAhwMAIaACAQCHAwAhoQICAIoDACGiAgEAhwMAIQvvAQAAnQQAMPABAACeBAAQ8QEAAJ0EADDyAQEAhwMAIfgBAQCHAwAh-QFAAJIDACGGAgEAhwMAIYcCAQCHAwAhoAIBAIcDACGhAgIAigMAIaICAQCHAwAhB_IBAQDUAwAh-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_AwAgBwAA_gMAIA4AAIsEACAPAACBBAAgEAAAggQAIBEAAIMEACDyAQEAAAAB-AEBAAAAAfkBQAAAAAH6AUAAAAABhgIBAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGNAgAAAI0CAo4CIAAAAAGPAgEAAAABkQIAAACRAgICAAAAFQAgIwAA3AQAIAMAAAAVACAjAADcBAAgJAAA2wQAIAEcAACTBgAwAgAAABUAIBwAANsEACACAAAArAQAIBwAANoEACAN8gEBANQDACH4AQEA4AMAIfkBQADVAwAh-gFAANUDACGGAgEA1AMAIYgCAQDgAwAhiQIBANQDACGKAgEA1AMAIYsCAQDUAwAhjQIAAN8DjQIijgIgANcDACGPAgEA4AMAIZECAADhA5ECIhMGAADjAwAgBwAA4gMAIA4AAIoEACAPAADlAwAgEAAA5gMAIBEAAOcDACDyAQEA1AMAIfgBAQDgAwAh-QFAANUDACH6AUAA1QMAIYYCAQDUAwAhiAIBAOADACGJAgEA1AMAIYoCAQDUAwAhiwIBANQDACGNAgAA3wONAiKOAiAA1wMAIY8CAQDgAwAhkQIAAOEDkQIiEwYAAP8DACAHAAD-AwAgDgAAiwQAIA8AAIEEACAQAACCBAAgEQAAgwQAIPIBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAGGAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAY0CAAAAjQICjgIgAAAAAY8CAQAAAAGRAgAAAJECAgQjAADUBAAw2QIAANUEADDdAgAAqAQAMN4CAADXBAAgBCMAAMsEADDZAgAAzAQAMN0CAACaBAAw3gIAAM4EACAAAAAAAAAAAAAABSMAAI4GACAkAACRBgAg2QIAAI8GACDaAgAAkAYAIN0CAAAVACADIwAAjgYAINkCAACPBgAg3QIAABUAIAoGAADoBQAgBwAAwAQAIAoAAOoFACAOAADrBQAgDwAA7AUAIBAAAO0FACARAADuBQAg-AEAAIYEACCIAgAAhgQAII8CAACGBAAgAAAAAAALIwAA8gQAMCQAAPcEADDZAgAA8wQAMNoCAAD0BAAw2wIAAPYEADDcAgAA9gQAMN0CAAD2BAAw3gIAAPUEACDfAgAA9gQAMOACAAD4BAAw4QIAAPkEADAHAwAAgAUAIPIBAQAAAAH5AUAAAAABjQIAAAC4AgKSAgEAAAABtgIBAAAAAbgCAQAAAAECAAAAKwAgIwAA_wQAIAMAAAArACAjAAD_BAAgJAAA_QQAIAEcAACNBgAwDQMAAIwDACAVAADAAwAg7wEAAL4DADDwAQAAKQAQ8QEAAL4DADDyAQEAAAAB-QFAAJIDACGNAgAAvwO4AiKSAgEAhwMAIbUCAQCIAwAhtgIBAIcDACG4AgEAiAMAIdUCAAC9AwAgAgAAACsAIBwAAP0EACACAAAA-gQAIBwAAPsEACAK7wEAAPkEADDwAQAA-gQAEPEBAAD5BAAw8gEBAIcDACH5AUAAkgMAIY0CAAC_A7gCIpICAQCHAwAhtQIBAIgDACG2AgEAhwMAIbgCAQCIAwAhCu8BAAD5BAAw8AEAAPoEABDxAQAA-QQAMPIBAQCHAwAh-QFAAJIDACGNAgAAvwO4AiKSAgEAhwMAIbUCAQCIAwAhtgIBAIcDACG4AgEAiAMAIQbyAQEA1AMAIfkBQADVAwAhjQIAAPwEuAIikgIBANQDACG2AgEA1AMAIbgCAQDgAwAhAd8CAAAAuAICBwMAAP4EACDyAQEA1AMAIfkBQADVAwAhjQIAAPwEuAIikgIBANQDACG2AgEA1AMAIbgCAQDgAwAhBSMAAIgGACAkAACLBgAg2QIAAIkGACDaAgAAigYAIN0CAAABACAHAwAAgAUAIPIBAQAAAAH5AUAAAAABjQIAAAC4AgKSAgEAAAABtgIBAAAAAbgCAQAAAAEDIwAAiAYAINkCAACJBgAg3QIAAAEAIAQjAADyBAAw2QIAAPMEADDdAgAA9gQAMN4CAAD1BAAgAAAAAAcjAACDBgAgJAAAhgYAINkCAACEBgAg2gIAAIUGACDbAgAALQAg3AIAAC0AIN0CAADDAQAgAyMAAIMGACDZAgAAhAYAIN0CAADDAQAgAAAAAAAFIwAA_gUAICQAAIEGACDZAgAA_wUAINoCAACABgAg3QIAABUAIAMjAAD-BQAg2QIAAP8FACDdAgAAFQAgAAAAAAAAAd8CQAAAAAEFIwAA-QUAICQAAPwFACDZAgAA-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_wMAIAoAAIAEACAOAACLBAAgDwAAgQQAIBAAAIIEACARAACDBAAg8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIAAACNAgKOAiAAAAABjwIBAAAAAZECAAAAkQICCwwAAL8EACASAAC9BAAgEwAAvgQAIPIBAQAAAAGTAgEAAAABlAIBAAAAAZUCIAAAAAGWAgIAAAABlwIBAAAAAZgCCAAAAAGZAgIAAAABAgAAAKICACAjAADDBQAgAwAAAAsAICMAAMMFACAkAADHBQAgDQAAAAsAIAwAAJUEACASAACTBAAgEwAAlAQAIBwAAMcFACDyAQEA1AMAIZMCAQDUAwAhlAIBAOADACGVAiAA1wMAIZYCAgDWAwAhlwIBAOADACGYAggAkQQAIZkCAgDWAwAhCwwAAJUEACASAACTBAAgEwAAlAQAIPIBAQDUAwAhkwIBANQDACGUAgEA4AMAIZUCIADXAwAhlgICANYDACGXAgEA4AMAIZgCCACRBAAhmQICANYDACEM8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAcACAQAAAAHBAgEAAAABwgIBAAAAAcMCAQAAAAHEAkAAAAABxQJAAAAAAcYCAQAAAAHHAgEAAAABAgAAAAkAICMAANMFACADAAAACQAgIwAA0wUAICQAANIFACABHAAA8AUAMBEDAACMAwAg7wEAAM0DADDwAQAABwAQ8QEAAM0DADDyAQEAAAAB-AEBAIcDACH5AUAAkgMAIfoBQACSAwAhkgIBAIcDACHAAgEAhwMAIcECAQCIAwAhwgIBAIgDACHDAgEAiAMAIcQCQAC5AwAhxQJAALkDACHGAgEAiAMAIccCAQCIAwAhAgAAAAkAIBwAANIFACACAAAA0AUAIBwAANEFACAQ7wEAAM8FADDwAQAA0AUAEPEBAADPBQAw8gEBAIcDACH4AQEAhwMAIfkBQACSAwAh-gFAAJIDACGSAgEAhwMAIcACAQCHAwAhwQIBAIgDACHCAgEAiAMAIcMCAQCIAwAhxAJAALkDACHFAkAAuQMAIcYCAQCIAwAhxwIBAIgDACEQ7wEAAM8FADDwAQAA0AUAEPEBAADPBQAw8gEBAIcDACH4AQEAhwMAIfkBQACSAwAh-gFAAJIDACGSAgEAhwMAIcACAQCHAwAhwQIBAIgDACHCAgEAiAMAIcMCAQCIAwAhxAJAALkDACHFAkAAuQMAIcYCAQCIAwAhxwIBAIgDACEM8gEBANQDACH4AQEA1AMAIfkBQADVAwAh-gFAANUDACHAAgEA1AMAIcECAQDgAwAhwgIBAOADACHDAgEA4AMAIcQCQACVBQAhxQJAAJUFACHGAgEA4AMAIccCAQDgAwAhDPIBAQDUAwAh-AEBANQDACH5AUAA1QMAIfoBQADVAwAhwAIBANQDACHBAgEA4AMAIcICAQDgAwAhwwIBAOADACHEAkAAlQUAIcUCQACVBQAhxgIBAOADACHHAgEA4AMAIQzyAQEAAAAB-AEBAAAAAfkBQAAAAAH6AUAAAAABwAIBAAAAAcECAQAAAAHCAgEAAAABwwIBAAAAAcQCQAAAAAHFAkAAAAABxgIBAAAAAccCAQAAAAEH8gEBAAAAAfkBQAAAAAH6AUAAAAABvwJAAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAQIAAAAFACAjAADfBQAgAwAAAAUAICMAAN8FACAkAADeBQAgARwAAO8FADAMAwAAjAMAIO8BAADOAwAw8AEAAAMAEPEBAADOAwAw8gEBAAAAAfkBQACSAwAh-gFAAJIDACGSAgEAhwMAIb8CQACSAwAhyAIBAAAAAckCAQCIAwAhygIBAIgDACECAAAABQAgHAAA3gUAIAIAAADcBQAgHAAA3QUAIAvvAQAA2wUAMPABAADcBQAQ8QEAANsFADDyAQEAhwMAIfkBQACSAwAh-gFAAJIDACGSAgEAhwMAIb8CQACSAwAhyAIBAIcDACHJAgEAiAMAIcoCAQCIAwAhC-8BAADbBQAw8AEAANwFABDxAQAA2wUAMPIBAQCHAwAh-QFAAJIDACH6AUAAkgMAIZICAQCHAwAhvwJAAJIDACHIAgEAhwMAIckCAQCIAwAhygIBAIgDACEH8gEBANQDACH5AUAA1QMAIfoBQADVAwAhvwJAANUDACHIAgEA1AMAIckCAQDgAwAhygIBAOADACEH8gEBANQDACH5AUAA1QMAIfoBQADVAwAhvwJAANUDACHIAgEA1AMAIckCAQDgAwAhygIBAOADACEH8gEBAAAAAfkBQAAAAAH6AUAAAAABvwJAAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAQQjAADUBQAw2QIAANUFADDdAgAA2AUAMN4CAADXBQAgBCMAAMgFADDZAgAAyQUAMN0CAADMBQAw3gIAAMsFACADIwAAwwUAINkCAADEBQAg3QIAAKICACAEIwAAugUAMNkCAAC7BQAw3QIAAKgEADDeAgAAvQUAIAQjAACxBQAw2QIAALIFADDdAgAA9gQAMN4CAAC0BQAgBCMAAKgFADDZAgAAqQUAMN0CAACaBAAw3gIAAKsFACAAAAYDAADABAAgDAAAwwQAIBIAAMEEACATAADCBAAglAIAAIYEACCXAgAAhgQAIAMUAACCBQAgsQIAAIYEACCzAgAAhgQAIAMIAADCBAAgDAAAwwQAIJ8CAACGBAAgAgYAAOgFACAJAADrBAAgAQkAAOsEACAFCQAA6wQAIKUCAACGBAAgpgIAAIYEACCnAgAAhgQAIKgCAACGBAAgBAcAAMAEACAJAADrBAAgCgAA6gUAIAsAAOgFACAH8gEBAAAAAfkBQAAAAAH6AUAAAAABvwJAAAAAAcgCAQAAAAHJAgEAAAABygIBAAAAAQzyAQEAAAAB-AEBAAAAAfkBQAAAAAH6AUAAAAABwAIBAAAAAcECAQAAAAHCAgEAAAABwwIBAAAAAcQCQAAAAAHFAkAAAAABxgIBAAAAAccCAQAAAAEN8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIAAACNAgKOAiAAAAABjwIBAAAAAZECAAAAkQICBvIBAQAAAAH5AUAAAAABjQIAAAC4AgK1AgEAAAABtgIBAAAAAbgCAQAAAAEH8gEBAAAAAfgBAQAAAAH5AUAAAAABhwIBAAAAAaACAQAAAAGhAgIAAAABogIBAAAAARMFAADhBQAgCAAA4wUAIAsAAOIFACAMAADlBQAgFgAA5AUAIPIBAQAAAAH5AUAAAAAB-gFAAAAAAY0CAAAA0wICjgIgAAAAAZ0CAQAAAAHLAgEAAAABzAIgAAAAAc0CAQAAAAHOAgEAAAABzwIBAAAAAdECAAAA0QIC0wIgAAAAAdQCQAAAAAECAAAAAQAgIwAA9AUAIAMAAAA4ACAjAAD0BQAgJAAA-AUAIBUAAAA4ACAFAACjBQAgCAAApQUAIAsAAKQFACAMAACnBQAgFgAApgUAIBwAAPgFACDyAQEA1AMAIfkBQADVAwAh-gFAANUDACGNAgAAoQXTAiKOAiAA1wMAIZ0CAQDUAwAhywIBANQDACHMAiAA1wMAIc0CAQDgAwAhzgIBAOADACHPAgEA1AMAIdECAACgBdECItMCIADXAwAh1AJAAJUFACETBQAAowUAIAgAAKUFACALAACkBQAgDAAApwUAIBYAAKYFACDyAQEA1AMAIfkBQADVAwAh-gFAANUDACGNAgAAoQXTAiKOAiAA1wMAIZ0CAQDUAwAhywIBANQDACHMAiAA1wMAIc0CAQDgAwAhzgIBAOADACHPAgEA1AMAIdECAACgBdECItMCIADXAwAh1AJAAJUFACETBAAA4AUAIAgAAOMFACALAADiBQAgDAAA5QUAIBYAAOQFACDyAQEAAAAB-QFAAAAAAfoBQAAAAAGNAgAAANMCAo4CIAAAAAGdAgEAAAABywIBAAAAAcwCIAAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHRAgAAANECAtMCIAAAAAHUAkAAAAABAgAAAAEAICMAAPkFACADAAAAOAAgIwAA-QUAICQAAP0FACAVAAAAOAAgBAAAogUAIAgAAKUFACALAACkBQAgDAAApwUAIBYAAKYFACAcAAD9BQAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAKEF0wIijgIgANcDACGdAgEA1AMAIcsCAQDUAwAhzAIgANcDACHNAgEA4AMAIc4CAQDgAwAhzwIBANQDACHRAgAAoAXRAiLTAiAA1wMAIdQCQACVBQAhEwQAAKIFACAIAAClBQAgCwAApAUAIAwAAKcFACAWAACmBQAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAKEF0wIijgIgANcDACGdAgEA1AMAIcsCAQDUAwAhzAIgANcDACHNAgEA4AMAIc4CAQDgAwAhzwIBANQDACHRAgAAoAXRAiLTAiAA1wMAIdQCQACVBQAhFAYAAP8DACAHAAD-AwAgCgAAgAQAIA4AAIsEACAQAACCBAAgEQAAgwQAIPIBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAGGAgEAAAABhwIBAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGNAgAAAI0CAo4CIAAAAAGPAgEAAAABkQIAAACRAgICAAAAFQAgIwAA_gUAIAMAAAARACAjAAD-BQAgJAAAggYAIBYAAAARACAGAADjAwAgBwAA4gMAIAoAAOQDACAOAACKBAAgEAAA5gMAIBEAAOcDACAcAACCBgAg8gEBANQDACH4AQEA4AMAIfkBQADVAwAh-gFAANUDACGGAgEA1AMAIYcCAQDUAwAhiAIBAOADACGJAgEA1AMAIYoCAQDUAwAhiwIBANQDACGNAgAA3wONAiKOAiAA1wMAIY8CAQDgAwAhkQIAAOEDkQIiFAYAAOMDACAHAADiAwAgCgAA5AMAIA4AAIoEACAQAADmAwAgEQAA5wMAIPIBAQDUAwAh-AEBAOADACH5AUAA1QMAIfoBQADVAwAhhgIBANQDACGHAgEA1AMAIYgCAQDgAwAhiQIBANQDACGKAgEA1AMAIYsCAQDUAwAhjQIAAN8DjQIijgIgANcDACGPAgEA4AMAIZECAADhA5ECIgzyAQEAAAAB-QFAAAAAAfoBQAAAAAGTAgEAAAABlQIgAAAAAZ4CAQAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgIAAAABswIBAAAAAbQCQAAAAAECAAAAwwEAICMAAIMGACADAAAALQAgIwAAgwYAICQAAIcGACAOAAAALQAgHAAAhwYAIPIBAQDUAwAh-QFAANUDACH6AUAA1QMAIZMCAQDUAwAhlQIgANcDACGeAgEA1AMAIa8CAQDUAwAhsAIBANQDACGxAgEA4AMAIbICAgDWAwAhswIBAOADACG0AkAA1QMAIQzyAQEA1AMAIfkBQADVAwAh-gFAANUDACGTAgEA1AMAIZUCIADXAwAhngIBANQDACGvAgEA1AMAIbACAQDUAwAhsQIBAOADACGyAgIA1gMAIbMCAQDgAwAhtAJAANUDACETBAAA4AUAIAUAAOEFACAIAADjBQAgCwAA4gUAIAwAAOUFACDyAQEAAAAB-QFAAAAAAfoBQAAAAAGNAgAAANMCAo4CIAAAAAGdAgEAAAABywIBAAAAAcwCIAAAAAHNAgEAAAABzgIBAAAAAc8CAQAAAAHRAgAAANECAtMCIAAAAAHUAkAAAAABAgAAAAEAICMAAIgGACADAAAAOAAgIwAAiAYAICQAAIwGACAVAAAAOAAgBAAAogUAIAUAAKMFACAIAAClBQAgCwAApAUAIAwAAKcFACAcAACMBgAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAKEF0wIijgIgANcDACGdAgEA1AMAIcsCAQDUAwAhzAIgANcDACHNAgEA4AMAIc4CAQDgAwAhzwIBANQDACHRAgAAoAXRAiLTAiAA1wMAIdQCQACVBQAhEwQAAKIFACAFAACjBQAgCAAApQUAIAsAAKQFACAMAACnBQAg8gEBANQDACH5AUAA1QMAIfoBQADVAwAhjQIAAKEF0wIijgIgANcDACGdAgEA1AMAIcsCAQDUAwAhzAIgANcDACHNAgEA4AMAIc4CAQDgAwAhzwIBANQDACHRAgAAoAXRAiLTAiAA1wMAIdQCQACVBQAhBvIBAQAAAAH5AUAAAAABjQIAAAC4AgKSAgEAAAABtgIBAAAAAbgCAQAAAAEUBgAA_wMAIAcAAP4DACAKAACABAAgDgAAiwQAIA8AAIEEACARAACDBAAg8gEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAY0CAAAAjQICjgIgAAAAAY8CAQAAAAGRAgAAAJECAgIAAAAVACAjAACOBgAgAwAAABEAICMAAI4GACAkAACSBgAgFgAAABEAIAYAAOMDACAHAADiAwAgCgAA5AMAIA4AAIoEACAPAADlAwAgEQAA5wMAIBwAAJIGACDyAQEA1AMAIfgBAQDgAwAh-QFAANUDACH6AUAA1QMAIYYCAQDUAwAhhwIBANQDACGIAgEA4AMAIYkCAQDUAwAhigIBANQDACGLAgEA1AMAIY0CAADfA40CIo4CIADXAwAhjwIBAOADACGRAgAA4QORAiIUBgAA4wMAIAcAAOIDACAKAADkAwAgDgAAigQAIA8AAOUDACARAADnAwAg8gEBANQDACH4AQEA4AMAIfkBQADVAwAh-gFAANUDACGGAgEA1AMAIYcCAQDUAwAhiAIBAOADACGJAgEA1AMAIYoCAQDUAwAhiwIBANQDACGNAgAA3wONAiKOAiAA1wMAIY8CAQDgAwAhkQIAAOEDkQIiDfIBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAGGAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAY0CAAAAjQICjgIgAAAAAY8CAQAAAAGRAgAAAJECAgfyAQEAAAAB-AEBAAAAAfkBQAAAAAGGAgEAAAABoAIBAAAAAaECAgAAAAGiAgEAAAABEwQAAOAFACAFAADhBQAgCAAA4wUAIAwAAOUFACAWAADkBQAg8gEBAAAAAfkBQAAAAAH6AUAAAAABjQIAAADTAgKOAiAAAAABnQIBAAAAAcsCAQAAAAHMAiAAAAABzQIBAAAAAc4CAQAAAAHPAgEAAAAB0QIAAADRAgLTAiAAAAAB1AJAAAAAAQIAAAABACAjAACVBgAgCPIBAQAAAAHzAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQIAAAAB9wEgAAAAAfkBQAAAAAH6AUAAAAABDfIBAQAAAAH5AUAAAAAB-gFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAY0CAAAAjQICjgIgAAAAAY8CAQAAAAGRAgAAAJECAhQGAAD_AwAgBwAA_gMAIAoAAIAEACAOAACLBAAgDwAAgQQAIBAAAIIEACDyAQEAAAAB-AEBAAAAAfkBQAAAAAH6AUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIAAACNAgKOAiAAAAABjwIBAAAAAZECAAAAkQICAgAAABUAICMAAJkGACADAAAAEQAgIwAAmQYAICQAAJ0GACAWAAAAEQAgBgAA4wMAIAcAAOIDACAKAADkAwAgDgAAigQAIA8AAOUDACAQAADmAwAgHAAAnQYAIPIBAQDUAwAh-AEBAOADACH5AUAA1QMAIfoBQADVAwAhhgIBANQDACGHAgEA1AMAIYgCAQDgAwAhiQIBANQDACGKAgEA1AMAIYsCAQDUAwAhjQIAAN8DjQIijgIgANcDACGPAgEA4AMAIZECAADhA5ECIhQGAADjAwAgBwAA4gMAIAoAAOQDACAOAACKBAAgDwAA5QMAIBAAAOYDACDyAQEA1AMAIfgBAQDgAwAh-QFAANUDACH6AUAA1QMAIYYCAQDUAwAhhwIBANQDACGIAgEA4AMAIYkCAQDUAwAhigIBANQDACGLAgEA1AMAIY0CAADfA40CIo4CIADXAwAhjwIBAOADACGRAgAA4QORAiIH8gEBAAAAAfkBQAAAAAGGAgEAAAABhwIBAAAAAaACAQAAAAGhAgIAAAABogIBAAAAAQMAAAA4ACAjAACVBgAgJAAAoQYAIBUAAAA4ACAEAACiBQAgBQAAowUAIAgAAKUFACAMAACnBQAgFgAApgUAIBwAAKEGACDyAQEA1AMAIfkBQADVAwAh-gFAANUDACGNAgAAoQXTAiKOAiAA1wMAIZ0CAQDUAwAhywIBANQDACHMAiAA1wMAIc0CAQDgAwAhzgIBAOADACHPAgEA1AMAIdECAACgBdECItMCIADXAwAh1AJAAJUFACETBAAAogUAIAUAAKMFACAIAAClBQAgDAAApwUAIBYAAKYFACDyAQEA1AMAIfkBQADVAwAh-gFAANUDACGNAgAAoQXTAiKOAiAA1wMAIZ0CAQDUAwAhywIBANQDACHMAiAA1wMAIc0CAQDgAwAhzgIBAOADACHPAgEA1AMAIdECAACgBdECItMCIADXAwAh1AJAAJUFACEKBgAAhAQAIPIBAQAAAAHzAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQIAAAAB9wEgAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAQIAAAAPACAjAACiBgAgAwAAAA0AICMAAKIGACAkAACmBgAgDAAAAA0AIAYAANgDACAcAACmBgAg8gEBANQDACHzAUAA1QMAIfQBAQDUAwAh9QEBANQDACH2AQIA1gMAIfcBIADXAwAh-AEBANQDACH5AUAA1QMAIfoBQADVAwAhCgYAANgDACDyAQEA1AMAIfMBQADVAwAh9AEBANQDACH1AQEA1AMAIfYBAgDWAwAh9wEgANcDACH4AQEA1AMAIfkBQADVAwAh-gFAANUDACEMAwAAvAQAIAwAAL8EACATAAC-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_J1CAASdRgQEnUoMBJ1OFARFUhgEoVYgBJ1aKARFXiwEpWIwBJ1mNASdajgERW5EBKlySAS5dlAEKXpUBCl-XAQpgmAEKYZkBCmKbAQpjnQERZJ4BL2WgAQpmogERZ6MBMGikAQpppQEKaqYBEW2pATFuqgE3b6sBDXCsAQ1xrQENcq4BDXOvAQ10sQENdbMBEXa0ATh3twENeLkBEXm6ATl6vAENe70BDXy-ARF9wQE6fsIBPn_EAQ6AAcUBDoEBxwEOggHIAQ6DAckBDoQBywEOhQHNARGGAc4BP4cB0AEOiAHSARGJAdMBQIoB1AEOiwHVAQ6MAdYBEY0B2QFBjgHaAUePAdwBC5AB3QELkQHfAQuSAeABC5MB4QELlAHjAQuVAeUBEZYB5gFIlwHoAQuYAeoBEZkB6wFJmgHsAQubAe0BC5wB7gERnQHxAUqeAfIBUJ8B8wEIoAH0AQihAfUBCKIB9gEIowH3AQikAfkBCKUB-wERpgH8AVGnAf4BCKgBgAIRqQGBAlKqAYICCKsBgwIIrAGEAhGtAYcCU64BiAJZrwGKAgewAYsCB7EBjgIHsgGPAgezAZACB7QBkgIHtQGUAhG2AZUCWrcBlwIHuAGZAhG5AZoCW7oBmwIHuwGcAge8AZ0CEb0BoAJcvgGhAmK_AaMCBMABpAIEwQGmAgTCAacCBMMBqAIExAGqAgTFAawCEcYBrQJjxwGvAgTIAbECEckBsgJkygGzAgTLAbQCBMwBtQIRzQG4AmXOAbkCa88BugIG0AG7AgbRAbwCBtIBvQIG0wG-AgbUAcACBtUBwgIR1gHDAmzXAccCBtgByQIR2QHKAm3aAc0CBtsBzgIG3AHPAhHdAdICbt4B0wJy3wHUAgXgAdUCBeEB1gIF4gHXAgXjAdgCBeQB2gIF5QHcAhHmAd0Cc-cB3wIF6AHhAhHpAeICdOoB4wIF6wHkAgXsAeUCEe0B6AJ17gHpAns"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CostBreakdownScalarFieldEnum: () => CostBreakdownScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JobApplicationScalarFieldEnum: () => JobApplicationScalarFieldEnum,
  JobPostScalarFieldEnum: () => JobPostScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  ServiceProviderScalarFieldEnum: () => ServiceProviderScalarFieldEnum,
  ServiceRequestScalarFieldEnum: () => ServiceRequestScalarFieldEnum,
  ServiceScalarFieldEnum: () => ServiceScalarFieldEnum,
  ServiceScheduleScalarFieldEnum: () => ServiceScheduleScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  CostBreakdown: "CostBreakdown",
  JobApplication: "JobApplication",
  JobPost: "JobPost",
  Payment: "Payment",
  Review: "Review",
  Service: "Service",
  ServiceProvider: "ServiceProvider",
  ServiceRequest: "ServiceRequest",
  ServiceSchedule: "ServiceSchedule"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  address: "address",
  phone: "phone",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CostBreakdownScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  serviceCharge: "serviceCharge",
  productCost: "productCost",
  additionalCost: "additionalCost",
  totalAmount: "totalAmount"
};
var JobApplicationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  jobPostId: "jobPostId",
  cvUrl: "cvUrl",
  status: "status",
  feedback: "feedback",
  createdAt: "createdAt"
};
var JobPostScalarFieldEnum = {
  id: "id",
  title: "title",
  description: "description",
  requirements: "requirements",
  location: "location",
  serviceType: "serviceType",
  vacancy: "vacancy",
  salaryRange: "salaryRange",
  deadline: "deadline",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  stripeCustomerId: "stripeCustomerId",
  invoiceUrl: "invoiceUrl",
  paymentGatewayData: "paymentGatewayData",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  requestId: "requestId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  requestId: "requestId",
  serviceId: "serviceId",
  providerId: "providerId",
  customerId: "customerId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var ServiceScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  imageUrl: "imageUrl",
  averageRating: "averageRating",
  totalReviews: "totalReviews",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ServiceProviderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  serviceType: "serviceType",
  bio: "bio",
  isActive: "isActive",
  experience: "experience",
  designation: "designation",
  averageRating: "averageRating",
  totalReviews: "totalReviews"
};
var ServiceRequestScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  serviceId: "serviceId",
  scheduleId: "scheduleId",
  serviceDescription: "serviceDescription",
  serviceAddress: "serviceAddress",
  activePhone: "activePhone",
  status: "status",
  isDeleted: "isDeleted",
  rejectionReason: "rejectionReason",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  paymentStatus: "paymentStatus"
};
var ServiceScheduleScalarFieldEnum = {
  id: "id",
  scheduleDate: "scheduleDate",
  startTime: "startTime",
  endTime: "endTime",
  slotNumber: "slotNumber",
  isBooked: "isBooked",
  providerId: "providerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  SERVICE_PROVIDER: "SERVICE_PROVIDER",
  CUSTOMER: "CUSTOMER",
  JOB_CANDIDATE: "JOB_CANDIDATE"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var ServiceRequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED"
};
var JobApplicationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  UNPAID: "UNPAID",
  FAILED: "FAILED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import { bearer, emailOTP, oAuthProxy } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email sending Err: ", error.message);
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: UserRole.CUSTOMER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
        input: true
      },
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  /*  session: {
    expiresIn: 60 * 60 * 60 * 24, 
    updateAge: 60 * 60 * 60 * 24, 
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24, 
    },
  }, */
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [
    envVars.BETTER_AUTH_URL || "http://localhost:5000",
    envVars.FRONTEND_URL
  ],
  advanced: {
    // disableCSRFCheck: true
    useSecureCookies: false,
    cookies: {
      session_token: {
        name: "session_token",
        // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true
        }
      },
      state: {
        name: "session_token",
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          // path: "/",
          partitioned: true
        }
      }
      /*   sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      }, */
    }
  },
  plugins: [
    oAuthProxy(),
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.error(`User not found and can't send verification OTP`);
            return;
          }
          if (user && user.role === UserRole.ADMIN) {
            console.log(
              `${email} is an admin. Skipping sending verification OTP.`
            );
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 3 * 60,
      // valid for 3 minutes
      otpLength: 6
    })
  ]
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, options) => {
  const token = jwt.sign(payload, secret, options);
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 7
    // 7 days
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
    // 1 day
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
var registerCustomer = async (payload) => {
  const { name, email, password, phone } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      phone
    }
  });
  if (!data || !data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Failed to register!");
  }
  try {
    const customer = await prisma.user.update({
      where: {
        id: data.user.id
      },
      data: {
        role: "CUSTOMER",
        status: "ACTIVE"
      }
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role || "CUSTOMER",
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      status: data.user.status || "ACTIVE",
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role || "CUSTOMER",
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone,
      status: data.user.status || "ACTIVE",
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    });
    return {
      ...data,
      accessToken,
      refreshToken,
      customer
    };
  } catch (error) {
    if (envVars.NODE_ENV === "development") {
      console.log("customerUpdate error : ", error);
    }
    await prisma.user.delete({
      where: {
        id: data.user.id
      }
    }).catch(() => {
    });
    throw error;
  }
};
var registerJobCandidate = async (payload) => {
  const { name, email, password, phone, cvUrl } = payload;
  const data = await auth.api.signUpEmail({
    body: { name, email, password, phone }
  });
  if (!data || !data.user) {
    throw new AppError_default(status2.BAD_REQUEST, "Failed to register!");
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: data.user.id },
        data: {
          role: UserRole.JOB_CANDIDATE,
          status: UserStatus.ACTIVE
        }
      });
      const application = await tx.jobApplication.create({
        data: {
          userId: updatedUser.id,
          cvUrl,
          status: JobApplicationStatus.PENDING,
          jobPostId: null
        }
      });
      return { updatedUser, application };
    });
    const tokenPayload = {
      userId: result.updatedUser.id,
      role: result.updatedUser.role,
      name: result.updatedUser.name,
      email: result.updatedUser.email,
      phone: result.updatedUser.phone,
      status: result.updatedUser.status
    };
    const accessToken = tokenUtils.getAccessToken(tokenPayload);
    const refreshToken = tokenUtils.getRefreshToken(tokenPayload);
    return {
      user: result.updatedUser,
      application: result.application,
      accessToken,
      refreshToken,
      token: data.token
    };
  } catch (error) {
    await prisma.user.delete({ where: { id: data.user.id } }).catch(() => {
    });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status2.FORBIDDEN, "Your account is blocked!");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "Your account is deleted!");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return { ...data, accessToken, refreshToken };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status2.NOT_FOUND, "User not found!");
  }
  return isUserExists;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token!");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid refresh token!");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.id,
    role: data.role,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var forgetPassword = async (email) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status2.NOT_FOUND, "User not found!");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status2.BAD_REQUEST, "Email not verified!");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "User not found!");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status2.NOT_FOUND, "User not found!");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status2.BAD_REQUEST, "Email not verified!");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status2.NOT_FOUND, "User not found!");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExists.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExists.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id
    }
  });
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status2.UNAUTHORIZED, "Invalid session token!");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    phone: session.user.phone,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    phone: session.user.phone,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return { ...result, accessToken, refreshToken };
};
var googleLoginSuccess = async (session) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isUserExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        phone: session.user.phone
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var AuthService = {
  registerCustomer,
  registerJobCandidate,
  // updateApplicationStatus,
  loginUser,
  logoutUser,
  getMe,
  verifyEmail,
  getNewToken,
  forgetPassword,
  resetPassword,
  changePassword,
  googleLoginSuccess
};

// src/app/module/auth/auth.controller.ts
import status3 from "http-status";
var registerCustomer2 = catchAsync(async (req, res) => {
  const result = await AuthService.registerCustomer(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "Customer registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var registerJobCandidate2 = catchAsync(async (req, res) => {
  const result = await AuthService.registerJobCandidate(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  if (token) {
    tokenUtils.setBetterAuthSessionCookie(res, token);
  }
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "Candidate application submitted successfully! Please wait for admin approval.",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status3.UNAUTHORIZED, "Refresh token is missing!");
  }
  const result = await AuthService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "New token generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password reset OTP send to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await AuthService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var googleLogin = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  registerCustomer: registerCustomer2,
  registerJobCandidate: registerJobCandidate2,
  loginUser: loginUser2,
  logoutUser: logoutUser2,
  getMe: getMe2,
  verifyEmail: verifyEmail2,
  getNewToken: getNewToken2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  changePassword: changePassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(
            status4.UNAUTHORIZED,
            "Unauthorized access! User is not active."
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status4.UNAUTHORIZED,
            "Unauthorized access! User is deleted."
          );
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(
            status4.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resource."
          );
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(
          status4.UNAUTHORIZED,
          "Unauthorized access! No access token provided."
        );
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status4.UNAUTHORIZED,
        "Unauthorized access! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status4.UNAUTHORIZED,
        "Unauthorized access! Invalid access token."
      );
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(
        status4.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resource."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/validateRequest.ts.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/module/auth/auth.validation.ts
import { z } from "zod";
var nameSchema = z.string("Name is required!").min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters");
var emailSchema = z.string("Email is required!").email("Invalid email address");
var passwordSchema = z.string("Password is required!").min(8, "Password must be at least 8 characters").max(12, "Password must not exceed 12 characters");
var phoneSchema = z.string("Phone number is required!").regex(/^\d{11,13}$/, "Phone must be 11-13 digits");
var registerCustomerZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema
});
var registerJobCandidateZodSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  cvUrl: z.string("CV url is required!").url("CV must be a valid URL").refine(
    (url) => {
      const cleanUrl = url.split("?")[0].toLowerCase();
      return cleanUrl.endsWith(".pdf");
    },
    {
      message: "CV must be a valid PDF file"
    }
  )
});
var loginZodSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});
var changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});
var AuthValidation = {
  registerCustomerZodSchema,
  registerJobCandidateZodSchema,
  loginZodSchema,
  changePasswordZodSchema
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(AuthValidation.registerCustomerZodSchema),
  AuthController.registerCustomer
);
router.post(
  "/register-candidate",
  validateRequest(AuthValidation.registerJobCandidateZodSchema),
  AuthController.registerJobCandidate
);
router.post("/verify-email", AuthController.verifyEmail);
router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);
router.post(
  "/logout",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER
  ),
  AuthController.logoutUser
);
router.get(
  "/me",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER
  ),
  AuthController.getMe
);
router.post("/forger-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER
  ),
  AuthController.changePassword
);
router.post("/refresh-token", AuthController.getNewToken);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var AuthRoutes = router;

// src/app/module/service/service.route.ts
import { Router as Router2 } from "express";

// src/app/module/service/service.service.ts
import status5 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(
          value
        );
        countQueryWhere[key] = this.parseRangeFilter(
          value
        );
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = {
      ...this.query.include,
      ...relation
    };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = {
      ...this.query.include,
      ...result
    };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery
      ),
      this.model.findMany(
        this.query
      )
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(
      this.countQuery
    );
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(
            result[key],
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      if (operatorValue === void 0) {
        return;
      }
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/module/service/service.service.ts
var createService = async (payload) => {
  const exitService = await prisma.service.findFirst({
    where: {
      name: payload.name
    }
  });
  if (exitService) {
    throw new AppError_default(status5.BAD_REQUEST, "Service already exists");
  }
  const result = await prisma.service.create({
    data: payload
  });
  return result;
};
var getAllServices = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.service, query, {
    searchableFields: ["name", "description"],
    filterableFields: ["isActive", "isDeleted"]
  });
  const result = await queryBuilder.search().filter().include({
    _count: {
      select: {
        reviews: true,
        serviceRequests: true
      }
    }
  }).paginate().sort().fields().execute();
  return result;
};
var getSingleService = async (id) => {
  const result = await prisma.service.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          customer: {
            select: { name: true, image: true }
          }
        }
      },
      _count: {
        select: { serviceRequests: true }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status5.NOT_FOUND, "Service not found");
  }
  return result;
};
var updateService = async (id, payload) => {
  const result = await prisma.service.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteService = async (id) => {
  try {
    const result = await prisma.service.update({
      where: {
        id,
        isActive: true
      },
      data: {
        isActive: false
      }
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new AppError_default(
      status5.NOT_FOUND,
      "Service not found or already deleted!"
    );
  }
};
var ServiceServices = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService
};

// src/app/module/service/service.controller.ts
import status6 from "http-status";
var createService2 = catchAsync(async (req, res) => {
  const result = await ServiceServices.createService(req.body);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Service created successfully",
    data: result
  });
});
var getAllServices2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ServiceServices.getAllServices(query);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Services fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getSingleService2 = catchAsync(async (req, res) => {
  const result = await ServiceServices.getSingleService(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Service fetched successfully",
    data: result
  });
});
var updateService2 = catchAsync(async (req, res) => {
  const result = await ServiceServices.updateService(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Service updated successfully",
    data: result
  });
});
var deleteService2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ServiceServices.deleteService(id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Service deleted successfully",
    data: result
  });
});
var ServiceController = {
  createService: createService2,
  getAllServices: getAllServices2,
  getSingleService: getSingleService2,
  updateService: updateService2,
  deleteService: deleteService2
};

// src/app/module/service/service.validation.ts
import { z as z2 } from "zod";
var createServiceZodSchema = z2.object({
  name: z2.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  description: z2.string().min(10, "Description must be at least 10 characters").max(500, "Description must not exceed 500 characters"),
  imageUrl: z2.string().url("Image URL must be a valid URL").nullable().optional(),
  isActive: z2.boolean().optional()
});
var ServiceValidation = {
  createServiceZodSchema
};

// src/app/module/service/service.route.ts
var router2 = Router2();
router2.get("/", ServiceController.getAllServices);
router2.get("/:id", ServiceController.getSingleService);
router2.post(
  "/create-service",
  checkAuth(UserRole.ADMIN),
  validateRequest(ServiceValidation.createServiceZodSchema),
  ServiceController.createService
);
router2.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.updateService
);
router2.patch(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  ServiceController.deleteService
);
var ServiceRoutes = router2;

// src/app/module/jobPost/jobPost.route.ts
import express from "express";

// src/app/module/jobPost/jobPost.controller.ts
import status8 from "http-status";

// src/app/module/jobPost/jobPost.service.ts
import status7 from "http-status";
var createJobPost = async (payload) => {
  const result = await prisma.jobPost.create({
    data: payload
  });
  return result;
};
var getAllJobPosts = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.jobPost, query, {
    searchableFields: [
      "title",
      "description",
      "requirements",
      "location",
      "serviceType",
      "salaryRange",
      "deadline"
    ],
    filterableFields: ["isActive", "vacancy", "serviceType", "searchTerm"]
  });
  const result = await queryBuilder.search().filter().include({
    _count: {
      select: {
        applications: true
      }
    }
  }).paginate().sort().fields().execute();
  return result;
};
var getSingleJobPost = async (id) => {
  const result = await prisma.jobPost.findUnique({
    where: { id },
    include: {
      applications: true
    }
  });
  return result;
};
var updateJobPost = async (id, payload) => {
  const { ...updateData } = payload;
  const result = await prisma.jobPost.update({
    where: { id },
    data: updateData
  });
  return result;
};
var deleteJobPost = async (id) => {
  const isExist = await prisma.jobPost.findUnique({
    where: {
      id,
      isActive: true
    }
  });
  if (!isExist) {
    throw new AppError_default(
      status7.NOT_FOUND,
      "Job post not found or already deactivated!"
    );
  }
  const result = await prisma.jobPost.update({
    where: { id },
    data: {
      isActive: false
    }
  });
  return result;
};
var JobPostServices = {
  createJobPost,
  getAllJobPosts,
  getSingleJobPost,
  updateJobPost,
  deleteJobPost
};

// src/app/module/jobPost/jobPost.controller.ts
var createJobPost2 = catchAsync(async (req, res) => {
  const result = await JobPostServices.createJobPost(req.body);
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Job post created successfully!",
    data: result
  });
});
var getAllJobPosts2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await JobPostServices.getAllJobPosts(query);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Job posts fetched successfully!",
    data: result.data,
    meta: result.meta
  });
});
var getSingleJobPost2 = catchAsync(async (req, res) => {
  const result = await JobPostServices.getSingleJobPost(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Job post details fetched!",
    data: result
  });
});
var updateJobPost2 = catchAsync(async (req, res) => {
  const result = await JobPostServices.updateJobPost(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Job post updated successfully!",
    data: result
  });
});
var deleteJobPost2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobPostServices.deleteJobPost(id);
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Job post deleted successfully",
    data: result
  });
});
var JobPostController = {
  createJobPost: createJobPost2,
  getAllJobPosts: getAllJobPosts2,
  getSingleJobPost: getSingleJobPost2,
  updateJobPost: updateJobPost2,
  deleteJobPost: deleteJobPost2
};

// src/app/module/jobPost/jobPost.validation.ts
import { z as z3 } from "zod";
var createJobPostZodSchema = z3.object({
  title: z3.string().min(5, "Title must be at least 5 characters").max(150, "Title must not exceed 150 characters"),
  description: z3.string().min(20, "Description must be at least 20 characters").max(2e3, "Description must not exceed 2000 characters"),
  requirements: z3.string().min(10, "Requirements must be at least 10 characters").max(1e3, "Requirements must not exceed 1000 characters"),
  location: z3.string().min(2, "Location must be at least 2 characters").max(150, "Location must not exceed 150 characters").optional(),
  serviceType: z3.string().min(2, "Service type must be at least 2 characters").max(100, "Service type must not exceed 100 characters"),
  vacancy: z3.coerce.number().int("Vacancy must be an integer").positive("Vacancy must be greater than 0").optional(),
  salaryRange: z3.string().max(100, "Salary range must not exceed 100 characters").optional(),
  // deadline: z.coerce.date({
  //   error: "Deadline must be a valid date",
  // }),
  // deadline: z.coerce.date().refine((date) => date > new Date(), {
  //   message: "Deadline must be a future date",
  // }),
  deadline: z3.coerce.date().refine(
    (date) => {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      message: "Deadline must be a future date"
    }
  ),
  isActive: z3.boolean().optional()
});
var updateJobPostZodSchema = createJobPostZodSchema.partial();
var JobPostValidation = {
  createJobPostZodSchema,
  updateJobPostZodSchema
};

// src/app/module/jobPost/jobPost.route.ts
var router3 = express.Router();
router3.get("/", JobPostController.getAllJobPosts);
router3.get("/:id", JobPostController.getSingleJobPost);
router3.post(
  "/create-job-post",
  checkAuth(UserRole.ADMIN),
  validateRequest(JobPostValidation.createJobPostZodSchema),
  JobPostController.createJobPost
);
router3.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(JobPostValidation.updateJobPostZodSchema),
  JobPostController.updateJobPost
);
router3.patch(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  JobPostController.deleteJobPost
);
var JobPostRoutes = router3;

// src/app/module/jobApplication/jobApplication.route.ts
import express2 from "express";

// src/app/module/jobApplication/jobApplication.controller.ts
import { status as status10 } from "http-status";

// src/app/module/jobApplication/jobApplication.service.ts
import status9 from "http-status";

// src/app/module/jobApplication/jobApplication.constant.ts
var jobApplicationSearchableFields = [
  "userId",
  "jobPostId",
  "jobPost.title",
  "jobPost.location",
  "jobPost.serviceType"
];
var jobApplicationFilterableFields = ["status", "searchTerm"];
var jobApplicationIncludeConfig = {
  user: true,
  jobPost: true
};

// src/app/module/jobApplication/jobApplication.service.ts
var applyToJob = async (payload) => {
  const jobPost = await prisma.jobPost.findUnique({
    where: { id: payload.jobPostId }
  });
  if (!jobPost) {
    throw new AppError_default(status9.NOT_FOUND, "Job post not found!");
  }
  if (!jobPost.isActive) {
    throw new AppError_default(
      status9.BAD_REQUEST,
      "This job post is no longer active!"
    );
  }
  if (new Date(jobPost.deadline) < /* @__PURE__ */ new Date()) {
    throw new AppError_default(
      status9.BAD_REQUEST,
      "The deadline for this job has passed!"
    );
  }
  const isAlreadyApplied = await prisma.jobApplication.findUnique({
    where: {
      userId_jobPostId: {
        userId: payload.userId,
        jobPostId: payload.jobPostId
      }
    }
  });
  if (isAlreadyApplied) {
    throw new AppError_default(
      status9.BAD_REQUEST,
      "You have already applied for this job!"
    );
  }
  return await prisma.jobApplication.create({
    data: payload,
    include: { jobPost: true }
  });
};
var getMyApplications = async (query, userId) => {
  const queryBuilder = new QueryBuilder(prisma.jobApplication, query, {
    searchableFields: jobApplicationSearchableFields,
    filterableFields: jobApplicationFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    userId
  }).include({
    jobPost: {
      select: {
        title: true,
        serviceType: true,
        description: true,
        salaryRange: true,
        location: true,
        deadline: true
      }
    }
  }).dynamicInclude(jobApplicationIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getApplicationById = async (id, userId, role) => {
  const result = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      jobPost: {
        select: {
          id: true,
          title: true,
          description: true,
          requirements: true,
          isActive: true,
          deadline: true,
          salaryRange: true,
          serviceType: true,
          createdAt: true,
          updatedAt: true
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status9.NOT_FOUND, "Application not found");
  }
  if (role !== UserRole.ADMIN && result.userId !== userId) {
    throw new AppError_default(
      status9.FORBIDDEN,
      "You are not authorized to view this application"
    );
  }
  return result;
};
var getAllApplicationsForAdmin = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.jobApplication, query, {
    searchableFields: jobApplicationSearchableFields,
    filterableFields: jobApplicationFilterableFields
  });
  const result = await queryBuilder.search().filter().include({
    user: true,
    jobPost: true
  }).dynamicInclude(jobApplicationIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var updateApplication = async (id, payload) => {
  const isApplicationExist = await prisma.jobApplication.findUnique({
    where: { id },
    include: { user: true, jobPost: true }
  });
  if (!isApplicationExist) {
    throw new AppError_default(status9.NOT_FOUND, "Job application not found!");
  }
  return await prisma.$transaction(async (tx) => {
    const updatedApplication = await tx.jobApplication.update({
      where: { id },
      data: payload,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            id: true,
            phone: true,
            address: true,
            role: true,
            isDeleted: true,
            emailVerified: true
          }
        },
        jobPost: {
          select: {
            title: true,
            serviceType: true,
            salaryRange: true,
            deadline: true,
            isActive: true,
            location: true,
            requirements: true
          }
        }
      }
    });
    if (payload.status === "ACCEPTED") {
      const userId = updatedApplication.userId;
      const isAlreadyProvider = await tx.serviceProvider.findUnique({
        where: { userId }
      });
      if (!isAlreadyProvider) {
        await tx.serviceProvider.create({
          data: {
            userId,
            serviceType: updatedApplication.jobPost?.serviceType ?? "General Service",
            isActive: true
          }
        });
        await tx.user.update({
          where: { id: userId },
          data: { role: "SERVICE_PROVIDER" }
        });
      }
    }
    return updatedApplication;
  });
};
var JobApplicationServices = {
  applyToJob,
  getMyApplications,
  getApplicationById,
  getAllApplicationsForAdmin,
  updateApplication
};

// src/app/module/jobApplication/jobApplication.controller.ts
var applyToJob2 = catchAsync(async (req, res) => {
  const userId = req.user.id || req.user.userId;
  const result = await JobApplicationServices.applyToJob({
    ...req.body,
    userId
  });
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "Application submitted successfully",
    data: result
  });
});
var getMyApplications2 = catchAsync(async (req, res) => {
  const query = req.query;
  const userId = req.user.userId;
  const result = await JobApplicationServices.getMyApplications(
    query,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Applications fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getApplicationById2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const role = req.user.role;
  const { id } = req.params;
  const result = await JobApplicationServices.getApplicationById(
    id,
    userId,
    role
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Application details fetched",
    data: result
  });
});
var getAllApplicationsForAdmin2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await JobApplicationServices.getAllApplicationsForAdmin(
      query
    );
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "All applications fetched for admin",
      data: result
    });
  }
);
var updateApplication2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await JobApplicationServices.updateApplication(
    id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Application updated successfully",
    data: result
  });
});
var JobApplicationController = {
  applyToJob: applyToJob2,
  getMyApplications: getMyApplications2,
  getApplicationById: getApplicationById2,
  getAllApplicationsForAdmin: getAllApplicationsForAdmin2,
  updateApplication: updateApplication2
};

// src/app/module/jobApplication/jobApplication.validation.ts
import { z as z4 } from "zod";
var createJobApplicationZodSchema = z4.object({
  userId: z4.string(),
  // .uuid("User ID must be a valid UUID"),
  jobPostId: z4.string().nullable().optional(),
  // cvUrl: z.string().url("CV must be a valid URL"),
  cvUrl: z4.string().url("CV must be a valid URL").refine(
    (url) => {
      const cleanUrl = url.split("?")[0].toLowerCase();
      return cleanUrl.endsWith(".pdf");
    },
    {
      message: "CV must be a valid PDF file"
    }
  ),
  // status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]).optional(),
  status: z4.enum(JobApplicationStatus).optional(),
  feedback: z4.string().max(1e3, "Feedback must not exceed 1000 characters").nullable().optional()
});
var updateJobApplicationZodSchema = z4.object({
  status: z4.enum(JobApplicationStatus).optional(),
  feedback: z4.string().max(1e3, "Feedback must not exceed 1000 characters").nullable().optional()
});
var JobApplicationValidation = {
  createJobApplicationZodSchema,
  updateJobApplicationZodSchema
};

// src/app/module/jobApplication/jobApplication.route.ts
var router4 = express2.Router();
router4.post(
  "/apply",
  checkAuth(),
  validateRequest(JobApplicationValidation.createJobApplicationZodSchema),
  JobApplicationController.applyToJob
);
router4.get(
  "/",
  checkAuth(UserRole.ADMIN),
  JobApplicationController.getAllApplicationsForAdmin
);
router4.get(
  "/my-applications",
  checkAuth(
    UserRole.JOB_CANDIDATE,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER
  ),
  JobApplicationController.getMyApplications
);
router4.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.JOB_CANDIDATE,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER
  ),
  JobApplicationController.getApplicationById
);
router4.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(JobApplicationValidation.updateJobApplicationZodSchema),
  JobApplicationController.updateApplication
);
var JobApplicationRoutes = router4;

// src/app/module/serviceRequest/serviceRequest.route.ts
import { Router as Router5 } from "express";

// src/app/module/serviceRequest/serviceRequest.service.ts
import status11 from "http-status";
import { format } from "date-fns";

// src/app/module/serviceRequest/serviceRequest.constant.ts
var serviceRequestSearchableFields = [
  "id",
  "serviceRequestId",
  "serviceId",
  "providerId",
  "customerId"
];
var serviceRequestFilterableFields = ["status", "searchTerm"];
var myServiceRequestByCustomerIncludeConfig = {
  service: true,
  customer: true,
  provider: true,
  schedule: true,
  costBreakdown: true,
  review: true
};

// src/app/module/serviceRequest/serviceRequest.service.ts
var createServiceRequest = async (payload) => {
  if (!payload.customerId) {
    throw new AppError_default(status11.BAD_REQUEST, "Customer information is missing!");
  }
  const isServiceExist = await prisma.service.findUnique({
    where: {
      id: payload.serviceId,
      isActive: true
    }
  });
  if (!isServiceExist) {
    throw new AppError_default(
      status11.NOT_FOUND,
      "Service not found or currently unavailable!"
    );
  }
  const result = await prisma.serviceRequest.create({
    data: {
      customerId: payload.customerId,
      serviceId: payload.serviceId,
      serviceDescription: payload.serviceDescription,
      serviceAddress: payload.serviceAddress,
      activePhone: payload.activePhone,
      status: "PENDING"
    },
    include: {
      service: {
        select: { id: true, name: true, description: true }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true
        }
      }
    }
  });
  return result;
};
var getMyServiceRequestByCustomer = async (query, customerId) => {
  const queryBuilder = new QueryBuilder(prisma.serviceRequest, query, {
    searchableFields: serviceRequestSearchableFields,
    filterableFields: serviceRequestFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    customerId
  }).include({
    service: {
      select: {
        name: true,
        imageUrl: true
      }
    },
    provider: {
      select: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    },
    schedule: true,
    costBreakdown: true,
    review: true
  }).dynamicInclude(myServiceRequestByCustomerIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getMyServiceRequestByServiceProvider = async (query, userId) => {
  if (!userId) {
    throw new AppError_default(status11.UNAUTHORIZED, "User ID not found in token!");
  }
  const provider = await prisma.serviceProvider.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError_default(status11.NOT_FOUND, "Provider profile not found!");
  }
  const queryBuilder = new QueryBuilder(prisma.serviceRequest, query, {
    searchableFields: serviceRequestSearchableFields,
    filterableFields: serviceRequestFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    providerId: provider.id
  }).include({
    service: {
      select: {
        name: true,
        description: true,
        imageUrl: true
      }
    },
    customer: {
      select: {
        name: true,
        email: true,
        phone: true,
        address: true,
        isDeleted: true
      }
    },
    schedule: true,
    costBreakdown: true,
    review: true
  }).dynamicInclude(myServiceRequestByCustomerIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getServiceRequestById = async (id, user) => {
  const whereCondition = { id };
  if (user.role === UserRole.CUSTOMER) {
    whereCondition.customerId = user.userId;
  } else if (user.role === UserRole.SERVICE_PROVIDER) {
    whereCondition.provider = {
      userId: user.userId
    };
  }
  const result = await prisma.serviceRequest.findUnique({
    where: whereCondition,
    include: {
      service: true,
      customer: true,
      provider: {
        include: {
          user: true
        }
      },
      schedule: true,
      costBreakdown: true,
      payment: true
    }
  });
  if (!result) {
    throw new AppError_default(status11.NOT_FOUND, "Service request not found!");
  }
  if (user.role === UserRole.CUSTOMER && result.customerId !== user.userId) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not authorized to view this request!"
    );
  }
  if (user.role === UserRole.SERVICE_PROVIDER && result.provider?.userId !== user.userId) {
    throw new AppError_default(status11.FORBIDDEN, "This job is not assigned to you!");
  }
  return result;
};
var getAllServiceRequest = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.serviceRequest, query, {
    searchableFields: serviceRequestSearchableFields,
    filterableFields: serviceRequestFilterableFields
  });
  const result = await queryBuilder.search().filter().include({
    service: { select: { id: true, name: true, reviews: true } },
    customer: {
      select: {
        name: true,
        image: true,
        email: true,
        emailVerified: true,
        phone: true,
        address: true,
        isDeleted: true,
        status: true
      }
    },
    provider: {
      select: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    },
    schedule: true,
    payment: {
      select: {
        status: true,
        transactionId: true,
        amount: true,
        invoiceUrl: true
      }
    },
    costBreakdown: true,
    review: true
  }).dynamicInclude(myServiceRequestByCustomerIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var cancelServiceRequestByCustomer = async (requestId, userId) => {
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: {
      id: requestId,
      isDeleted: false
    }
  });
  if (!isRequestExist) {
    throw new AppError_default(
      status11.NOT_FOUND,
      "Service request not found or already deleted!"
    );
  }
  if (isRequestExist.customerId !== userId) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not authorized to cancel this request!"
    );
  }
  if (isRequestExist.status !== ServiceRequestStatus.PENDING) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      `Cannot cancel a request that is already ${isRequestExist.status.toLowerCase()}!`
    );
  }
  const result = await prisma.serviceRequest.update({
    where: { id: requestId },
    data: {
      isDeleted: true
    }
  });
  return result;
};
var updateServiceRequestByServiceProvider = async (requestId, userId, payload) => {
  const provider = await prisma.serviceProvider.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError_default(status11.NOT_FOUND, "Service provider profile not found!");
  }
  const providerId = provider.id;
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { payment: true }
  });
  if (!isRequestExist || isRequestExist.isDeleted) {
    throw new AppError_default(status11.NOT_FOUND, "Service request not found!");
  }
  if (isRequestExist.providerId !== providerId) {
    throw new AppError_default(status11.FORBIDDEN, "This job is not assigned to you!");
  }
  if (isRequestExist.payment && isRequestExist.payment.status === PaymentStatus.PAID) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "Payment already completed. You cannot modify costs or status anymore!"
    );
  }
  const totalAmount = Number(payload.serviceCharge) + Number(payload.productCost) + Number(payload.additionalCost);
  const result = await prisma.$transaction(async (tx) => {
    await tx.serviceRequest.update({
      where: { id: requestId },
      data: { status: ServiceRequestStatus.COMPLETED }
    });
    const costData = await tx.costBreakdown.upsert({
      where: { requestId },
      update: {
        serviceCharge: payload.serviceCharge,
        productCost: payload.productCost,
        additionalCost: payload.additionalCost,
        totalAmount
      },
      create: {
        requestId,
        serviceCharge: payload.serviceCharge,
        productCost: payload.productCost,
        additionalCost: payload.additionalCost,
        totalAmount
      }
    });
    return costData;
  });
  return result;
};
var updateServiceRequestByManagement = async (requestId, payload) => {
  const isRequestExist = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { customer: true, provider: true, service: true }
  });
  if (!isRequestExist || isRequestExist.isDeleted) {
    throw new AppError_default(status11.NOT_FOUND, "Service request not found!");
  }
  const result = await prisma.$transaction(
    async (tx) => {
      const updatedData = { status: payload.status };
      if (payload.status === "REJECTED") {
        if (!payload.rejectionReason) {
          throw new AppError_default(
            status11.BAD_REQUEST,
            "Rejection reason is required!"
          );
        }
        updatedData.rejectionReason = payload.rejectionReason;
        updatedData.providerId = null;
        updatedData.scheduleId = null;
      } else if (payload.status === "ACCEPTED") {
        if (!payload.providerId || !payload.scheduleId) {
          throw new AppError_default(
            status11.BAD_REQUEST,
            "Provider and Schedule are required to accept!"
          );
        }
        updatedData.providerId = payload.providerId;
        updatedData.scheduleId = payload.scheduleId;
        updatedData.rejectionReason = null;
        await tx.serviceSchedule.update({
          where: { id: payload.scheduleId },
          data: { isBooked: true }
        });
      }
      const updatedRequest = await tx.serviceRequest.update({
        where: { id: requestId },
        data: updatedData,
        include: {
          provider: {
            include: {
              user: { select: { name: true, email: true, phone: true } }
            }
          },
          service: { select: { name: true } },
          schedule: true
        }
      });
      return updatedRequest;
    },
    {
      maxWait: 5e3,
      timeout: 1e4
    }
  );
  if (payload.status === "ACCEPTED" && result.provider) {
    (async () => {
      try {
        const scheduleInfo = result.schedule ? `${format(new Date(result.schedule.scheduleDate), "dd MMM, yyyy")} at ${result.schedule.startTime}` : "Pending Selection";
        const requestDate = format(
          new Date(isRequestExist.createdAt),
          "dd MMM, yyyy 'at' hh:mm a"
        );
        await sendEmail({
          to: isRequestExist.customer.email,
          subject: "Service Request Accepted - MNA ServiceHub",
          templateName: "serviceAssignment",
          templateData: {
            name: isRequestExist.customer.name,
            customerEmail: isRequestExist.customer.email,
            customerPhone: isRequestExist.customer.phone,
            activePhone: isRequestExist.activePhone,
            customerAddress: isRequestExist.customer.address,
            serviceAddress: isRequestExist.serviceAddress,
            serviceName: result.service.name,
            requestTime: requestDate,
            requestId,
            providerName: result?.provider?.user.name,
            providerPhone: result?.provider?.user.phone,
            providerEmail: result?.provider?.user.email,
            schedule: scheduleInfo
          }
        });
      } catch (error) {
        console.error(
          `Failed to send confirmation email for Request: ${requestId}`,
          error
        );
      }
    })();
  }
  return result;
};
var ServiceRequestServices = {
  createServiceRequest,
  getMyServiceRequestByCustomer,
  getMyServiceRequestByServiceProvider,
  getServiceRequestById,
  getAllServiceRequest,
  cancelServiceRequestByCustomer,
  updateServiceRequestByServiceProvider,
  updateServiceRequestByManagement
};

// src/app/module/serviceRequest/serviceRequest.controller.ts
import status12 from "http-status";
var createServiceRequest2 = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const { serviceId, serviceDescription, serviceAddress, activePhone } = req.body;
  const result = await ServiceRequestServices.createServiceRequest({
    customerId,
    serviceId,
    serviceDescription,
    serviceAddress,
    activePhone
  });
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "Service request created successfully",
    data: result
  });
});
var getMyServiceRequestByCustomer2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const customerId = req.user.id;
    const result = await ServiceRequestServices.getMyServiceRequestByCustomer(
      query,
      customerId
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Customer service requests retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getMyServiceRequestByServiceProvider2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const userId = req.user?.userId;
    const result = await ServiceRequestServices.getMyServiceRequestByServiceProvider(
      query,
      userId
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Provider assigned service requests retrieved successfully",
      data: result
    });
  }
);
var getServiceRequestById2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ServiceRequestServices.getServiceRequestById(
      id,
      user
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Service request details retrieved successfully",
      data: result
    });
  }
);
var getAllServiceRequest2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await ServiceRequestServices.getAllServiceRequest(
    query
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "All service requests retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});
var cancelServiceRequestByCustomer2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ServiceRequestServices.cancelServiceRequestByCustomer(
      id,
      user.userId
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Service request cancelled successfully",
      data: result
    });
  }
);
var updateServiceRequestByServiceProvider2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ServiceRequestServices.updateServiceRequestByServiceProvider(
      id,
      user.userId,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "Service costs added and status updated to COMPLETED",
      data: result
    });
  }
);
var updateServiceRequestByManagement2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await ServiceRequestServices.updateServiceRequestByManagement(
      id,
      payload
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: `Service request ${payload.status.toLowerCase()} successfully`,
      data: result
    });
  }
);
var ServiceRequestController = {
  createServiceRequest: createServiceRequest2,
  getMyServiceRequestByCustomer: getMyServiceRequestByCustomer2,
  getMyServiceRequestByServiceProvider: getMyServiceRequestByServiceProvider2,
  getServiceRequestById: getServiceRequestById2,
  getAllServiceRequest: getAllServiceRequest2,
  cancelServiceRequestByCustomer: cancelServiceRequestByCustomer2,
  updateServiceRequestByServiceProvider: updateServiceRequestByServiceProvider2,
  updateServiceRequestByManagement: updateServiceRequestByManagement2
};

// src/app/module/serviceRequest/serviceRequest.validation.ts
import { z as z5 } from "zod";
var createServiceRequestZodSchema = z5.object({
  serviceId: z5.string().uuid("Service ID must be a valid UUID"),
  serviceDescription: z5.string({ error: "Service description is required" }).min(10, "Service description must be at least 10 characters").max(2e3, "Service description must not exceed 2000 characters"),
  serviceAddress: z5.string({ error: "Service address is required" }).min(5, "Service address must be at least 5 characters").max(300, "Service address must not exceed 300 characters"),
  activePhone: z5.string({ error: "Active phone number is required" }).regex(/^\d{11,13}$/, "Phone number must be 11-13 digits")
});
var updateServiceRequestByManagementZodSchema = z5.object({
  status: z5.enum(["ACCEPTED", "REJECTED"], {
    error: "Status is required and must be ACCEPTED or REJECTED"
  }),
  rejectionReason: z5.string().trim().max(500, "Rejection reason must not exceed 500 characters").optional(),
  providerId: z5.string().optional().or(z5.literal("")),
  scheduleId: z5.string().optional().or(z5.literal(""))
}).refine((data) => data.status !== "REJECTED" || !!data.rejectionReason, {
  message: "Rejection reason is required when status is REJECTED",
  path: ["rejectionReason"]
}).refine(
  (data) => data.status !== "ACCEPTED" || !!data.providerId && !!data.scheduleId,
  {
    message: "Provider ID and Schedule ID are required when status is ACCEPTED",
    path: ["providerId"]
  }
);
var updateServiceCostZodSchema = z5.object({
  serviceCharge: z5.number({
    error: "Service charge must be a number"
  }).min(0, "Service charge cannot be negative"),
  productCost: z5.number({
    error: "Product cost must be a number"
  }).min(0, "Product cost cannot be negative"),
  additionalCost: z5.number({
    error: "Additional cost must be a number"
  }).min(0, "Additional cost cannot be negative")
}).refine(
  (data) => data.serviceCharge > 0 || data.productCost > 0 || data.additionalCost > 0,
  {
    message: "At least one cost must be greater than 0",
    path: ["serviceCharge"]
  }
);
var ServiceRequestValidation = {
  createServiceRequestZodSchema,
  updateServiceRequestByManagementZodSchema,
  updateServiceCostZodSchema
};

// src/app/module/serviceRequest/serviceRequest.route.ts
var router5 = Router5();
router5.post(
  "/apply",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(ServiceRequestValidation.createServiceRequestZodSchema),
  ServiceRequestController.createServiceRequest
);
router5.get(
  "/my-service-requests-customer",
  checkAuth(UserRole.CUSTOMER),
  ServiceRequestController.getMyServiceRequestByCustomer
);
router5.get(
  "/my-service-requests-sp",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ServiceRequestController.getMyServiceRequestByServiceProvider
);
router5.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER
  ),
  ServiceRequestController.getServiceRequestById
);
router5.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceRequestController.getAllServiceRequest
);
router5.patch(
  "/cancel/:id",
  checkAuth(UserRole.CUSTOMER),
  ServiceRequestController.cancelServiceRequestByCustomer
);
router5.patch(
  "/update-service-request-cost/:id",
  checkAuth(UserRole.SERVICE_PROVIDER),
  validateRequest(ServiceRequestValidation.updateServiceCostZodSchema),
  ServiceRequestController.updateServiceRequestByServiceProvider
);
router5.patch(
  "/update-service-request/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(
    ServiceRequestValidation.updateServiceRequestByManagementZodSchema
  ),
  ServiceRequestController.updateServiceRequestByManagement
);
var ServiceRequestRoutes = router5;

// src/app/module/serviceSchedule/serviceSchedule.route.ts
import { Router as Router6 } from "express";

// src/app/module/serviceSchedule/serviceSchedule.service.ts
import status13 from "http-status";
import { addMinutes, format as format2, parse } from "date-fns";
import { startOfDay, endOfDay } from "date-fns";

// src/app/module/serviceSchedule/serviceSchedule.constant.ts
var serviceScheduleSearchableFields = [
  "id",
  "serviceRequestId",
  "serviceId",
  "providerId",
  "scheduleDate"
];
var serviceScheduleFilterableFields = ["isBooked", "searchTerm"];
var myServiceScheduleIncludeConfig = {
  serviceRequest: true,
  provider: true
};

// src/app/module/serviceSchedule/serviceSchedule.service.ts
var createServiceSchedule = async (userId, payload) => {
  const { scheduleDate, startTime } = payload;
  const targetDate = new Date(scheduleDate);
  const provider = await prisma.serviceProvider.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError_default(
      status13.NOT_FOUND,
      "Service Provider profile not found! Please complete your registration."
    );
  }
  const providerId = provider.id;
  const isExist = await prisma.serviceSchedule.findFirst({
    where: { providerId, scheduleDate: targetDate }
  });
  if (isExist) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "Schedules for this date already exist!"
    );
  }
  const slots = [];
  let currentStart = parse(startTime, "hh:mm a", targetDate);
  for (let i = 1; i <= 3; i++) {
    const slotStart = currentStart;
    const slotEnd = addMinutes(slotStart, 180);
    slots.push({
      providerId,
      scheduleDate: targetDate,
      startTime: format2(slotStart, "hh:mm a"),
      endTime: format2(slotEnd, "hh:mm a"),
      slotNumber: i
    });
    currentStart = addMinutes(slotStart, 195);
  }
  const result = await prisma.serviceSchedule.createMany({
    data: slots
  });
  return result;
};
var getMySchedules = async (query, providerId) => {
  const queryBuilder = new QueryBuilder(prisma.serviceSchedule, query, {
    searchableFields: serviceScheduleSearchableFields,
    filterableFields: serviceScheduleFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    providerId
  }).include({
    serviceRequest: {
      select: {
        id: true,
        status: true,
        service: {
          select: { name: true }
        }
      }
    },
    provider: true
  }).dynamicInclude(myServiceScheduleIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getScheduleByDate = async (user, date) => {
  const targetDate = new Date(date);
  const startDate = startOfDay(targetDate);
  const endDate = endOfDay(targetDate);
  const whereConditions = {
    scheduleDate: {
      gte: startDate,
      lte: endDate
    }
  };
  if (user.role === UserRole.SERVICE_PROVIDER) {
    const provider = await prisma.serviceProvider.findUnique({
      where: { userId: user.userId }
    });
    if (!provider) {
      return [];
    }
    whereConditions.providerId = provider.id;
  }
  const result = await prisma.serviceSchedule.findMany({
    where: whereConditions,
    include: {
      provider: {
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      },
      serviceRequest: {
        select: { id: true, status: true, service: { select: { name: true } } }
      }
    },
    orderBy: {
      startTime: "asc"
    }
  });
  return result;
};
var getServiceSchedules = async () => {
  const result = await prisma.serviceSchedule.findMany({
    include: {
      provider: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      serviceRequest: {
        select: {
          id: true,
          status: true,
          service: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      scheduleDate: "desc"
    }
  });
  return result;
};
var getScheduleById = async (user, id) => {
  const result = await prisma.serviceSchedule.findUnique({
    where: { id },
    include: {
      provider: {
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          }
        }
      },
      serviceRequest: {
        include: {
          service: { select: { name: true } },
          customer: { select: { name: true, email: true } }
        }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status13.NOT_FOUND, "Service schedule not found!");
  }
  if (user.role === UserRole.SERVICE_PROVIDER && result.provider.userId !== user.userId) {
    throw new AppError_default(
      status13.FORBIDDEN,
      "You do not have permission to view this schedule!"
    );
  }
  return result;
};
var ServiceScheduleServices = {
  createServiceSchedule,
  getMySchedules,
  getScheduleByDate,
  getServiceSchedules,
  getScheduleById
};

// src/app/module/serviceSchedule/serviceSchedule.controller.ts
import status14 from "http-status";
var createServiceSchedule2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ServiceScheduleServices.createServiceSchedule(
      user.userId,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status14.CREATED,
      success: true,
      message: "3 Service slots created successfully",
      data: result
    });
  }
);
var getMySchedules2 = catchAsync(async (req, res) => {
  const query = req.query;
  const providerId = req.user.id;
  const result = await ServiceScheduleServices.getMySchedules(
    query,
    providerId
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Provider schedules retrieved successfully",
    data: result
  });
});
var getScheduleByDate2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { date } = req.query;
  const result = await ServiceScheduleServices.getScheduleByDate(
    user,
    date
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: `Schedules retrieved for ${date} successfully`,
    data: result
  });
});
var getServiceSchedules2 = catchAsync(async (req, res) => {
  const result = await ServiceScheduleServices.getServiceSchedules();
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "All service schedules retrieved successfully",
    data: result
  });
});
var getScheduleById2 = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const result = await ServiceScheduleServices.getScheduleById(
    user,
    id
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Service schedule details retrieved successfully",
    data: result
  });
});
var ServiceScheduleController = {
  createServiceSchedule: createServiceSchedule2,
  getMySchedules: getMySchedules2,
  getScheduleByDate: getScheduleByDate2,
  getServiceSchedules: getServiceSchedules2,
  getScheduleById: getScheduleById2
};

// src/app/module/serviceSchedule/serviceSchedule.validation.ts
import { z as z6 } from "zod";
import { parse as parse2, isBefore, startOfToday, isSameDay } from "date-fns";
var parseTime = (time) => {
  return parse2(time, "hh:mm a", /* @__PURE__ */ new Date());
};
var createServiceScheduleZodSchema = z6.object({
  scheduleDate: z6.string({ error: "Schedule date is required" }).refine(
    (date) => {
      const inputDate = new Date(date);
      return !isBefore(inputDate, startOfToday());
    },
    {
      message: "Schedule date cannot be a past date"
    }
  ),
  startTime: z6.string({ error: "Initial start time is required" }).regex(
    /^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i,
    "Invalid time format (e.g. 10:00 AM)"
  )
}).refine(
  (data) => {
    const today = /* @__PURE__ */ new Date();
    const inputDate = new Date(data.scheduleDate);
    if (isSameDay(inputDate, today)) {
      const inputTime = parseTime(data.startTime);
      return !isBefore(inputTime, today);
    }
    return true;
  },
  {
    message: "Schedule time cannot be a past time for today",
    path: ["startTime"]
  }
);
var ServiceScheduleValidation = {
  createServiceScheduleZodSchema
};

// src/app/module/serviceSchedule/serviceSchedule.route.ts
var router6 = Router6();
router6.post(
  "/create-schedule",
  checkAuth(UserRole.SERVICE_PROVIDER),
  validateRequest(ServiceScheduleValidation.createServiceScheduleZodSchema),
  ServiceScheduleController.createServiceSchedule
);
router6.get(
  "/my-schedules",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getMySchedules
);
router6.get(
  "/schedule-by-date",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER, UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getScheduleByDate
);
router6.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceScheduleController.getServiceSchedules
);
router6.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER, UserRole.SERVICE_PROVIDER),
  ServiceScheduleController.getScheduleById
);
var ServiceScheduleRoutes = router6;

// src/app/module/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/module/payment/payment.controller.ts
import status17 from "http-status";

// src/app/module/payment/payment.service.ts
import status16 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/module/payment/payment.utils.ts
import PDFDocument from "pdfkit";
var createStripeSession = async (data) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: data.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: data.serviceName,
            description: `Payment for Service Request ID: ${data.requestId}`
          },
          unit_amount: Math.round(data.amount * 100)
        },
        quantity: 1
      }
    ],
    metadata: {
      requestId: data.requestId,
      paymentId: data.paymentId
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`
  });
};
var generateInvoicePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (error) => {
        reject(error);
      });
      doc.fontSize(20).text("MNA ServiceHub", { align: "right" });
      doc.fontSize(10).text("Your Trusted Service Partner", { align: "right" });
      doc.moveDown();
      doc.fontSize(25).font("Helvetica-Bold").text("INVOICE", { align: "left" });
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(10).font("Helvetica-Bold").text("Bill To:");
      doc.font("Helvetica").text(`Name: ${data.customerName}`);
      doc.text(`Email: ${data.customerEmail}`);
      doc.moveDown();
      doc.font("Helvetica-Bold").text("Service Details:");
      doc.font("Helvetica").text(`Service: ${data.serviceName}`);
      doc.text(`Provider: ${data.providerName}`);
      doc.text(`Transaction ID: ${data.transactionId}`);
      doc.moveDown();
      const tableTop = doc.y;
      doc.font("Helvetica-Bold").text("Description", 50, tableTop);
      doc.text("Amount (BDT)", 450, tableTop, { align: "right" });
      doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
      let currentY = doc.y + 15;
      const drawRow = (label, value) => {
        doc.font("Helvetica").text(label, 50, currentY);
        doc.text(`${value.toFixed(2)}`, 450, currentY, { align: "right" });
        currentY += 20;
      };
      drawRow("Service Charge", data.serviceCharge);
      drawRow("Product/Material Cost", data.productCost);
      drawRow("Additional Cost", data.additionalCost);
      doc.moveTo(350, currentY).lineTo(550, currentY).stroke();
      currentY += 10;
      doc.font("Helvetica-Bold").fontSize(12).text("Total Paid:", 350, currentY);
      doc.text(`${data.amount.toFixed(2)} BDT`, 450, currentY, {
        align: "right"
      });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status15 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(
      status15.BAD_REQUEST,
      "File buffer and file name are required for upload"
    );
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `mna-service-hub/${folder}/${uniqueName}`,
        folder: `mna-service-hub/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError_default(
              status15.INTERNAL_SERVER_ERROR,
              "Failed to upload file to Cloudinary"
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(
      status15.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};

// src/app/module/payment/payment.service.ts
var createPayment = async (payload) => {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: payload.requestId },
    include: {
      customer: true,
      service: true,
      costBreakdown: true,
      payment: true
    }
  });
  if (!serviceRequest)
    throw new AppError_default(status16.NOT_FOUND, "Service request not found!");
  if (serviceRequest.customerId !== payload.customerId) {
    throw new AppError_default(
      status16.FORBIDDEN,
      "Unauthorized! This is not your service request."
    );
  }
  if (serviceRequest.isDeleted) {
    throw new AppError_default(
      status16.GONE,
      "This service request is no longer available."
    );
  }
  if (serviceRequest.status !== ServiceRequestStatus.COMPLETED) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "You can only pay for completed services!"
    );
  }
  if (!serviceRequest.costBreakdown) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "Service cost is not yet calculated!"
    );
  }
  if (serviceRequest.payment?.status === PaymentStatus.PAID) {
    throw new AppError_default(
      status16.CONFLICT,
      "This service has already been paid for."
    );
  }
  const amount = Number(serviceRequest.costBreakdown?.totalAmount);
  if (!amount || amount <= 0) {
    throw new AppError_default(
      status16.BAD_REQUEST,
      "Invalid payment amount calculated!"
    );
  }
  const transactionId = serviceRequest.payment?.transactionId || `TXN-${Date.now()}-${payload.requestId.slice(0, 8)}`;
  const result = await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.upsert({
      where: { requestId: payload.requestId },
      update: { amount, transactionId, status: PaymentStatus.PENDING },
      create: {
        requestId: payload.requestId,
        amount,
        transactionId,
        status: PaymentStatus.PENDING
      }
    });
    const session = await createStripeSession({
      amount,
      requestId: payload.requestId,
      paymentId: paymentRecord.id,
      customerEmail: serviceRequest.customer.email,
      serviceName: serviceRequest.service.name
    });
    return { checkoutUrl: session.url };
  });
  return result;
};
var handlerStripeWebhookEvent = async (payload, signature) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError_default(status16.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { requestId, paymentId } = session.metadata || {};
    if (!requestId || !paymentId) {
      throw new AppError_default(
        status16.BAD_REQUEST,
        "Invalid webhook session metadata: missing requestId or paymentId."
      );
    }
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        customer: true,
        provider: { include: { user: true } },
        service: true,
        costBreakdown: true
      }
    });
    if (!serviceRequest) return { message: "Request not found" };
    let finalInvoiceUrl = null;
    let pdfBuffer = null;
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        stripeEventId: event.id,
        stripeCustomerId: session.customer,
        paymentGatewayData: session
      }
    });
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { paymentStatus: PaymentStatus.PAID }
    });
    if (session.payment_status === "paid" && serviceRequest.costBreakdown) {
      try {
        pdfBuffer = await generateInvoicePdf({
          invoiceId: paymentId,
          customerName: serviceRequest.customer.name,
          customerEmail: serviceRequest.customer.email,
          serviceName: serviceRequest.service.name,
          providerName: serviceRequest.provider?.user.name || "N/A",
          amount: Number(serviceRequest.costBreakdown.totalAmount),
          transactionId: updatedPayment.transactionId,
          paymentDate: (/* @__PURE__ */ new Date()).toISOString(),
          serviceCharge: Number(serviceRequest.costBreakdown.serviceCharge),
          productCost: Number(serviceRequest.costBreakdown.productCost),
          additionalCost: Number(serviceRequest.costBreakdown.additionalCost)
        });
        const cloudinaryResponse = await uploadFileToCloudinary(
          pdfBuffer,
          `mna-service-hub/invoices/inv-${paymentId}.pdf`
        );
        finalInvoiceUrl = cloudinaryResponse?.secure_url || null;
        if (finalInvoiceUrl) {
          await prisma.payment.update({
            where: { id: paymentId },
            data: { invoiceUrl: finalInvoiceUrl }
          });
        }
      } catch (err) {
        console.error("PDF/Cloudinary Error:", err);
      }
    }
    if (session.payment_status === "paid") {
      await sendEmail({
        to: serviceRequest.customer.email,
        subject: `Payment Successful - Invoice for ${serviceRequest.service.name}`,
        templateName: "serviceInvoice",
        templateData: {
          name: serviceRequest.customer.name,
          serviceName: serviceRequest.service.name,
          totalAmount: serviceRequest.costBreakdown?.totalAmount,
          invoiceUrl: finalInvoiceUrl
        },
        attachments: pdfBuffer ? [
          {
            filename: `Invoice-${requestId.slice(0, 6)}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ] : []
      });
    }
  }
  return { success: true };
};
var getAllPayments = async (query) => {
  const { page = 1, limit = 10, searchTerm, status: status29 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereConditions = {};
  if (searchTerm) {
    whereConditions.OR = [
      { transactionId: { contains: searchTerm, mode: "insensitive" } },
      { stripeCustomerId: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  if (status29) {
    whereConditions.status = status29;
  }
  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      serviceRequest: {
        include: {
          customer: {
            select: { name: true, email: true }
          },
          service: {
            select: { name: true }
          }
        }
      }
    }
  });
  const total = await prisma.payment.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var getMyPaidPayments = async (customerId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereConditions = {
    status: PaymentStatus.PAID,
    serviceRequest: {
      customerId
    }
  };
  const result = await prisma.payment.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: { updatedAt: "desc" },
    include: {
      serviceRequest: {
        include: {
          service: {
            select: { name: true }
          }
        }
      }
    }
  });
  const total = await prisma.payment.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var getSinglePayment = async (paymentId) => {
  const result = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      serviceRequest: {
        include: {
          customer: {
            select: { name: true, email: true, image: true }
          },
          provider: {
            include: { user: { select: { name: true, email: true } } }
          },
          service: true,
          costBreakdown: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status16.NOT_FOUND, "Payment details not found!");
  }
  return result;
};
var PaymentService = {
  createPayment,
  handlerStripeWebhookEvent,
  getAllPayments,
  getMyPaidPayments,
  getSinglePayment
};

// src/app/module/payment/payment.controller.ts
var createPayment2 = catchAsync(async (req, res) => {
  const result = await PaymentService.createPayment({
    requestId: req.body.requestId,
    customerId: req.user.userId
  });
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Payment session created successfully",
    data: result
  });
});
var handleStripeWebhookEvent = catchAsync(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const result = await PaymentService.handlerStripeWebhookEvent(
      req.body,
      signature
    );
    res.status(status17.OK).json(result);
  }
);
var getAllPayments2 = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayments(req.query);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Payments fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var getMyPaidPayments2 = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const result = await PaymentService.getMyPaidPayments(customerId, req.query);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Your paid payments fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var getSinglePayment2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PaymentService.getSinglePayment(id);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Payment details fetched successfully",
    data: result
  });
});
var PaymentController = {
  createPayment: createPayment2,
  handleStripeWebhookEvent,
  getAllPayments: getAllPayments2,
  getMyPaidPayments: getMyPaidPayments2,
  getSinglePayment: getSinglePayment2
};

// src/app/module/payment/payment.route.ts
var router7 = Router7();
router7.post(
  "/create-payment",
  checkAuth(UserRole.CUSTOMER),
  PaymentController.createPayment
);
router7.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  PaymentController.getAllPayments
);
router7.get(
  "/my-payments",
  checkAuth(UserRole.CUSTOMER),
  PaymentController.getMyPaidPayments
);
router7.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  PaymentController.getSinglePayment
);
var PaymentRoutes = router7;

// src/app/module/review/review.route.ts
import express3 from "express";

// src/app/module/review/review.validation.ts
import { z as z7 } from "zod";
var createReviewZodSchema = z7.object({
  requestId: z7.string({ error: "Service request ID is required" }).uuid("Invalid service request ID"),
  serviceId: z7.string({ error: "Service ID is required" }).uuid("Invalid service ID"),
  providerId: z7.string({ error: "Provider ID is required" }).uuid("Invalid provider ID"),
  rating: z7.number({ error: "Rating is required" }).int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
  comment: z7.string({ error: "Comment is required" }).min(3, "Comment must be at least 3 characters").max(1e3, "Comment cannot exceed 1000 characters")
});
var ReviewValidation = {
  createReviewZodSchema
};

// src/app/module/review/review.controller.ts
import status19 from "http-status";

// src/app/module/review/review.service.ts
import status18 from "http-status";
var giveReview = async (payload) => {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: payload.requestId },
    include: { payment: true }
  });
  if (!serviceRequest) {
    throw new AppError_default(status18.NOT_FOUND, "Service request not found!");
  }
  if (serviceRequest.customerId !== payload.customerId) {
    throw new AppError_default(
      status18.FORBIDDEN,
      "You are not authorized to review this service request!"
    );
  }
  if (serviceRequest.status !== ServiceRequestStatus.COMPLETED) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "Service must be completed before reviewing!"
    );
  }
  if (serviceRequest.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "You must complete the payment first!"
    );
  }
  const existingReview = await prisma.review.findUnique({
    where: { requestId: payload.requestId }
  });
  if (existingReview) {
    throw new AppError_default(
      status18.BAD_REQUEST,
      "You have already submitted a review for this service!"
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        requestId: payload.requestId,
        customerId: payload.customerId,
        serviceId: serviceRequest.serviceId,
        providerId: serviceRequest.providerId,
        rating: payload.rating,
        comment: payload.comment
      }
    });
    const serviceReviews = await tx.review.findMany({
      where: { serviceId: serviceRequest.serviceId }
    });
    const avgServiceRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
    await tx.service.update({
      where: { id: serviceRequest.serviceId },
      data: {
        averageRating: avgServiceRating,
        totalReviews: serviceReviews.length
      }
    });
    const providerReviews = await tx.review.findMany({
      where: { providerId: serviceRequest.providerId }
    });
    const avgProviderRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
    await tx.serviceProvider.update({
      where: { id: serviceRequest.providerId },
      data: {
        averageRating: avgProviderRating,
        totalReviews: providerReviews.length
      }
    });
    return newReview;
  });
  return result;
};
var getAllReviews = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const result = await prisma.review.findMany({
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      },
      service: {
        select: {
          name: true
        }
      }
    }
  });
  const total = await prisma.review.count();
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var deleteReviewById = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError_default(status18.NOT_FOUND, "Review not found!");
  }
  await prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: { id: reviewId }
    });
    const serviceReviews = await tx.review.findMany({
      where: { serviceId: review.serviceId }
    });
    const totalServiceReviews = serviceReviews.length;
    const avgServiceRating = totalServiceReviews > 0 ? serviceReviews.reduce((sum, r) => sum + r.rating, 0) / totalServiceReviews : 0;
    await tx.service.update({
      where: { id: review.serviceId },
      data: {
        averageRating: avgServiceRating,
        totalReviews: totalServiceReviews
      }
    });
    const providerReviews = await tx.review.findMany({
      where: { providerId: review.providerId }
    });
    const totalProviderReviews = providerReviews.length;
    const avgProviderRating = totalProviderReviews > 0 ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalProviderReviews : 0;
    await tx.serviceProvider.update({
      where: { id: review.providerId },
      data: {
        averageRating: avgProviderRating,
        totalReviews: totalProviderReviews
      }
    });
  });
  return { message: "Review deleted and ratings recalculated successfully" };
};
var getMyReviews = async (customerId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereConditions = {
    customerId
  };
  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      service: {
        select: {
          name: true,
          imageUrl: true
        }
      },
      serviceProvider: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        }
      }
    }
  });
  const total = await prisma.review.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var getMyReviewsBySP = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const provider = await prisma.serviceProvider.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new AppError_default(status18.NOT_FOUND, "Service provider profile not found!");
  }
  const whereConditions = {
    providerId: provider.id
  };
  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      },
      service: {
        select: {
          name: true,
          imageUrl: true
        }
      }
    }
  });
  const total = await prisma.review.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var getReviewsByService = async (serviceId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereConditions = {
    serviceId
  };
  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc"
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      },
      serviceProvider: {
        include: {
          user: { select: { name: true } }
        }
      }
    }
  });
  const total = await prisma.review.count({ where: whereConditions });
  const totalPages = Math.ceil(total / Number(limit));
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    },
    data: result
  };
};
var ReviewService = {
  giveReview,
  getAllReviews,
  deleteReviewById,
  getMyReviews,
  getMyReviewsBySP,
  getReviewsByService
};

// src/app/module/review/review.controller.ts
var giveReview2 = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const result = await ReviewService.giveReview({
    ...req.body,
    customerId
  });
  sendResponse(res, {
    httpStatusCode: status19.CREATED,
    success: true,
    message: "Review submitted successfully and ratings updated",
    data: result
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviews(req.query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "All reviews fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var deleteReviewById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewService.deleteReviewById(id);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const customerId = req.user.userId;
  const result = await ReviewService.getMyReviews(customerId, req.query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Your reviews fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var getMyReviewsBySP2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.getMyReviewsBySP(userId, req.query);
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Provider reviews fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var getReviewsByService2 = catchAsync(async (req, res) => {
  const { serviceId } = req.params;
  const result = await ReviewService.getReviewsByService(
    serviceId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status19.OK,
    success: true,
    message: "Reviews for this service fetched successfully",
    meta: result.meta,
    data: result.data
  });
});
var ReviewController = {
  giveReview: giveReview2,
  getAllReviews: getAllReviews2,
  deleteReviewById: deleteReviewById2,
  getMyReviews: getMyReviews2,
  getMyReviewsBySP: getMyReviewsBySP2,
  getReviewsByService: getReviewsByService2
};

// src/app/module/review/review.route.ts
var router8 = express3.Router();
router8.get("/", ReviewController.getAllReviews);
router8.get("/service/:serviceId", ReviewController.getReviewsByService);
router8.post(
  "/give-review",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.giveReview
);
router8.get(
  "/my-reviews",
  checkAuth(UserRole.CUSTOMER),
  ReviewController.getMyReviews
);
router8.get(
  "/provider-reviews",
  checkAuth(UserRole.SERVICE_PROVIDER),
  ReviewController.getMyReviewsBySP
);
router8.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  ReviewController.deleteReviewById
);
var ReviewRoutes = router8;

// src/app/module/user/user.route.ts
import { Router as Router9 } from "express";

// src/app/module/user/user.controller.ts
import status21 from "http-status";

// src/app/module/user/user.service.ts
import status20 from "http-status";

// src/app/utils/passwordGenerator.ts
import crypto from "crypto";
var generateTemporaryPassword = (length = 10) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
};

// src/app/module/user/user.service.ts
import { hashPassword } from "better-auth/crypto";

// src/app/module/user/user.constant.ts
var userSearchableFields = ["name", "email", "phone"];
var userFilterableFields = ["status", "role", "searchTerm"];
var userIncludeConfig = {
  serviceProvider: true,
  serviceRequests: true,
  reviews: true
};

// src/app/module/user/user.service.ts
var registerStaff = async (payload) => {
  const tempPassword = generateTemporaryPassword(8);
  const hashedPassword = await hashPassword(tempPassword);
  const isExist = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (isExist) {
    throw new AppError_default(status20.CONFLICT, "User with this email already exists!");
  }
  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      status: UserStatus.ACTIVE,
      needPasswordChange: true,
      emailVerified: true,
      accounts: {
        create: {
          accountId: payload.email,
          providerId: "credential",
          password: hashedPassword
        }
      }
    },
    include: {
      accounts: true
    }
  });
  try {
    await sendEmail({
      to: payload.email,
      subject: "MNA ServiceHub Staff Account - Welcome",
      templateName: "staffWelcome",
      templateData: {
        name: payload.name,
        role: payload.role,
        email: payload.email,
        password: tempPassword,
        loginUrl: `${envVars.FRONTEND_URL}/login`
      }
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }
  return result;
};
var getAllUsers = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields
  });
  const result = await queryBuilder.search().filter().include({
    serviceProvider: true,
    serviceRequests: true,
    jobApplications: true,
    reviews: true
  }).dynamicInclude(userIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getAllCustomers = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    role: UserRole.CUSTOMER
  }).include({
    serviceProvider: true,
    serviceRequests: true,
    jobApplications: true,
    reviews: true
  }).dynamicInclude(userIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getAllProviders = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    role: UserRole.SERVICE_PROVIDER
  }).include({
    serviceProvider: true,
    serviceRequests: true,
    jobApplications: true,
    reviews: true
  }).dynamicInclude(userIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getUserById = async (id) => {
  const result = await prisma.user.findUnique({
    where: { id }
  });
  return result;
};
var updateUserById = async (id, payload) => {
  const data = {};
  if (payload.name !== void 0) data.name = payload.name;
  if (payload.phone !== void 0) data.phone = payload.phone;
  if (payload.image !== void 0) data.image = payload.image;
  if (payload.address !== void 0) data.address = payload.address;
  const result = await prisma.user.update({
    where: { id },
    data
  });
  return result;
};
var adminUpdateUserById = async (id, payload) => {
  const data = {};
  if (payload.name !== void 0) data.name = payload.name;
  if (payload.phone !== void 0) data.phone = payload.phone;
  if (payload.address !== void 0) data.address = payload.address;
  if (payload.role !== void 0) data.role = payload.role;
  if (payload.status !== void 0) data.status = payload.status;
  if (payload.emailVerified !== void 0)
    data.emailVerified = payload.emailVerified;
  const result = await prisma.user.update({
    where: { id },
    data
  });
  return result;
};
var adminDeleteUserById = async (id) => {
  const result = await prisma.user.update({
    where: { id, isDeleted: false },
    data: {
      isDeleted: true,
      status: UserStatus.DELETED,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var UserService = {
  registerStaff,
  getAllUsers,
  getAllCustomers,
  getAllProviders,
  getUserById,
  updateUserById,
  adminUpdateUserById,
  adminDeleteUserById
};

// src/app/module/user/user.controller.ts
var registerStaff2 = catchAsync(async (req, res) => {
  const result = await UserService.registerStaff(req.body);
  sendResponse(res, {
    httpStatusCode: status21.CREATED,
    success: true,
    message: "Staff register successfully",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllUsers(query);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllCustomers2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllCustomers(query);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Customers fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllProviders2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllProviders(query);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "Providers fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.updateUserById(id, req.body);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var adminUpdateUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.adminUpdateUserById(id, req.body);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var adminDeleteUserById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.adminDeleteUserById(id);
  sendResponse(res, {
    httpStatusCode: status21.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var UserController = {
  registerStaff: registerStaff2,
  getAllUsers: getAllUsers2,
  getAllCustomers: getAllCustomers2,
  getAllProviders: getAllProviders2,
  getUserById: getUserById2,
  updateUserById: updateUserById2,
  adminUpdateUserById: adminUpdateUserById2,
  adminDeleteUserById: adminDeleteUserById2
};

// src/app/module/user/user.validation.ts
import z8 from "zod";
var registerStaffZodSchema = z8.object({
  name: z8.string("Name is required").min(5, "Name must be at least 3 characters").max(30, "Name must be at most 30 characters"),
  email: z8.email("Invalid email"),
  phone: z8.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 14 characters"),
  role: z8.enum([UserRole.ADMIN, UserRole.MANAGER], {
    error: "Role is required (ADMIN or MANAGER)"
  })
  // address: z
  //   .string("Address is required")
  //   .min(10, "Address must be at least 10 characters")
  //   .max(100, "Address must be at most 100 characters")
  //   .optional(),
  // experience: z
  //   .int("Experience is required")
  //   .nonnegative("Experience can't be negative"),
  // qualification: z
  //   .string("Qualification is required")
  //   .min(2, "Qualification must be at least 2 characters")
  //   .max(50, "Qualification must be at most 50 characters"),
  // designation: z
  //   .string("Designation is required")
  //   .min(2, "Designation must be at least 2 characters")
  //   .max(50, "Designation must be at most 50 characters"),
});

// src/app/module/user/user.route.ts
var router9 = Router9();
router9.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  UserController.getAllUsers
);
router9.get(
  "/customers",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  UserController.getAllCustomers
);
router9.get(
  "/providers",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  UserController.getAllProviders
);
router9.get(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER
  ),
  UserController.getUserById
);
router9.patch(
  "/:id",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.CUSTOMER
  ),
  UserController.updateUserById
);
router9.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  UserController.adminUpdateUserById
);
router9.patch(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  UserController.adminDeleteUserById
);
router9.post(
  "/register-staff",
  checkAuth(UserRole.ADMIN),
  validateRequest(registerStaffZodSchema),
  UserController.registerStaff
);
var UserRoutes = router9;

// src/app/module/stats/stats.route.ts
import { Router as Router10 } from "express";

// src/app/module/stats/stats.controller.ts
import status23 from "http-status";

// src/app/module/stats/stats.service.ts
import status22 from "http-status";
var getDashboardStatsData = async (user) => {
  let statsData;
  switch (user.role) {
    case UserRole.ADMIN:
      statsData = await getAdminStatsData();
      break;
    case UserRole.MANAGER:
      statsData = await getAdminStatsData();
      break;
    case UserRole.SERVICE_PROVIDER:
      statsData = await getProviderStatsData(user);
      break;
    case UserRole.JOB_CANDIDATE:
      statsData = await getCandidateStatsData(user);
      break;
    case UserRole.CUSTOMER:
      statsData = await getCustomerStatsData(user);
      break;
    default:
      throw new AppError_default(status22.BAD_REQUEST, "Invalid user role");
  }
  return statsData;
};
var getAdminStatsData = async () => {
  const [
    userCount,
    providerCount,
    requestCount,
    serviceCount,
    pendingApplications
  ] = await Promise.all([
    prisma.user.count(),
    prisma.serviceProvider.count(),
    prisma.serviceRequest.count(),
    prisma.service.count(),
    prisma.jobApplication.count({ where: { status: "PENDING" } })
  ]);
  const totalRevenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" }
  });
  return {
    userCount,
    providerCount,
    requestCount,
    serviceCount,
    pendingApplications,
    totalRevenue: Number(totalRevenueResult._sum.amount || 0),
    requestStatusDistribution: await getRequestStatusDistribution(),
    monthlyRequests: await getMonthlyRequestData()
  };
};
var getProviderStatsData = async (user) => {
  const provider = await prisma.serviceProvider.findUniqueOrThrow({
    where: { userId: user.userId }
  });
  const totalAssignedRequests = await prisma.serviceRequest.count({
    where: { providerId: provider.id }
  });
  const completedRequests = await prisma.serviceRequest.count({
    where: {
      providerId: provider.id,
      status: ServiceRequestStatus.COMPLETED
    }
  });
  const reviewCount = await prisma.review.count({
    where: { providerId: provider.id }
  });
  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { providerId: provider.id }
  });
  return {
    totalAssignedRequests,
    completedRequests,
    reviewCount,
    averageRating: avgRating._avg.rating || 0
  };
};
var getCandidateStatsData = async (user) => {
  const candidate = await prisma.user.findUniqueOrThrow({
    where: { id: user.userId }
  });
  const totalJobApplied = await prisma.jobApplication.count({
    where: { userId: candidate.id }
  });
  const totalPendingJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.PENDING
    }
  });
  const totalAcceptedJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.ACCEPTED
    }
  });
  const totalRejectedJobApplications = await prisma.jobApplication.count({
    where: {
      userId: candidate.id,
      status: JobApplicationStatus.REJECTED
    }
  });
  return {
    totalJobApplied: totalJobApplied || 0,
    pendingApplications: totalPendingJobApplications || 0,
    acceptedApplications: totalAcceptedJobApplications || 0,
    rejectedApplications: totalRejectedJobApplications || 0
  };
};
var getCustomerStatsData = async (user) => {
  const totalRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId
    }
  });
  const activeRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
      status: { in: ["PENDING", "ACCEPTED"] }
    }
  });
  const completedRequests = await prisma.serviceRequest.count({
    where: {
      customerId: user.userId,
      status: { in: ["COMPLETED"] }
    }
  });
  const totalSpent = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      serviceRequest: { customerId: user.userId },
      status: "PAID"
    }
  });
  return {
    totalRequests,
    activeRequests,
    completedRequests,
    totalSpent: Number(totalSpent._sum.amount || 0)
  };
};
var getRequestStatusDistribution = async () => {
  const stats = await prisma.serviceRequest.groupBy({
    by: ["status"],
    _count: { id: true }
  });
  return stats.map((item) => ({
    status: item.status,
    count: item._count.id
  }));
};
var getMonthlyRequestData = async () => {
  const result = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "service_requests"
    GROUP BY month
    ORDER BY month ASC;
  `;
  return result;
};
var StatsService = {
  getDashboardStatsData
};

// src/app/module/stats/stats.controller.ts
var getDashboardStatsData2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await StatsService.getDashboardStatsData(user);
    sendResponse(res, {
      httpStatusCode: status23.OK,
      success: true,
      message: "Dashboard statistics retrieved successfully!",
      data: result
    });
  }
);
var StatsController = {
  getDashboardStatsData: getDashboardStatsData2
};

// src/app/module/stats/stats.route.ts
var router10 = Router10();
router10.get(
  "/",
  checkAuth(
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.SERVICE_PROVIDER,
    UserRole.JOB_CANDIDATE,
    UserRole.CUSTOMER
  ),
  StatsController.getDashboardStatsData
);
var StatsRoutes = router10;

// src/app/module/aiChatBot/chatbot.route.ts
import express4 from "express";

// src/app/module/aiChatBot/chatbot.service.ts
import dotenv2 from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv2.config();
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
var getHealthAdviceFromAI = async (userMessage) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const prompt = `
    You are a professional local service provider assistant for "MNA ServiceHub", an online service.
    
    Guidelines:
    1. Answer only local service related questions. 
    2. If someone asks about IT, programming, or anything unrelated to local service, politely say: "I am specialized in local service. Please ask me about local service tips."
    3. Always include this disclaimer at the end in a new line: "\u26A0\uFE0F Disclaimer: This is for informational purposes. Please consult a doctor before taking any medicine."
    4. Provide brief and clear answers.
    5. Support both English and Bengali.

    User Question: ${userMessage}
  `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error) {
    console.error("Detailed Gemini Error:", error.status, error.message);
  }
};

// src/app/module/aiChatBot/chatbot.controller.ts
var ChatWithAIController = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }
    const aiAnswer = await getHealthAdviceFromAI(message);
    res.status(200).json({
      success: true,
      data: aiAnswer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong with AI"
    });
  }
};

// src/app/module/aiChatBot/chatbot.route.ts
var router11 = express4.Router();
router11.post("/chat", ChatWithAIController);
var AIRoutes = router11;

// src/app/module/serviceProvider/serviceProvider.route.ts
import { Router as Router12 } from "express";

// src/app/module/serviceProvider/serviceProvider.controller.ts
import status24 from "http-status";

// src/app/module/serviceProvider/serviceProvider.constant.ts
var serviceProviderSearchableFields = [
  "user.name",
  "user.email",
  "user.phone"
];
var serviceProviderFilterableFields = [
  "isActive",
  "user.isDeleted",
  "searchTerm"
];
var serviceProviderIncludeConfig = {
  user: true,
  schedules: true,
  reviews: true
};

// src/app/module/serviceProvider/serviceProvider.service.ts
var getAllServiceProviders = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.serviceProvider, query, {
    searchableFields: serviceProviderSearchableFields,
    filterableFields: serviceProviderFilterableFields
  });
  const result = await queryBuilder.search().filter().include({
    user: true,
    schedules: true,
    reviews: true
  }).dynamicInclude(serviceProviderIncludeConfig).paginate().fields().execute();
  return result;
};
var getServiceProviderById = async (id) => {
  const result = await prisma.serviceProvider.findUnique({
    where: { id }
  });
  return result;
};
var ServiceProviderService = {
  getAllServiceProviders,
  getServiceProviderById
  // updateUserById,
};

// src/app/module/serviceProvider/serviceProvider.controller.ts
var getAllServiceProviders2 = catchAsync(
  async (req, res) => {
    const result = await ServiceProviderService.getAllServiceProviders(
      req.query
    );
    sendResponse(res, {
      httpStatusCode: status24.OK,
      success: true,
      message: "Service Providers fetched successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getServiceProviderById2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ServiceProviderService.getServiceProviderById(
      id
    );
    sendResponse(res, {
      httpStatusCode: status24.OK,
      success: true,
      message: "Service Provider fetched successfully",
      data: result
    });
  }
);
var ServiceProviderController = {
  getAllServiceProviders: getAllServiceProviders2,
  getServiceProviderById: getServiceProviderById2
  // updateServiceProviderById,
};

// src/app/module/serviceProvider/serviceProvider.route.ts
var router12 = Router12();
router12.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceProviderController.getAllServiceProviders
);
router12.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ServiceProviderController.getServiceProviderById
);
var ServiceProviderRoutes = router12;

// src/app/routes/index.ts
var router13 = Router13();
router13.use("/auth", AuthRoutes);
router13.use("/users", UserRoutes);
router13.use("/service-providers", ServiceProviderRoutes);
router13.use("/services", ServiceRoutes);
router13.use("/ai", AIRoutes);
router13.use("/job-posts", JobPostRoutes);
router13.use("/job-applications", JobApplicationRoutes);
router13.use("/service-requests", ServiceRequestRoutes);
router13.use("/service-schedules", ServiceScheduleRoutes);
router13.use("/payments", PaymentRoutes);
router13.use("/reviews", ReviewRoutes);
router13.use("/stats", StatsRoutes);
var IndexRoutes = router13;

// src/app/middleware/notFound.ts
import status25 from "http-status";
var notFound = (req, res) => {
  res.status(status25.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found!`
  });
};

// src/app.ts
import path3 from "path";
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/globalErrorHandler.ts
import status28 from "http-status";
import z9 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status26 from "http-status";
var handleZodError = (err) => {
  const statusCode = status26.BAD_REQUEST;
  const message = "Zod validation error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url))
      );
      console.log(
        `
Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to an error during request processing.
`
      );
    }
  } catch (error) {
    console.error(
      "Error deleting uploaded files from Global Error Handler",
      error
    );
  }
};

// src/app/errorHelpers/handlePrismaErrors.ts
import status27 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status27.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status27.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status27.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status27.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status27.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status27.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status27.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status27.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status27.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status27.INTERNAL_SERVER_ERROR;
  }
  return status27.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status27.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName ?? "unknown",
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status27.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status27.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status27.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Err from GlobalErrorHandler :", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status28.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z9.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status28.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app.ts
var app = express5();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"]
  })
);
app.use(cookieParser());
app.post(
  "/api/v1/payments/webhook",
  express5.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use("/api/auth", toNodeHandler(auth));
app.use(express5.urlencoded({ extended: true }));
app.use(express5.json());
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("MNA ServiceHub");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/server.ts
var server;
var main = async () => {
  try {
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on PORT: ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Fail to start server", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
main();
