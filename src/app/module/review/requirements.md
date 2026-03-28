# ⭐ Review Module API Documentation:

## 🔹 Base URL

```
/api/v1/reviews
```

---

# 📌 Module Overview

The Review module allows customers to rate and review completed services.
It also maintains **dynamic rating aggregation** for both:

- Service
- Service Provider

---

# ⚙️ Core Business Rules

- A review can only be created if:
  - Service Request status = `COMPLETED`
  - Payment status = `PAID`

- One **Service Request = One Review only**
- Review creation updates:
  - Service average rating
  - Service Provider average rating

- Only **Admin** can delete reviews
- Public users can view reviews

---

# 1️⃣ Give Review

```yaml
POST /reviews/give-review
```

### 🔐 Access:

- Customer only

---

### 📝 Request Body:

```json
{
  "requestId": "uuid",
  "rating": 5,
  "comment": "Excellent service, very professional!"
}
```

---

### ⚙️ Validation:

- Uses: `createReviewZodSchema`

---

### ⚠️ Rules:

- Must be the **owner of the service request**
- Service must be **COMPLETED**
- Payment must be **PAID**
- Only **one review per request**
- `customerId` comes from auth (not request body)

---

### 🔄 Internal Processing:

- Create review
- Recalculate:
  - Service rating
  - Service Provider rating

---

### ✅ Response:

```json
{
  "success": true,
  "message": "Review submitted successfully and ratings updated",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent service"
  }
}
```

---

# 2️⃣ Get All Reviews (Public)

```yaml
GET /reviews
```

### 🔐 Access:

- Public

---

### 🔍 Query Params (optional):

```
?page=1
&limit=10
```

---

### ✅ Response:

```json
{
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "data": [
    {
      "rating": 5,
      "comment": "Great service",
      "customer": {
        "name": "John",
        "image": "url"
      },
      "service": {
        "name": "AC Repair"
      }
    }
  ]
}
```

---

# 3️⃣ Get Reviews By Service (Public)

```yaml
GET /reviews/service/{serviceId}
```

### 🔐 Access:

- Public

---

### 📌 Params:

```
serviceId: UUID
```

---

### 🔍 Query:

```
?page=1
&limit=10
```

---

### ✅ Response:

```json
{
  "success": true,
  "meta": { ... },
  "data": [
    {
      "rating": 4,
      "comment": "Good work",
      "customer": {
        "name": "Alex"
      },
      "serviceProvider": {
        "user": {
          "name": "Provider Name"
        }
      }
    }
  ]
}
```

---

# 4️⃣ Get My Reviews (Customer)

```yaml
GET /reviews/my-reviews
```

### 🔐 Access:

- Customer only

---

### 🔍 Query:

```
?page=1
&limit=10
```

---

### ✅ Response:

```json
{
  "success": true,
  "meta": { ... },
  "data": [
    {
      "rating": 5,
      "comment": "Amazing",
      "service": {
        "name": "Cleaning",
        "imageUrl": "url"
      },
      "serviceProvider": {
        "user": {
          "name": "Provider"
        }
      }
    }
  ]
}
```

---

# 5️⃣ Get My Reviews (Service Provider)

```yaml
GET /reviews/provider-reviews
```

### 🔐 Access:

- Service Provider only

---

### 🔍 Query:

```
?page=1
&limit=10
```

---

### ⚠️ Logic:

- Fetch reviews where:

  ```
  providerId = logged-in provider
  ```

---

### ✅ Response:

```json
{
  "success": true,
  "meta": { ... },
  "data": [
    {
      "rating": 3,
      "comment": "Okay service",
      "customer": {
        "name": "Client Name"
      },
      "service": {
        "name": "Plumbing"
      }
    }
  ]
}
```

---

# 6️⃣ Delete Review (Admin)

```yaml
DELETE /reviews/{id}
```

### 🔐 Access:

- Admin only

---

### 📌 Params:

```
id: UUID
```

---

### ⚠️ Rules:

- Hard delete (not soft delete)
- Automatically recalculates:
  - Service rating
  - Provider rating

---

### ✅ Response:

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": {
    "message": "Review deleted and ratings recalculated successfully"
  }
}
```

---

# 🔐 Authorization Matrix

| Endpoint                | Public | Customer | SP  | Admin |
| ----------------------- | ------ | -------- | --- | ----- |
| POST /give-review       | ❌     | ✅       | ❌  | ❌    |
| GET /                   | ✅     | ✅       | ✅  | ✅    |
| GET /service/:serviceId | ✅     | ✅       | ✅  | ✅    |
| GET /my-reviews         | ❌     | ✅       | ❌  | ❌    |
| GET /provider-reviews   | ❌     | ❌       | ✅  | ❌    |
| DELETE /:id             | ❌     | ❌       | ❌  | ✅    |

---

# ⚠️ Critical Backend Guidelines

### ✅ Review Creation Flow

1. Validate ownership
2. Check:
   - status = COMPLETED
   - paymentStatus = PAID

3. Prevent duplicate review
4. Create review (transaction)
5. Recalculate ratings:
   - Service
   - Provider

---

### ✅ Rating Calculation Formula

```ts
averageRating = totalRatingSum / totalReviews;
```

---

### ❗ Important Constraints

- One request → one review (`@unique`)
- Provider must exist (non-null in completed request)
- Use transaction for consistency

---
