# 🔧 URGENT: Database Migration Required

## ❌ Current Error
```
Error saving location details: Could not find the 'pickup_latitude' column of 'donations' in the schema cache
```

## ✅ Solution

### Step 1: Add Database Columns (REQUIRED - Do This First!)

1. Open your **Supabase Dashboard**: https://app.supabase.com
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste this exact SQL:

```sql
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS pickup_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS recipient_location_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS recipient_location_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_distance DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS estimated_travel_time INTEGER;

CREATE INDEX IF NOT EXISTS idx_donations_pickup_location 
ON donations(pickup_latitude, pickup_longitude);
```

5. Click **"Run"** or press **Ctrl+Enter** (Cmd+Enter on Mac)
6. You should see: **"Success. No rows returned"**

### Step 2: Verify in Supabase

1. Go to **"Table Editor"** → **"donations"** table
2. Scroll right to see the new columns:
   - ✅ pickup_latitude
   - ✅ pickup_longitude
   - ✅ recipient_location_lat
   - ✅ recipient_location_lng  
   - ✅ pickup_distance
   - ✅ estimated_travel_time

### Step 3: Test the Application

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Post a new donation** (e.g., "Veg Biryani")
   - Fill in all fields including:
     - Food name, type, quantity
     - Dietary type (Vegetarian/Non-Vegetarian/Vegan)
     - Spice level (Mild/Medium/Spicy)
     - Pickup address and location (GPS will be captured automatically)
     - Contact person and phone
3. **Login as recipient** and view the dashboard
4. Your donation should now appear with:
   - ✅ Distance from your location
   - ✅ Travel time estimate
   - ✅ Priority score (AI ranking)

---

## 📋 What Was Fixed

### 1. **Recipient Dashboard Now Shows Donations Without Location**
   - Before: Would show "No food posts available" if AI couldn't optimize
   - After: Shows ALL donations, with AI ranking when location data is available

### 2. **Location Data Now Saves Properly**
   - `LocationDetails.jsx` now captures your GPS coordinates
   - Saves `pickup_latitude` and `pickup_longitude` to database
   - Enables distance calculation and AI matching

### 3. **All Fields Display Correctly**
   - Food name, type, quantity ✅
   - Dietary type (Veg/Non-Veg/Vegan) ✅
   - Spice level (Mild/Medium/Spicy) ✅
   - Allergens ✅
   - Pickup address with all details ✅
   - Contact person and phone ✅
   - Preferred pickup time ✅
   - Pickup instructions ✅

### 4. **Map Shows Both Locations**
   - 🏪 Red marker: Donor location
   - 📍 Blue marker: Your location (recipient)
   - Dashed blue line: Route between locations
   - Distance in km
   - Travel time at 20 km/h

---

## 🔍 Testing Checklist

After running the SQL migration:

- [ ] SQL executed successfully in Supabase
- [ ] New columns visible in Table Editor
- [ ] Browser refreshed
- [ ] Post a new food donation (e.g., "Veg Biryani")
- [ ] Fill in:
  - [ ] Dietary type
  - [ ] Spice level
  - [ ] Pickup location (allow GPS access)
  - [ ] Contact details
- [ ] Click "Save" on location step
- [ ] Submit the donation
- [ ] Login as recipient
- [ ] See the donation on dashboard
- [ ] Click "View Details"
- [ ] See all fields: dietary info, spice level, pickup details
- [ ] See map with both locations
- [ ] See distance and travel time

---

## 🚨 If You Still See Issues

1. **Clear browser cache**: Ctrl+Shift+Delete (Chrome)
2. **Check browser console**: F12 → Console tab → Look for errors
3. **Verify SQL ran**: Go to Supabase Table Editor → donations → Check columns
4. **Check GPS permissions**: Allow location access when prompted
5. **Try incognito mode**: Test in a private/incognito window

---

## 📁 Files Modified

- ✅ `src/utils/nearestNeighborMatcher.js` - AI matching algorithm
- ✅ `src/pages/recipient-dashboard/index.jsx` - Shows all donations with/without AI
- ✅ `src/pages/food-details/FoodDetailsSimple.jsx` - Displays all fields correctly
- ✅ `src/pages/post-surplus-food/components/LocationDetails.jsx` - Saves GPS coordinates
- ✅ `src/utils/insertDonation.js` - Includes lat/lng in data mapping
- ✅ `backend/add_location_columns.sql` - Database migration script

The SQL file is located at: `/Users/bhushanrkaashyap/Desktop/data1/foodbridge/backend/add_location_columns.sql`
