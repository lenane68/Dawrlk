# Dawrlk - Database Schema (MongoDB) - MVP (Owner Managed)

## 1) users
Stores all app accounts (customer/owner/admin). Login by phone + OTP.

Fields:
- _id: ObjectId (PK)
- phone: string (unique, required)
- name: string
- role: "customer" | "owner" | "admin" (required)
- isVerified: boolean (default false)
- createdAt: Date
- lastLoginAt: Date

Indexes:
- users.phone UNIQUE


## 2) businesses
A business profile managed by an owner.

Fields:
- _id: ObjectId (PK)
- ownerId: ObjectId -> users._id (required)
- name: string (required)
- description: string
- city: string
- address: string
- location: { type: "Point", coordinates: [lng, lat] }  (required)
- status: "pending" | "approved" | "inactive" (default "approved" for MVP if you want)
- createdAt: Date
- updatedAt: Date

Indexes:
- businesses.ownerId
- businesses.location 2dsphere


## 3) services
Global catalog of services (Haircut, Makeup, Straightening...)

Fields:
- _id: ObjectId (PK)
- name: string (required)
- category: string
- isActive: boolean (default true)

Indexes:
- services.name


## 4) business_services
Connects a business with a service and sets price + duration (per business).
This solves: same service can be 30 min in one place and 90 min in another.

Fields:
- _id: ObjectId (PK)
- businessId: ObjectId -> businesses._id (required)
- serviceId: ObjectId -> services._id (required)
- price: number (required)
- currency: string (default "ILS")
- durationMin: number (required)  // 30, 60, 90...
- isActive: boolean (default true)

Indexes:
- business_services.businessId
- business_services.serviceId
- (businessId + serviceId) unique optional (if you want one config per service per business)


## 5) availability_windows
Owner defines availability for a specific business_service (days + hours).
We use windows, and later the app generates available start times.

Fields:
- _id: ObjectId (PK)
- businessServiceId: ObjectId -> business_services._id (required)
- dayOfWeek: number (0=Sunday ... 6=Saturday) (required)
- startTime: string ("HH:mm") (required)
- endTime: string ("HH:mm") (required)
- slotStepMin: number (default 15)  // for showing time options
- isActive: boolean (default true)
- createdAt: Date
- updatedAt: Date

Indexes:
- availability_windows.businessServiceId
- (businessServiceId + dayOfWeek)


## 6) bookings
The booking references businessServiceId (clean & consistent).
System calculates endDateTime using durationMin from business_services.

Fields:
- _id: ObjectId (PK)
- userId: ObjectId -> users._id (required)
- businessServiceId: ObjectId -> business_services._id (required)
- startDateTime: Date (required)
- endDateTime: Date (required)
- status: "pending" | "confirmed" | "canceled" | "completed" | "no_show" (default "confirmed" for MVP)
- createdAt: Date
- updatedAt: Date

Indexes:
- bookings.userId
- bookings.businessServiceId
- bookings.startDateTime
- (businessServiceId + startDateTime)


## 7) payments (Later / Optional in MVP)
If you add deposit later.

Fields:
- _id
- bookingId
- amount
- currency
- status
- provider
- providerRef
- createdAt


## 8) notifications (Optional in MVP)
In-app notifications / scheduled reminders.

Fields:
- _id
- bookingId
- type: "confirmation" | "reminder"
- scheduledFor: Date
- status: "pending" | "sent" | "failed"
- createdAt
