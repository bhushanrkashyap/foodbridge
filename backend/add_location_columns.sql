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

-- Add comment for documentation
COMMENT ON COLUMN donations.pickup_latitude IS 'Donor pickup location latitude (WGS84)';
COMMENT ON COLUMN donations.pickup_longitude IS 'Donor pickup location longitude (WGS84)';
COMMENT ON COLUMN donations.recipient_location_lat IS 'Recipient location latitude when accepted';
COMMENT ON COLUMN donations.recipient_location_lng IS 'Recipient location longitude when accepted';
COMMENT ON COLUMN donations.pickup_distance IS 'Calculated distance in kilometers';
COMMENT ON COLUMN donations.estimated_travel_time IS 'Estimated travel time in minutes';
