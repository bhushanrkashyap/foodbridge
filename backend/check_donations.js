// Quick script to check donations in the database
// Run with: node check_donations.js

const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file if it exists
require('dotenv').config({ path: '../.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDonations() {
  console.log('🔍 Checking donations in database...\n');
  
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching donations:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No donations found in database');
      return;
    }

    console.log(`✅ Found ${data.length} total donations\n`);
    console.log('='*80);

    // Group by status
    const byStatus = {};
    data.forEach(d => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    });

    console.log('📊 By Status:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    console.log('');

    // Check location data
    const withLocation = data.filter(d => d.pickup_latitude && d.pickup_longitude);
    const withoutLocation = data.filter(d => !d.pickup_latitude || !d.pickup_longitude);

    console.log('📍 Location Data:');
    console.log(`   With GPS coordinates: ${withLocation.length}`);
    console.log(`   Without GPS coordinates: ${withoutLocation.length}`);
    console.log('');

    // Show successful donations with details
    const successful = data.filter(d => d.status === 'successful');
    
    if (successful.length > 0) {
      console.log(`✅ Successful Donations (${successful.length}):\n`);
      console.log('='*80);
      
      successful.forEach((d, idx) => {
        console.log(`\n${idx + 1}. ${d.food_name || 'Unnamed Food'} (ID: ${d.id})`);
        console.log(`   Type: ${d.food_type || 'N/A'}`);
        console.log(`   Quantity: ${d.quantity || 0} ${d.unit || 'servings'}`);
        console.log(`   Dietary: ${d.dietary_type || 'N/A'}`);
        console.log(`   Spice: ${d.spice_level || 'N/A'}`);
        console.log(`   Location: ${d.pickup_city || 'N/A'}, ${d.pickup_state || 'N/A'}`);
        console.log(`   Address: ${d.pickup_street_address || 'N/A'}`);
        console.log(`   Pin Code: ${d.pickup_pin_code || 'N/A'}`);
        console.log(`   GPS: ${d.pickup_latitude ? `${d.pickup_latitude}, ${d.pickup_longitude}` : '❌ Not available'}`);
        console.log(`   Contact: ${d.contact_person_name || d.contact_person || 'N/A'} - ${d.contact_phone || 'N/A'}`);
        console.log(`   Posted: ${d.created_at ? new Date(d.created_at).toLocaleString() : 'N/A'}`);
        console.log(`   Expires: ${d.expiry_datetime ? new Date(d.expiry_datetime).toLocaleString() : 'N/A'}`);
      });
      
      console.log('\n' + '='*80);
    } else {
      console.log('⚠️ No successful donations found');
      console.log('   Donations need status="successful" to appear on recipient dashboard');
    }

    // Show donations without location
    if (withoutLocation.length > 0) {
      console.log(`\n📍 Donations Missing GPS Coordinates (${withoutLocation.length}):\n`);
      withoutLocation.forEach(d => {
        console.log(`   • ${d.food_name || 'Unnamed'} (ID: ${d.id}) - ${d.status}`);
        console.log(`     Address: ${d.pickup_street_address || 'N/A'}, ${d.pickup_city || 'N/A'}, ${d.pickup_pin_code || 'N/A'}`);
      });
      console.log('\n💡 Tip: These donations will show on dashboard but without distance calculations');
      console.log('   To fix: Re-post these donations with GPS location enabled\n');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkDonations();
