# 📋 Service Request Module Requirements

## 1. Create Service Request

A logged-in **Customer** can create a service request.

- A customer can request **only one service at a time**
- Multiple services in a single request are **not allowed**
- The request will be created with default status: **PENDING**

---

## 2. Get My Service Requests (Customer)

A logged-in **Customer** can view all of their own service requests.

- Only requests created by the customer will be visible
- Data will be shown in a list/table format

---

## 3. Get My Service Requests (Service Provider)

A logged-in **Service Provider (SP)** can view all service requests assigned to them.

- Only requests **appended/assigned** to that provider will be visible
- Includes schedule-based assigned requests

---

## 4. Get Service Request by ID

Access control:

- A **Customer** can view only their own service request by ID
- **Admin**, **Manager**, and **Service Provider** can view any service request by ID

---

## 5. Get All Service Requests

Only **Admin** or **Manager** can view all service requests.

- Supports filtering, pagination, and search (recommended)

---

## 6. Cancel Service Request (Customer)

A **Customer** can cancel (soft delete) their own service request.

Conditions:

- Request must belong to the customer
- Status must be **PENDING**
- Once accepted or processed, cancellation is **not allowed**

---

## 7. Update Service Request (Service Provider)

A **Service Provider** can update only the service requests assigned to them.

### Permissions:

- Can view assigned service request details
- Can update:
  - Status (e.g., IN_PROGRESS → COMPLETED)
  - Cost breakdown:
    - Service Charge
    - Product Cost
    - Additional Cost

### Restrictions:

- Must be assigned via **schedule or manager/admin**
- Cannot update requests not assigned to them
- ❌ Cannot update anything after **payment is completed**

### Completion Rule:

- When work is finished:
  - Status must be updated to **COMPLETED**
  - All service-related costs must be added

---

## 8. Update Service Request (Admin / Manager)

An **Admin** or **Manager** can manage service requests.

### Actions:

#### ✔ Accept Request

- Assign a **Service Provider (SP)**

- Assign an **available schedule**

- Must verify:
  - Service matches provider expertise
  - Schedule is available

- After assignment:
  - Send email to customer with:
    - Service details
    - Provider details

---

#### ❌ Reject Request

- Must provide a **rejection reason**
- Reason will be visible to the customer

---

# ✅ Summary of Rules

- One request = one service
- Only owner can cancel (if pending)
- SP can update only assigned requests
- No updates allowed after payment
- Admin/Manager controls assignment & approval
- Rejection must include a reason

---

# 📘 Service Request API

## 🔹 Base URL

```
/api/v1/service-requests
```

---

# 1️⃣ Create Service Request

```yaml
POST /service-requests/apply
```

### 🔐 Access:

- Customer only

### 📝 Request Body:

```json
{
  "serviceId": "uuid",
  "serviceDescription": "Fix my AC urgently",
  "serviceAddress": "Dhaka, Bangladesh",
  "activePhone": "017XXXXXXXX"
}
```

### ⚙️ Validation:

- Uses: `createServiceRequestZodSchema`

### ✅ Response:

```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": { ... }
}
```

---

# 2️⃣ Get My Service Requests (Customer)

```yaml
GET /service-requests/my-service-requests
```

### 🔐 Access:

- Customer only

### ✅ Response:

```json
{
  "success": true,
  "data": [ ... ]
}
```

---

# 3️⃣ Get My Service Requests (Service Provider)

```yaml
GET /service-requests/my-service-requests-sp
```

### 🔐 Access:

- Service Provider only

### ✅ Response:

```json
{
  "success": true,
  "data": [ ... ]
}
```

---

# 4️⃣ Get Service Request by ID

```yaml
GET /service-requests/{id}
```

### 🔐 Access:

- Admin
- Manager
- Service Provider
- Customer (own only)

### 📌 Params:

```
id: string (UUID)
```

### ✅ Response:

```json
{
  "success": true,
  "data": { ... }
}
```

---

# 5️⃣ Get All Service Requests

```yaml
GET /service-requests
```

### 🔐 Access:

- Admin / Manager

### 🔍 Query (optional):

```
?page=1
&limit=10
&status=PENDING
```

### ✅ Response:

```json
{
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  },
  "data": [ ... ]
}
```

---

# 6️⃣ Cancel Service Request

```yaml
PATCH /service-requests/cancel/{id}
```

### 🔐 Access:

- Customer only

### ⚠️ Rules:

- Only own request
- Only if status = `PENDING`
- Performs soft delete

### ✅ Response:

```json
{
  "success": true,
  "message": "Service request cancelled successfully"
}
```

---

# 7️⃣ Update Service Request (Service Provider)

```yaml
PATCH /service-requests/update-status-cost/{id}
```

### 🔐 Access:

- Service Provider only

### ⚙️ Validation:

- Uses: `updateServiceCostZodSchema`

### 📝 Request Body:

```json
{
  "serviceCharge": 500,
  "productCost": 200,
  "additionalCost": 100
}
```

### ⚠️ Rules:

- Only assigned service requests
- Cannot update after payment
- Used when completing service

### ✅ Response:

```json
{
  "success": true,
  "message": "Service request updated successfully"
}
```

---

# 8️⃣ Update Service Request (Admin / Manager)

```yaml
PATCH /service-requests/update-service-request/{id}
```

### 🔐 Access:

- Admin / Manager

### ⚙️ Validation:

- Uses: `updateServiceRequestByManagementZodSchema`

---

## ✔ Accept Request

### 📝 Request Body:

```json
{
  "status": "ACCEPTED",
  "providerId": "uuid",
  "scheduleId": "uuid"
}
```

### ⚠️ Rules:

- Provider must match service
- Schedule must be available
- Assigns SP + schedule
- Triggers email notification to customer

---

## ❌ Reject Request

### 📝 Request Body:

```json
{
  "status": "REJECTED",
  "rejectionReason": "Invalid request details"
}
```

### ⚠️ Rules:

- Rejection reason is required

---

### ✅ Response:

```json
{
  "success": true,
  "message": "Service request updated successfully"
}
```

---

# 🔐 Authorization Matrix

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

# ⚠️ Critical Business Rules

- Customer can cancel only when status = `PENDING`
- Service Provider cannot update after payment
- Admin/Manager must assign provider + schedule when accepting
- Rejection must include reason
- One service request = one service

---
