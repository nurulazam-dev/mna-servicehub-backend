# 📅 Service Schedule Module Documentation:

## 🔹 Base URL

```
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
POST /service-schedules/create-schedule
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
GET /service-schedules/my-schedules
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
GET /service-schedules/schedule-by-date
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
GET /service-schedules
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
GET /service-schedules/{id}
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

# 🧠 Implementation Notes (Recommended)

- Use **date-fns** for:
  - Time calculations
  - Date comparisons

- Suggested logic:
  - Convert `startTime` → Date object
  - Add 3 hours → `endTime`
  - Validate gap between existing schedules

---
