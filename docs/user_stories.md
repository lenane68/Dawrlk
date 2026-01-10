# Dawrlk - User Stories (MVP)

## Customer Stories

### US-1: Login with phone (OTP)
As a customer, I want to log in with my phone number so I can use the app quickly without email/password.
Acceptance Criteria:
- User enters phone number
- Receives OTP code
- Enters OTP and gets logged in
- If OTP wrong/expired → show error and allow retry

### US-2: Search for a service
As a customer, I want to search for a service (e.g., Haircut) so I can find businesses that offer it.
Acceptance Criteria:
- Search by typing or selecting a service category
- Results show businesses that provide the chosen service

### US-3: View nearby businesses sorted by distance
As a customer, I want to see businesses ordered from nearest to farthest so I can pick the closest option.
Acceptance Criteria:
- Requires location permission or manual area selection
- List is sorted by distance (ascending)

### US-4: View business service details
As a customer, I want to view service price and duration so I know what I’m booking.
Acceptance Criteria:
- Business page shows services list
- Each service shows price + duration (duration is business-specific)

### US-5: View available times for a selected service
As a customer, I want to see available times for a service so I can choose a suitable appointment.
Acceptance Criteria:
- Availability is shown for selected date
- Only times within owner availability windows
- Times that overlap with existing bookings are not shown

### US-6: Book an appointment
As a customer, I want to book a time slot so I can secure an appointment without calling.
Acceptance Criteria:
- User selects time and confirms booking
- System prevents double booking (no overlaps)
- Booking created with start_datetime and end_datetime
- User sees confirmation screen/message


## Owner Stories

### OS-1: Create/manage business profile
As an owner, I want to create my business profile so customers can find me.
Acceptance Criteria:
- Business has name + address + location (lat/lng)
- Business status can be Pending/Approved (admin later)

### OS-2: Add services with price + duration
As an owner, I want to add services with my own price and duration so bookings reflect my real timing.
Acceptance Criteria:
- Owner can add a service (BusinessService)
- Each has: serviceId + price + durationMin
- Same service can have different duration in another business

### OS-3: Set availability (days + hours)
As an owner, I want to define availability windows so customers can only book when I’m open.
Acceptance Criteria:
- Owner selects day of week + start/end time
- System blocks invalid windows (end <= start)
- Availability is linked to businessServiceId (service-specific availability)

### OS-4: View upcoming bookings
As an owner, I want to see upcoming bookings so I can manage my day.
Acceptance Criteria:
- List bookings by date range
- Show customer phone/name (as allowed) + service + time
- Booking status visible (confirmed/canceled)


## System Rules (MVP)

### SR-1: Prevent overlaps
- A booking cannot overlap another booking for the same business.
- If overlap → reject with clear message.

### SR-2: Calculate end time
- end_datetime = start_datetime + durationMin (from BusinessService)

### SR-3: Confirmation
- After booking creation → create confirmation notification (in-app)
