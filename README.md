# ⚙️ MNA ServiceHub Backend

> “All local services in one smart platform.”

**MNA ServiceHub** is a role-based service booking platform (Admin, Manager, Service Provider, Job Candidate, Customer) where customers can discover and request local services. Managers assign service providers to requests based on their schedules, service providers complete the assigned tasks, and the Admin oversees and controls the entire system.

MNA ServiceHub acts as a centralized digital platform that enables all local service-related activities to be managed efficiently from a single place.

---

[![Backend Deployment](https://img.shields.io/badge/Deployment-Vercel-blue)](https://mna-servicehub-backend.vercel.app/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)](https://www.postgresql.org/)

## 🔗 Project Links

- **Live API Base URL:** [mna-servicehub-backend.vercel.app](https://mna-servicehub-backend.vercel.app/)
- **Frontend Live Link:** [mna-servicehub.vercel.app](https://mna-servicehub.vercel.app/)
- **Frontend Repository:** [MNA-ServiceHub Frontend](https://github.com/nurulazam-dev/mna-servicehub-frontend)

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

## 🔹 Authentication

```
Authorization: Bearer <JWT>
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

| Endpoint                          | Customer | SP  | Manager | Admin |
| --------------------------------- | -------- | --- | ------- | ----- |
| POST /apply                       | ✅       | ❌  | ❌      | ❌    |
| GET /my-service-requests          | ✅       | ❌  | ❌      | ❌    |
| GET /my-service-requests-sp       | ❌       | ✅  | ❌      | ❌    |
| GET /:id                          | ✅ (own) | ✅  | ✅      | ✅    |
| GET /                             | ❌       | ❌  | ✅      | ✅    |
| PATCH /cancel/:id                 | ✅       | ❌  | ❌      | ❌    |
| PATCH /update-status-cost/:id     | ❌       | ✅  | ❌      | ❌    |
| PATCH /update-service-request/:id | ❌       | ❌  | ✅      | ✅    |

---

# ⚠️ 5. Critical Constraints

- Cannot cancel after `ACCEPTED`
- Cannot update after payment
- Must assign provider + schedule when accepting
- Must provide reason when rejecting
- One service request cannot contain multiple services

---
