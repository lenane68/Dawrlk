# Dawrlk - Availability Algorithm (MVP)
Owner Managed Availability + One booking at a time

## Goal
Given:
- businessServiceId
- date (YYYY-MM-DD)

Return:
- availableStartTimes ["HH:mm", ...]
So the customer can pick a start time that:
1) falls inside owner's availability windows for that day
2) does NOT overlap any existing booking
3) respects service durationMin

---

## Inputs
- businessServiceId
- date (YYYY-MM-DD)

## Data Sources
- business_services.durationMin
- availability_windows for businessServiceId and dayOfWeek
- bookings for businessServiceId within the same date

---

## Definitions
- durationMin: service duration in minutes (from business_services)
- slotStepMin: step for generating start times (from availability_windows, default 15)
- availability window: [startTime, endTime) in HH:mm
- candidate slot: a possible booking start time

---

## Core Rule (No Overlap)
A candidate booking [candidateStart, candidateEnd) is valid if it does NOT overlap any existing booking [bStart, bEnd):

Overlap exists if:
candidateStart < bEnd AND candidateEnd > bStart

Valid if NOT(overlap).

---

## Algorithm (High Level)

### Step 1: Load duration
- Fetch business_services by _id = businessServiceId
- durationMin = business_services.durationMin

### Step 2: Determine dayOfWeek
- Convert date to dayOfWeek (0=Sunday..6=Saturday)

### Step 3: Load windows
- Fetch availability_windows where:
  - businessServiceId = given id
  - dayOfWeek = computed
  - isActive = true

If no windows → return empty list.

### Step 4: Load bookings for that date
- Fetch bookings where:
  - businessServiceId = given id
  - status in ["confirmed","pending"] (ignore canceled/completed)
  - startDateTime >= dateStart
  - startDateTime < dateEnd

Convert each booking into minutes-from-midnight:
- bStartMin = HH*60 + MM
- bEndMin   = HH*60 + MM

### Step 5: Generate candidate start times per window
For each availability window:
- windowStartMin = toMinutes(startTime)
- windowEndMin   = toMinutes(endTime)

Generate candidateStartMin:
- for t = windowStartMin; t + durationMin <= windowEndMin; t += slotStepMin

candidateEndMin = t + durationMin

### Step 6: Filter out overlapping times
For each candidate [t, t+durationMin):
- if overlaps ANY existing booking interval → reject
- else keep

### Step 7: Output formatting
Convert candidateStartMin back to "HH:mm" and return sorted list.

---

## Notes / Edge Cases

### 1) Multiple availability windows in same day
Example:
- 09:00-12:00 and 14:00-18:00
Generate candidates for both, merge results, sort, remove duplicates.

### 2) slotStepMin vs durationMin
- slotStepMin can be 15 even if durationMin is 30 or 90.
- This means user may start at 10:00, 10:15, 10:30 ...
- It is valid as long as booking end time fits before windowEnd and no overlap.

### 3) Preventing "gaps" (Optional - Later)
In MVP we do NOT force customers to pick contiguous times.
We can later add a rule like:
- prefer nearest time
- or block large gaps
But MVP focuses on correctness and simplicity.

### 4) Timezone
- Store DateTime in UTC in DB
- Convert input date/time using business timezone when generating dateStart/dateEnd.
(For Israel, typically Asia/Jerusalem)

---

## Example
Service durationMin = 30
Window: 16:00-18:00
slotStepMin = 15
Bookings:
- 16:30-17:00

Candidates:
16:00-16:30 ✅
16:15-16:45 ❌ overlaps (16:30-17:00)
16:30-17:00 ❌ overlaps
16:45-17:15 ❌ overlaps
17:00-17:30 ✅
17:15-17:45 ✅
17:30-18:00 ✅

Output:
["16:00","17:00","17:15","17:30"]
