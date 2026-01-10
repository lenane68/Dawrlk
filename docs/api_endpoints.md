# Dawrlk - API Endpoints (MVP) - Owner Managed (1 booking at a time)

Base URL: /api

## Conventions
- Auth: JWT (after OTP verification)
- All dates: ISO 8601
- All times: "HH:mm"
- Roles: customer | owner | admin

---

# 1) Auth (Phone OTP)

## POST /auth/request-otp
Request:
{
  "phone": "+97250XXXXXXX"
}

Response:
{
  "success": true
}

Notes:
- Always respond success (avoid phone enumeration)
- OTP stored hashed server-side with expiry

## POST /auth/verify-otp
Request:
{
  "phone": "+97250XXXXXXX",
  "code": "123456",
  "name": "Mariam"   // only if first time (optional)
}

Response:
{
  "token": "<JWT>",
  "user": {
    "_id": "...",
    "phone": "...",
    "name": "...",
    "role": "customer"
  }
}

## GET /me
Headers: Authorization: Bearer <JWT>
Response:
{
  "_id": "...",
  "phone": "...",
  "name": "...",
  "role": "customer"
}

---

# 2) Public Discovery (Customer)

## GET /services
Response:
[
  { "_id": "...", "name": "Haircut", "category": "Hair" },
  { "_id": "...", "name": "Straightening", "category": "Hair" }
]

## GET /businesses/nearby
Query:
- serviceId (required)
- lat (required)
- lng (required)
- radiusKm (optional, default 10)

Example:
GET /businesses/nearby?serviceId=...&lat=32.08&lng=34.78&radiusKm=10

Response:
[
  {
    "businessId": "...",
    "name": "Salon X",
    "city": "...",
    "address": "...",
    "distanceKm": 1.2,
    "businessService": {
      "businessServiceId": "...",
      "serviceId": "...",
      "price": 120,
      "durationMin": 30
    }
  }
]

## GET /businesses/:businessId
Response:
{
  "business": {
    "_id": "...",
    "name": "...",
    "description": "...",
    "city": "...",
    "address": "...",
    "location": { "lat": 0, "lng": 0 }
  },
  "services": [
    {
      "businessServiceId": "...",
      "serviceId": "...",
      "serviceName": "Haircut",
      "price": 120,
      "durationMin": 30,
      "isActive": true
    }
  ]
}

---

# 3) Availability (Customer)

## GET /business-services/:businessServiceId/availability
Purpose: return available start times for a date (generated from windows + existing bookings)

Query:
- date (required) in YYYY-MM-DD

Example:
GET /business-services/:id/availability?date=2026-01-15

Response:
{
  "date": "2026-01-15",
  "durationMin": 30,
  "slotStepMin": 15,
  "availableStartTimes": ["16:00", "16:15", "16:30", "17:00"]
}

Rules:
- Use availability_windows for that businessServiceId and dayOfWeek
- Generate times from startTime to endTime (step = slotStepMin)
- Remove times that would overlap existing bookings
- One booking at a time (no parallel capacity)

---

# 4) Bookings (Customer)

## POST /bookings
Headers: Authorization: Bearer <JWT>
Request:
{
  "businessServiceId": "...",
  "date": "2026-01-15",
  "startTime": "16:30",
  "customerNote": "optional"
}

Response:
{
  "booking": {
    "_id": "...",
    "userId": "...",
    "businessServiceId": "...",
    "startDateTime": "2026-01-15T16:30:00.000Z",
    "endDateTime": "2026-01-15T17:00:00.000Z",
    "status": "confirmed"
  }
}

Validation:
- User must be customer
- businessServiceId must exist and be active
- Requested time must be in generated availability list
- Must not overlap any existing booking for same businessServiceId/business

## GET /bookings/my
Headers: Authorization: Bearer <JWT>
Response:
[
  {
    "_id": "...",
    "businessServiceId": "...",
    "startDateTime": "...",
    "endDateTime": "...",
    "status": "confirmed"
  }
]

## PATCH /bookings/:bookingId/cancel
Headers: Authorization: Bearer <JWT>
Request:
{
  "reason": "optional"
}

Response:
{
  "success": true
}

Notes:
- Cancellation policy (time limits) can be added later

---

# 5) Owner (Business Management)

## GET /owner/business
Headers: Authorization: Bearer <JWT> (role owner)
Response:
{
  "_id": "...",
  "name": "...",
  "description": "...",
  "city": "...",
  "address": "...",
  "location": { "lat": 0, "lng": 0 },
  "status": "approved"
}

## POST /owner/business
Create business (if not exists)
Request:
{
  "name": "...",
  "description": "...",
  "city": "...",
  "address": "...",
  "lat": 0,
  "lng": 0
}

Response:
{ "businessId": "..." }

## PATCH /owner/business
Update business profile
Request: (any fields)
Response: { "success": true }

---

# 6) Owner (Business Services)

## GET /owner/business-services
Response:
[
  {
    "businessServiceId": "...",
    "serviceId": "...",
    "serviceName": "Haircut",
    "price": 120,
    "durationMin": 30,
    "isActive": true
  }
]

## POST /owner/business-services
Request:
{
  "serviceId": "...",
  "price": 120,
  "durationMin": 30
}

Response:
{ "businessServiceId": "..." }

## PATCH /owner/business-services/:businessServiceId
Request:
{
  "price": 130,
  "durationMin": 40,
  "isActive": true
}

Response:
{ "success": true }

---

# 7) Owner (Availability Windows)

## GET /owner/availability-windows?businessServiceId=...
Response:
[
  {
    "_id": "...",
    "businessServiceId": "...",
    "dayOfWeek": 4,
    "startTime": "16:00",
    "endTime": "20:00",
    "slotStepMin": 15,
    "isActive": true
  }
]

## POST /owner/availability-windows
Request:
{
  "businessServiceId": "...",
  "dayOfWeek": 4,
  "startTime": "16:00",
  "endTime": "20:00",
  "slotStepMin": 15
}

Response:
{ "availabilityWindowId": "..." }

Validation:
- endTime > startTime
- businessServiceId belongs to owner's business

## PATCH /owner/availability-windows/:id
Request:
{
  "startTime": "15:00",
  "endTime": "19:00",
  "slotStepMin": 15,
  "isActive": true
}

Response:
{ "success": true }

## DELETE /owner/availability-windows/:id
Response:
{ "success": true }

---

# 8) Owner (Bookings)

## GET /owner/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD
Response:
[
  {
    "_id": "...",
    "startDateTime": "...",
    "endDateTime": "...",
    "status": "confirmed",
    "customer": { "name": "Mariam", "phone": "+972..." },
    "service": { "name": "Haircut", "durationMin": 30, "price": 120 }
  }
]

## PATCH /owner/bookings/:bookingId/status
Request:
{
  "status": "completed"   // or "canceled" / "no_show"
}

Response:
{ "success": true }
