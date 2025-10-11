import { supabase } from '../supabaseClient';

/**
 * Calculate great circle distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Calculate urgency score based on time until expiry
 * @param {string} expiryDateTime - Expiry datetime string
 * @returns {number} Urgency score (0-100, higher = more urgent)
 */
function calculateUrgencyScore(expiryDateTime) {
  const now = new Date();
  const expiry = new Date(expiryDateTime);
  const timeUntilExpiryMinutes = Math.floor((expiry - now) / 1000 / 60);
  
  if (timeUntilExpiryMinutes <= 0) return 100; // Already expired
  if (timeUntilExpiryMinutes <= 60) return 90; // Less than 1 hour
  if (timeUntilExpiryMinutes <= 180) return 70; // Less than 3 hours
  if (timeUntilExpiryMinutes <= 360) return 50; // Less than 6 hours
  if (timeUntilExpiryMinutes <= 720) return 30; // Less than 12 hours
  if (timeUntilExpiryMinutes <= 1440) return 10; // Less than 24 hours
  return 0; // More than 24 hours
}

/**
 * Calculate delivery feasibility and travel time
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} expiryDateTime - Expiry datetime string
 * @returns {object} Feasibility data
 */
function calculateFeasibility(distanceKm, expiryDateTime) {
  const averageSpeedKMH = 20; // km/h
  const travelTimeHours = distanceKm / averageSpeedKMH;
  const travelTimeMinutes = Math.ceil(travelTimeHours * 60);
  
  const now = new Date();
  const expiry = new Date(expiryDateTime);
  const timeUntilExpiryMinutes = Math.floor((expiry - now) / 1000 / 60);
  
  return {
    distanceKm: distanceKm.toFixed(2),
    travelTimeMinutes,
    timeUntilExpiryMinutes,
    isFeasible: travelTimeMinutes < timeUntilExpiryMinutes
  };
}

/**
 * Geocode an address to get coordinates using Nominatim
 * @param {object} donation - Donation object with address fields
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
async function geocodeAddress(donation) {
  const address = `${donation.pickup_street_address}, ${donation.pickup_area || ''}, ${donation.pickup_city}, ${donation.pickup_state}, ${donation.pickup_pin_code}`;
  
  try {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      
      // Update the database with geocoded coordinates
      await supabase
        .from('donations')
        .update({ 
          pickup_latitude: coords.lat,
          pickup_longitude: coords.lng
        })
        .eq('id', donation.id);
      
      return coords;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  return null;
}

/**
 * Nearest Neighbor Matching Algorithm
 * Ranks donations based on distance and expiry urgency
 * @param {object} recipientLocation - {lat, lng} of recipient
 * @param {string} strategy - 'balanced' (default), 'distance', or 'urgency'
 * @returns {Promise<Array>} Sorted array of donations with priority scores
 */
