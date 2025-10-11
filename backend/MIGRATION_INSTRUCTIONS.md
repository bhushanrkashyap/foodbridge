# Database Migration Instructions

## ⚠️ IMPORTANT: Add Location Columns to Supabase

You need to add location columns to your `donations` table in Supabase.

### Method 1: Using Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste this SQL**

```sql
-- Add latitude and longitude columns to donations table for donor location
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS pickup_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_longitude DOUBLE PRECISION;

-- Add recipient location columns for when donation is accepted
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS recipient_location_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS recipient_location_lng DOUBLE PRECISION;

-- Add calculated fields for optimization
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS pickup_distance DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS estimated_travel_time INTEGER;

-- Create index for geospatial queries (optional but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_donations_pickup_location 
ON donations(pickup_latitude, pickup_longitude);
```

4. **Run the Query**
   - Click "Run" button or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
   - You should see: "Success. No rows returned"

5. **Verify the Changes**
   - Go to "Table Editor" in the left sidebar
   - Select "donations" table
   - You should see the new columns:
     - pickup_latitude
     - pickup_longitude
     - recipient_location_lat
     - recipient_location_lng
     - pickup_distance
     - estimated_travel_time

### Method 2: Using Supabase CLI (if installed)

```bash
cd backend
supabase db execute < add_location_columns.sql
```

## After Running the Migration

1. **Refresh your application** in the browser
2. **Post a new donation** - The location will now be saved automatically
3. **View the donation** as a recipient - You should see:
   - Distance calculation
   - Travel time
   - Map with both locations
   - All pickup details including spice level, dietary info, etc.

## What This Does

- Adds GPS coordinates storage for donor locations
- Adds recipient location when they accept a donation
- Adds distance and travel time calculations
- Creates database index for faster location queries
- Enables the AI nearest neighbor matching algorithm

## Troubleshooting

If you still see errors after running the SQL:
1. Make sure you're logged into the correct Supabase project
2. Check that the SQL ran without errors
3. Refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear the browser cache if needed
