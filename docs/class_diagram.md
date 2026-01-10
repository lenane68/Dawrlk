classDiagram
direction LR

class User {
  +ObjectId id
  +string phone
  +string name
  +UserRole role
  +bool isVerified
  +Date createdAt
  +Date lastLoginAt
}

class Business {
  +ObjectId id
  +ObjectId ownerId
  +string name
  +string description
  +BusinessStatus status
  +string city
  +string address
  +float lat
  +float lng
  +string[] categories
  +Date createdAt
  +Date updatedAt
}

class Service {
  +ObjectId id
  +string name
  +string description
  +string iconKey
  +bool isActive
}

class BusinessService {
  +ObjectId id
  +ObjectId businessId
  +ObjectId serviceId
  +int durationMin
  +decimal price
  +string currency
  +bool isActive
  +string notes
}

class AvailabilityWindow {
  +ObjectId id
  +ObjectId businessServiceId
  +DayOfWeek dayOfWeek
  +string startTime  "HH:mm"
  +string endTime    "HH:mm"
  +int slotStepMin   "e.g., 15"
  +Date createdAt
  +Date updatedAt
}

class Booking {
  +ObjectId id
  +ObjectId userId
  +ObjectId businessServiceId
  +Date startDateTime
  +Date endDateTime
  +BookingStatus status
  +string customerNote
  +Date createdAt
  +Date updatedAt
}

class Payment {
  +ObjectId id
  +ObjectId bookingId
  +PaymentProvider provider
  +decimal amount
  +string currency
  +PaymentStatus status
  +string providerRef
  +Date paidAt
  +Date createdAt
}

class Notification {
  +ObjectId id
  +ObjectId bookingId
  +NotificationType type
  +Channel channel
  +Date scheduledFor
  +Date sentAt
  +NotificationStatus status
  +int attemptCount
  +string lastError
  +Date createdAt
}

class Review {
  +ObjectId id
  +ObjectId bookingId
  +ObjectId businessId
  +ObjectId userId
  +int rating  "1..5"
  +string comment
  +Date createdAt
}

class UserRole {
  <<enumeration>>
  USER
  OWNER
  ADMIN
}

class BusinessStatus {
  <<enumeration>>
  PENDING
  APPROVED
  SUSPENDED
}

class BookingStatus {
  <<enumeration>>
  PENDING
  CONFIRMED
  COMPLETED
  CANCELED
  NO_SHOW
}

class PaymentStatus {
  <<enumeration>>
  UNPAID
  AUTHORIZED
  PAID
  REFUNDED
  FAILED
}

class PaymentProvider {
  <<enumeration>>
  CARD
  PAYPAL
  OTHER
}

class NotificationType {
  <<enumeration>>
  CONFIRMATION
  REMINDER_1D
  REMINDER_2H
  REMINDER_10M
}

class NotificationStatus {
  <<enumeration>>
  PENDING
  SENT
  FAILED
  CANCELED
}

class Channel {
  <<enumeration>>
  SMS
  WHATSAPP
  PUSH
}

class DayOfWeek {
  <<enumeration>>
  SUNDAY
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
}

%% العلاقات
User "1" --> "0..*" Booking : books
User "1" --> "0..*" Business : owns (if OWNER)
Business "1" --> "0..*" BusinessService : offers
Service "1" --> "0..*" BusinessService : configured as
BusinessService "1" --> "0..*" AvailabilityWindow : available in
BusinessService "1" --> "0..*" Booking : booked as
Booking "1" --> "0..1" Payment : deposit/payment
Booking "1" --> "0..*" Notification : reminders
Booking "1" --> "0..1" Review : review
Business "1" --> "0..*" Review : receives
User "1" --> "0..*" Review : writes
