# Dawrlk - MVP Definition

## Goal
Enable customers to discover nearby services and book an appointment without calling, while allowing business owners to publish services and manage availability.

## MVP Scope

### Customer (User)
- Sign in with phone number (OTP)
- Search / browse a service
- View nearby businesses offering that service (sorted by distance)
- Open business details (services, price, duration)
- View available times for a chosen service
- Book an appointment

### Business Owner (Owner)
- Create / manage business profile
- Add services with:
  - price
  - duration (per business)
- Define availability (days + hours)
- View upcoming bookings

### System (Rules)
- Prevent overlapping bookings
- Calculate booking end time based on selected service duration (from BusinessService)
- Send booking confirmation (in-app, later SMS/WhatsApp)

## Out of Scope (Later)
- Online payments (deposit)
- Reviews & ratings
- Promotions / coupons
- Chat
- Multi-branch businesses
- Advanced reminders (day before / 2h / 10m) — later