export async function findOptimalDonations(recipientLocation, strategy = 'balanced') {
  if (!recipientLocation || !recipientLocation.lat || !recipientLocation.lng) {
    console.error('Recipient location not available');
    return [];
  }

  console.log('🔍 Starting Nearest Neighbor Optimization...');
  console.log(`Strategy: ${strategy.toUpperCase()}`);
  console.log('Recipient Location:', recipientLocation);

  // Fetch all available donations
  const { data: donations, error } = await supabase
    .from('donations')
    .select('*')
    .eq('status', 'successful')
    .order('created_at', { ascending: false });

  console.log('📊 Supabase Query Results:');
  console.log('  - Error:', error);
  console.log('  - Data:', donations);
  console.log('  - Count:', donations?.length || 0);

  if (error) {
    console.error('❌ Error fetching donations:', error);
    return [];
  }

  if (!donations || donations.length === 0) {
    console.log('⚠️ No available donations found in database');
    return [];
  }

  console.log(`✅ Found ${donations.length} available donations in database`);

  // Process each donation and calculate priority
  const rankedDonations = await Promise.all(
    donations.map(async (donation) => {
      let donorLat = donation.pickup_latitude;
      let donorLng = donation.pickup_longitude;

      console.log(`\n🔍 Processing donation #${donation.id}: ${donation.food_name}`);
      console.log(`   Raw coordinates: lat=${donorLat}, lng=${donorLng}`);

      // Validate coordinates are numbers
      if (donorLat !== null && donorLng !== null) {
        donorLat = parseFloat(donorLat);
        donorLng = parseFloat(donorLng);
        
        // Check if coordinates are valid numbers
        if (isNaN(donorLat) || isNaN(donorLng)) {
          console.warn(`   ⚠️ Invalid coordinates (NaN), setting to null`);
          donorLat = null;
          donorLng = null;
        } else {
          console.log(`   ✅ Valid coordinates: lat=${donorLat}, lng=${donorLng}`);
        }
      }

      // If coordinates missing, try geocoding (but don't fail if it doesn't work)
      if (!donorLat || !donorLng) {
        console.log(`   ⚠️ Missing coordinates, attempting geocode...`);
        
        // Only geocode if we have a complete address
        if (donation.pickup_street_address && donation.pickup_city && donation.pickup_pin_code) {
          const coords = await geocodeAddress(donation);
          if (coords) {
            donorLat = coords.lat;
            donorLng = coords.lng;
            console.log(`   ✅ Successfully geocoded: lat=${donorLat}, lng=${donorLng}`);
          } else {
            console.warn(`   ⚠️ Geocoding failed, will show without distance data`);
          }
        } else {
          console.warn(`   ⚠️ Incomplete address, cannot geocode`);
          console.log(`   Address: ${donation.pickup_street_address || 'N/A'}, ${donation.pickup_city || 'N/A'}, ${donation.pickup_pin_code || 'N/A'}`);
        }
      }

      // If we still don't have coordinates, return the donation without distance data
      if (!donorLat || !donorLng || isNaN(donorLat) || isNaN(donorLng)) {
        console.log(`   📦 Returning donation without location data`);
        return {
          ...donation,
          distance: null,
          urgencyScore: calculateUrgencyScore(donation.expiry_datetime),
          priorityScore: null,
          feasibility: null,
          donorLocation: null,
          recipientLocation: {
            lat: recipientLocation.lat,
            lng: recipientLocation.lng
          }
        };
      }

      // Calculate distance
      const distance = calculateDistance(
        recipientLocation.lat,
        recipientLocation.lng,
        donorLat,
        donorLng
      );

      console.log(`   📏 Calculated distance: ${distance.toFixed(2)} km`);

      // Calculate urgency score
      const urgencyScore = calculateUrgencyScore(donation.expiry_datetime);
      console.log(`   ⏰ Urgency score: ${urgencyScore}`);

      // Calculate feasibility
      const feasibility = calculateFeasibility(distance, donation.expiry_datetime);
      console.log(`   ✅ Feasibility: ${feasibility.isFeasible ? 'YES' : 'NO'} (${feasibility.travelTimeMinutes} min travel, ${feasibility.timeUntilExpiryMinutes} min left)`);

      // Calculate overall priority score based on strategy
      let priorityScore;
      
      if (strategy === 'distance') {
        // Distance-first: Closer = higher priority
        priorityScore = (1 / (distance + 0.1)) * 40;
        console.log(`   📍 Strategy: DISTANCE-FIRST`);
        
      } else if (strategy === 'urgency') {
        // Urgency-first: More urgent = higher priority
        priorityScore = urgencyScore;
        console.log(`   ⏰ Strategy: URGENCY-FIRST`);
        
      } else {
        // Balanced (default): Distance (40%) + Urgency (60%)
        const distanceScore = (1 / (distance + 0.1)) * 40;
        priorityScore = (urgencyScore * 0.6) + (distanceScore * 0.4);
        console.log(`   ⚖️ Strategy: BALANCED`);
      }

      console.log(`   ⭐ Priority score: ${priorityScore.toFixed(2)}`);

      return {
        ...donation,
        distance: parseFloat(distance.toFixed(2)),
        urgencyScore,
        priorityScore: parseFloat(priorityScore.toFixed(2)),
        feasibility,
        donorLocation: {
          lat: donorLat,
          lng: donorLng
        },
        recipientLocation: {
          lat: recipientLocation.lat,
          lng: recipientLocation.lng
        }
      };
    })
  );

  // Filter out null values and sort by priority score
  // Include donations without feasibility data (will be shown at the end)
  const validDonations = rankedDonations
    .filter(d => d !== null)
    .sort((a, b) => {
      // Prioritize donations with location data first
      if (a.priorityScore !== null && b.priorityScore === null) return -1;
      if (a.priorityScore === null && b.priorityScore !== null) return 1;
      if (a.priorityScore === null && b.priorityScore === null) return 0;
      
      // Sort based on strategy
      if (strategy === 'distance') {
        // Distance-first: Higher priority score (closer) wins
        // Tie-breaker: If equal priority, prefer more urgent
        if (Math.abs(a.priorityScore - b.priorityScore) < 0.01) {
          return b.urgencyScore - a.urgencyScore;
        }
        return b.priorityScore - a.priorityScore;
        
      } else if (strategy === 'urgency') {
        // Urgency-first: Higher priority score (more urgent) wins
        // Tie-breaker: If equal priority, prefer closer
        if (Math.abs(a.priorityScore - b.priorityScore) < 0.01) {
          return a.distance - b.distance;
        }
        return b.priorityScore - a.priorityScore;
        
      } else {
        // Balanced: Use combined priority score
        // Prioritize feasible ones first
        if (a.feasibility && b.feasibility) {
          if (a.feasibility.isFeasible && !b.feasibility.isFeasible) return -1;
          if (!a.feasibility.isFeasible && b.feasibility.isFeasible) return 1;
        }
        
        // Then sort by priority score (higher is better)
        return b.priorityScore - a.priorityScore;
      }
    });

  console.log('✅ Optimization Complete!');
  console.log(`Ranked ${validDonations.length} donations (including ${validDonations.filter(d => d.priorityScore === null).length} without location data)`);
  
  // Log top results
  const withLocation = validDonations.filter(d => d.priorityScore !== null);
  if (withLocation.length > 0) {
    console.log('\n🏆 Top 3 Priority Donations:');
    withLocation.slice(0, 3).forEach((d, idx) => {
      console.log(`${idx + 1}. ${d.food_name}`);
      console.log(`   Distance: ${d.distance} km`);
      console.log(`   Travel Time: ${d.feasibility.travelTimeMinutes} min`);
      console.log(`   Expiry in: ${d.feasibility.timeUntilExpiryMinutes} min`);
      console.log(`   Priority Score: ${d.priorityScore}`);
      console.log('---');
    });
  }
  
  const withoutLocation = validDonations.filter(d => d.priorityScore === null);
  if (withoutLocation.length > 0) {
    console.log(`\n📋 ${withoutLocation.length} donation(s) shown without location data (add GPS to location step)`);
  }

  return validDonations;
}

