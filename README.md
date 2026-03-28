# ⚙️ MNA ServiceHub Backend

> “All local services in one smart platform.”

**MNA ServiceHub** is a role-based service booking platform (Admin, Manager, Service Provider, Job Candidate, Customer) where customers can discover and request local services. Managers assign service providers to requests based on their schedules, service providers complete the assigned tasks, and the Admin oversees and controls the entire system.

MNA ServiceHub acts as a centralized digital platform that enables all local service-related activities to be managed efficiently from a single place.

## 🔗 Project Links

- **Live API Base URL:** [mna-servicehub-backend.vercel.app](https://mna-servicehub-backend.vercel.app/)
- **Frontend Live Link:** [mna-servicehub.vercel.app](https://mna-servicehub.vercel.app/)
- **Frontend Repository:** [MNA-ServiceHub Frontend](https://github.com/nurulazam-dev/mna-servicehub-frontend)
  <br>
  <br>
  [![Backend Deployment](https://img.shields.io/badge/Deployment-Vercel-blue)](https://mna-servicehub-backend.vercel.app/)
  [![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)](https://www.postgresql.org/)

---

# 📋 Backend Tech Stack:

| Package Name                  | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| **express**                   | Core web framework for building REST APIs, handling routing and middleware. |
| **typescript**                | Adds static typing to JavaScript, improves code safety and maintainability. |
| **tsx**                       | Runs TypeScript files directly in development mode without precompiling.    |
| **@prisma/client**            | Type-safe ORM client for interacting with PostgreSQL.                       |
| **prisma**                    | ORM CLI for migrations, generating client, and schema management.           |
| **@prisma/adapter-pg**        | PostgreSQL adapter for Prisma, ensures proper type-safe queries.            |
| **pg**                        | PostgreSQL driver for Node.js.                                              |
| **better-auth**               | Authentication framework to manage login and session securely.              |
| **jsonwebtoken**              | Implements JWT for token-based authentication.                              |
| **cookie-parser**             | Parses cookies for authentication/session handling.                         |
| **cors**                      | Enables Cross-Origin Resource Sharing for API access.                       |
| **dotenv**                    | Loads environment variables from `.env` files.                              |
| **http-status**               | Standardizes HTTP status codes for responses.                               |
| **zod**                       | Schema-based validation for request payloads.                               |
| **multer**                    | Handles multipart/form-data file uploads.                                   |
| **cloudinary**                | Cloud-based file/image storage service.                                     |
| **multer-storage-cloudinary** | Integrates multer with Cloudinary for direct uploads.                       |
| **nodemailer**                | Sends transactional emails like verification, notifications, and invoices.  |
| **pdfkit**                    | Dynamically generates PDFs for invoices or reports.                         |
| **stripe**                    | Online payment gateway for processing transactions securely.                |
| **uuid**                      | Generates unique identifiers for records like IDs and tokens.               |
| **date-fns**                  | Utility library for date manipulation and formatting.                       |
| **ms**                        | Converts time units for token expiration and timeouts.                      |
| **qs**                        | Parses and serializes query strings in complex URL queries.                 |
| **ejs**                       | Templating engine for generating HTML emails or views.                      |

---

# 📅 Service Schedule Module Documentation:

## 🔹 Base URL

```yaml
/api/v1/service-schedules
```

---

# ⚙️ Business Rules

- A Service Provider can create **maximum 3 schedules per day**
- Each schedule duration = **3 hours**
- There must be a **15-minute gap** between schedules
- Schedule date must be **today or future (no past dates)**
- A schedule can be booked **only once**

---

# 1️⃣ Create Service Schedule

```yaml
POST → /service-schedules/create-schedule
```

### 🔐 Access:

- Service Provider only

---

### 📝 Request Body

```json
{
  "scheduleDate": "2026-04-01",
  "startTime": "10:00 AM"
}
```

---

### ⚙️ Validation

- Uses: `createServiceScheduleZodSchema`
- Date must not be in the past
- Time must be valid format (hh:mm AM/PM)

---

### ⚠️ Rules

- Max 3 schedules per day
- System should auto-calculate:
  - End time (start + 3 hours)
  - Ensure 15 min gap from other schedules

---

### ✅ Response

```json
{
  "success": true,
  "message": "Schedule created successfully",
  "data": {
    "id": "uuid",
    "scheduleDate": "2026-04-01",
    "startTime": "10:00 AM",
    "endTime": "01:00 PM",
    "isBooked": false
  }
}
```

---

# 2️⃣ Get My Schedules

```yaml
GET → /service-schedules/my-schedules
```

### 🔐 Access:

- Service Provider only

---

### ✅ Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "scheduleDate": "2026-04-01",
      "startTime": "10:00 AM",
      "endTime": "01:00 PM",
      "isBooked": false
    }
  ]
}
```

---

# 3️⃣ Get Schedule by Date

```yaml
GET → /service-schedules/schedule-by-date
```

### 🔐 Access:

- Admin
- Manager
- Service Provider

---

### 🔍 Query Params

```
?date=2026-04-01
&providerId=uuid (optional for admin/manager)
```

---

### ⚠️ Behavior

- Service Provider → can see only **own schedules**
- Admin/Manager → can see **any provider’s schedules**

---

### ✅ Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "scheduleDate": "2026-04-01",
      "startTime": "10:00 AM",
      "endTime": "01:00 PM",
      "isBooked": true
    }
  ]
}
```

---

# 4️⃣ Get All Service Schedules

```yaml
GET → /service-schedules
```

### 🔐 Access:

- Admin / Manager

---

### 🔍 Query (optional)

```
?page=1
&limit=10
&date=2026-04-01
```

---

### ✅ Response

```json
{
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  },
  "data": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "scheduleDate": "2026-04-01",
      "startTime": "10:00 AM",
      "endTime": "01:00 PM",
      "isBooked": false
    }
  ]
}
```

---

# 5️⃣ Get Schedule by ID

```yaml
GET → /service-schedules/{id}
```

### 🔐 Access:

- Service Provider (own only)
- Admin
- Manager

---

### 📌 Params

```
id: string (UUID)
```

---

### ⚠️ Rules

- Service Provider can only access **own schedule**
- Admin/Manager can access any schedule

---

### ✅ Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "providerId": "uuid",
    "scheduleDate": "2026-04-01",
    "startTime": "10:00 AM",
    "endTime": "01:00 PM",
    "isBooked": false
  }
}
```

---

# 🔐 Authorization Matrix

| Method | Endpoint          | SP       | Manager | Admin |
| ------ | ----------------- | -------- | ------- | ----- |
| POST   | /create-schedule  | ✅       | ❌      | ❌    |
| GET    | /my-schedules     | ✅       | ❌      | ❌    |
| GET    | /schedule-by-date | ✅       | ✅      | ✅    |
| GET    | /                 | ❌       | ✅      | ✅    |
| GET    | /:id              | ✅ (own) | ✅      | ✅    |

---

# ⚠️ Critical Validations

- ❌ Cannot create schedule in the past
- ❌ Cannot exceed 3 schedules/day
- ❌ Must maintain 15-minute gap
- ❌ Cannot access other provider schedules (SP)
- ✅ Admin/Manager has full visibility

---

# 📋 Service-Request Module Documentation:

## 🧩 1. Functional Requirements

## 1.1 Create Service Request

A logged-in **Customer** can create a service request.

### Rules:

- One request can contain **only one service**
- Multiple services per request are **not allowed**
- Default status: `PENDING`

---

## 1.2 Get My Service Requests (Customer)

A logged-in **Customer** can view all their own service requests.

### Rules:

- Only the customer’s own requests are visible
- Data is returned in a list/table format

---

## 1.3 Get My Service Requests (Service Provider)

A logged-in **Service Provider (SP)** can view all assigned service requests.

### Rules:

- Only requests **assigned/appended** to the provider are visible
- Includes schedule-based assignments

---

## 1.4 Get Service Request by ID

Retrieve a single service request by ID.

### Access Control:

- Customer → only their own request
- Admin / Manager / Service Provider → any request

---

## 1.5 Get All Service Requests

Retrieve all service requests.

### Access:

- Admin
- Manager

### Features:

- Pagination (recommended)
- Filtering (e.g., status)
- Search (optional)

---

## 1.6 Cancel Service Request (Customer)

A **Customer** can cancel their own service request.

### Conditions:

- Must be the owner
- Status must be `PENDING`
- Cancellation is a **soft delete**

### Restrictions:

- Cannot cancel after acceptance or processing

---

## 1.7 Update Service Request (Service Provider)

A **Service Provider** can update assigned service requests.

### Permissions:

- View assigned requests
- Update:
  - Status (`IN_PROGRESS → COMPLETED`)
  - Cost breakdown:
    - Service Charge
    - Product Cost
    - Additional Cost

### Restrictions:

- Must be assigned via schedule/management
- Cannot update unassigned requests
- ❌ No updates allowed after payment completion

### Completion Rule:

- When service is finished:
  - Status must be `COMPLETED`
  - Cost must be fully provided

---

## 1.8 Update Service Request (Admin / Manager)

Admin or Manager can manage service requests.

---

### ✔ Accept Request

#### Actions:

- Assign **Service Provider**
- Assign **Schedule**

#### Validations:

- Provider must match service type
- Schedule must be available

#### Post Action:

- Send email to customer including:
  - Service details
  - Provider details

---

### ❌ Reject Request

#### Rules:

- Must include **rejection reason**
- Reason is visible to customer

---

# ⚙️ 2. Business Rules Summary

- One request = one service
- Only owner can cancel (if status = `PENDING`)
- SP can update only assigned requests
- No updates allowed after payment
- Admin/Manager controls approval and assignment
- Rejection must include a reason

---

# 🌐 3. API Documentation

## 🔹 Base URL

```
/api/v1/service-requests
```

---

# 🔸 3.1 Create Service Request

```yaml
POST /apply
```

### Access:

- Customer

### Request Body:

```json
{
  "serviceId": "uuid",
  "serviceDescription": "Fix my AC urgently",
  "serviceAddress": "Dhaka, Bangladesh",
  "activePhone": "017XXXXXXXX"
}
```

### Validation:

- `createServiceRequestZodSchema`

### Response:

```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": {}
}
```

---

# 🔸 3.2 Get My Requests (Customer)

```yaml
GET /my-service-requests
```

### Access:

- Customer

---

# 🔸 3.3 Get My Requests (Service Provider)

```yaml
GET /my-service-requests-sp
```

### Access:

- Service Provider

---

# 🔸 3.4 Get Request by ID

```yaml
GET /{id}
```

### Access:

- Customer (own)
- Admin / Manager / SP

### Params:

```
id: UUID
```

---

# 🔸 3.5 Get All Requests

```yaml
GET /
```

### Access:

- Admin / Manager

### Query:

```
?page=1&limit=10&status=PENDING
```

---

# 🔸 3.6 Cancel Request

```yaml
PATCH /cancel/{id}
```

### Access:

- Customer

### Rules:

- Only own request
- Status must be `PENDING`
- Soft delete

---

# 🔸 3.7 Update by Service Provider

```yaml
PATCH /update-status-cost/{id}
```

### Access:

- Service Provider

### Validation:

- `updateServiceCostZodSchema`

### Request Body:

```json
{
  "serviceCharge": 500,
  "productCost": 200,
  "additionalCost": 100
}
```

### Rules:

- Only assigned request
- Not allowed after payment

---

# 🔸 3.8 Update by Admin / Manager

```yaml
PATCH /update-service-request/{id}
```

### Access:

- Admin / Manager

### Validation:

- `updateServiceRequestByManagementZodSchema`

---

## ✔ Accept Request

```json
{
  "status": "ACCEPTED",
  "providerId": "uuid",
  "scheduleId": "uuid"
}
```

---

## ❌ Reject Request

```json
{
  "status": "REJECTED",
  "rejectionReason": "Invalid request details"
}
```

---

# 🔐 4. Authorization Matrix

| Method | Endpoint                    | Customer | Service Provider | Manager | Admin |
| ------ | --------------------------- | -------- | ---------------- | ------- | ----- |
| POST   | /apply                      | ✅       | ❌               | ❌      | ❌    |
| GET    | /my-service-requests        | ✅       | ❌               | ❌      | ❌    |
| GET    | /my-service-requests-sp     | ❌       | ✅               | ❌      | ❌    |
| GET    | /:id                        | ✅ (own) | ✅               | ✅      | ✅    |
| GET    | /                           | ❌       | ❌               | ✅      | ✅    |
| PATCH  | /cancel/:id                 | ✅       | ❌               | ❌      | ❌    |
| PATCH  | /update-status-cost/:id     | ❌       | ✅               | ❌      | ❌    |
| PATCH  | /update-service-request/:id | ❌       | ❌               | ✅      | ✅    |

---

# ⚠️ 5. Critical Constraints

- Cannot cancel after `ACCEPTED`
- Cannot update after payment
- Must assign provider + schedule when accepting
- Must provide reason when rejecting
- One service request cannot contain multiple services

---

# 💳 Payment Module Documentation:

## 🔹 Base URL

```
/api/v1/payments
```

---

# 📌 Module Overview

The Payment module handles **secure payment processing using Stripe**, invoice generation, and payment tracking.

It ensures:

- Payment only after service completion
- Stripe-based checkout flow
- Automatic invoice generation (PDF)
- Email delivery with invoice
- Full payment tracking system

---

# ⚙️ Payment Workflow

```
Customer → Create Payment → Stripe Checkout → Webhook → Payment Success → Invoice Generated → Email Sent
```

---

# ⚠️ Core Business Rules

- ❌ Payment allowed only when:
  - Service Request status = `COMPLETED`

- ❌ Cannot pay:
  - If cost not calculated
  - If already paid

- ✅ After successful payment:
  - Status → `PAID`
  - Invoice generated (PDF)
  - Uploaded to Cloudinary
  - Email sent to customer

---

# 1️⃣ Create Payment (Stripe Checkout)

```yaml
POST → /payments/create-payment
```

### 🔐 Access:

- Customer only

---

### 📝 Request Body

```json
{
  "requestId": "uuid"
}
```

---

### ⚙️ Backend Logic

- Validate:
  - Service Request exists
  - Status = COMPLETED
  - Cost breakdown exists
  - Not already paid

- Create / update payment record

- Generate Stripe Checkout session

---

### ✅ Response

```json
{
  "success": true,
  "message": "Payment session created successfully",
  "data": {
    "checkoutUrl": "https://stripe.com/checkout/session/..."
  }
}
```

---

### 🚀 Frontend Action

- Redirect user to `checkoutUrl`

---

# 2️⃣ Stripe Webhook (Internal)

```yaml
POST → /payments/webhook
```

### ⚠️ Important:

- Not for frontend use
- Called by Stripe automatically

---

### 🔐 Security:

- Uses Stripe signature verification

---

### ⚙️ Handles Events:

#### ✅ `checkout.session.completed`

- Update payment:
  - status → `PAID`
  - store Stripe data

- Update service request:
  - paymentStatus → `PAID`

- Generate invoice PDF

- Upload to Cloudinary

- Send email with invoice

---

#### ❌ `payment_failed`

- Update payment status → `FAILED`

---

### ✅ Response

```json
{
  "success": true,
  "message": "Stripe webhook processed successfully"
}
```

---

# 3️⃣ Get All Payments

```yaml
GET → /payments
```

### 🔐 Access:

- Admin
- Manager

---

### 🔍 Query Params

```
?page=1
&limit=10
&searchTerm=TXN
&status=PAID
```

---

### ✅ Response

```json
{
  "success": true,
  "message": "Payments fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "data": [
    {
      "id": "uuid",
      "amount": 800,
      "status": "PAID",
      "transactionId": "TXN-123456",
      "serviceRequest": {
        "customer": {
          "name": "John",
          "email": "john@mail.com"
        },
        "service": {
          "name": "AC Repair"
        }
      }
    }
  ]
}
```

---

# 4️⃣ Get My Paid Payments

```yaml
GET → /payments/my-payments
```

### 🔐 Access:

- Customer only

---

### 🔍 Query Params

```
?page=1
&limit=10
```

---

### ⚠️ Rules

- Only returns:
  - Logged-in customer payments
  - status = `PAID`

---

### ✅ Response

```json
{
  "success": true,
  "message": "Your paid payments fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "data": [
    {
      "id": "uuid",
      "amount": 800,
      "status": "PAID",
      "serviceRequest": {
        "service": {
          "name": "AC Repair"
        }
      }
    }
  ]
}
```

---

# 5️⃣ Get Single Payment

```yaml
GET → /payments/{id}
```

### 🔐 Access:

- Admin
- Manager

---

### 📌 Params

```
id: string (UUID)
```

---

### ✅ Response

```json
{
  "success": true,
  "message": "Payment details fetched successfully",
  "data": {
    "id": "uuid",
    "amount": 800,
    "status": "PAID",
    "transactionId": "TXN-123456",
    "invoiceUrl": "https://cloudinary.com/invoice.pdf",
    "serviceRequest": {
      "customer": {
        "name": "John",
        "email": "john@mail.com"
      },
      "provider": {
        "user": {
          "name": "Provider Name",
          "email": "sp@mail.com"
        }
      },
      "service": {
        "name": "AC Repair"
      },
      "costBreakdown": {
        "serviceCharge": 500,
        "productCost": 200,
        "additionalCost": 100
      }
    }
  }
}
```

---

# 🔐 Authorization Matrix

| Method | Endpoint        | Customer | Manager | Admin |
| ------ | --------------- | -------- | ------- | ----- |
| POST   | /create-payment | ✅       | ❌      | ❌    |
| POST   | /webhook        | ❌       | ❌      | ❌    |
| GET    | /my-payments    | ✅       | ❌      | ❌    |
| GET    | /               | ❌       | ✅      | ✅    |
| GET    | /:id            | ❌       | ✅      | ✅    |

---

# 📦 Payment Data Model (Simplified)

- id
- requestId
- amount
- status → `PENDING | PAID | FAILED`
- transactionId
- stripeCustomerId
- stripeEventId
- invoiceUrl

---

# 🧠 Implementation Highlights

## ✅ Stripe Integration

- Uses **Stripe Checkout Session**
- Metadata used for:
  - requestId
  - paymentId

---

## ✅ Invoice System

- Generated using **PDFKit**
- Contains:
  - Customer info
  - Service details
  - Cost breakdown
  - Total amount

---

## ✅ File Storage

- Invoice uploaded to **Cloudinary**
- Stored as URL in DB

---

## ✅ Email System

- Sent after successful payment
- Includes:
  - Invoice PDF attachment
  - Invoice URL

---

# ⚠️ Critical Validations

- ❌ Cannot pay before service completion
- ❌ Cannot pay twice
- ❌ Cannot process invalid Stripe events
- ✅ Webhook must be verified using signature

---