/**
 * Get single donation with distance and feasibility info
 * @param {string} donationId - Donation ID
 * @param {object} recipientLocation - {lat, lng} of recipient
 * @returns {Promise<object|null>} Donation with calculated data
 */
export async function getDonationWithDistance(donationId, recipientLocation) {
  const { data: donation, error } = await supabase
    .from('donations')
    .select('*')
    .eq('id', donationId)
    .single();

  if (error || !donation) {
    console.error('Error fetching donation:', error);
    return null;
  }

  let donorLat = donation.pickup_latitude;
  let donorLng = donation.pickup_longitude;

  // Geocode if needed
  if (!donorLat || !donorLng) {
    const coords = await geocodeAddress(donation);
    if (coords) {
      donorLat = coords.lat;
      donorLng = coords.lng;
    } else {
      return null;
    }
  }

  // Calculate distance
  const distance = calculateDistance(
    recipientLocation.lat,
    recipientLocation.lng,
    donorLat,
    donorLng
  );

  const feasibility = calculateFeasibility(distance, donation.expiry_datetime);

  return {
    ...donation,
    distance: parseFloat(distance.toFixed(2)),
    feasibility,
    donorLocation: {
      lat: donorLat,
      lng: donorLng
    },
    recipientLocation: {
      lat: recipientLocation.lat,
      lng: recipientLocation.lng
    }
  };
}
