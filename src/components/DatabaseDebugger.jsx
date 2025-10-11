import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Silent Debug component - logs to console only, no UI
 * Automatically checks database on mount
 */
const DatabaseDebugger = () => {
  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        console.log('='.repeat(60));
        console.log('🔍 DATABASE DEBUGGER - Fetching all donations...');
        console.log('='.repeat(60));
        
        // Fetch ALL donations regardless of status
        const { data, error: queryError } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('❌ Database Error:', queryError);
          return;
        }

        console.log(`\n📊 TOTAL DONATIONS: ${data?.length || 0}\n`);
        
        // Group by status
        const byStatus = (data || []).reduce((acc, d) => {
          acc[d.status] = (acc[d.status] || 0) + 1;
          return acc;
        }, {});
        
        console.log('📋 Donations by Status:');
        Object.entries(byStatus).forEach(([status, count]) => {
          console.log(`   ${status}: ${count}`);
        });

        // Show successful donations (what recipient dashboard should show)
        const successful = data?.filter(d => d.status === 'successful') || [];
        console.log(`\n✅ SUCCESSFUL DONATIONS (should appear on recipient dashboard): ${successful.length}\n`);
        
        if (successful.length > 0) {
          console.table(successful.map(d => ({
            ID: d.id,
            'Food Name': d.food_name || 'N/A',
            Status: d.status,
            Quantity: `${d.quantity} ${d.unit}`,
            'Dietary Type': d.dietary_type || 'N/A',
            'Spice Level': d.spice_level || 'N/A',
            'Pickup City': d.pickup_city || 'N/A',
            'Contact Person': d.contact_person_name || 'N/A',
            'Contact Phone': d.contact_phone || 'N/A',
            'Has GPS': (d.pickup_latitude && d.pickup_longitude) ? '✅' : '❌',
            'Created': new Date(d.created_at).toLocaleString()
          })));
          
          console.log('\n📍 LOCATION DATA:');
          successful.forEach(d => {
            console.log(`\nDonation #${d.id}: ${d.food_name}`);
            console.log(`  Pickup Address: ${d.pickup_street_address}, ${d.pickup_area || ''}, ${d.pickup_city}, ${d.pickup_state} ${d.pickup_pin_code}`);
            console.log(`  Pickup Instructions: ${d.pickup_instructions || 'None'}`);
            console.log(`  Preferred Pickup Time: ${d.preferred_pickup_time || 'Flexible'}`);
            console.log(`  GPS Coordinates: ${d.pickup_latitude && d.pickup_longitude ? `${d.pickup_latitude}, ${d.pickup_longitude}` : '❌ Not available'}`);
            console.log(`  Contact: ${d.contact_person_name} - ${d.contact_phone}`);
          });
        } else {
          console.log('⚠️ No successful donations found!');
          console.log('   Check if donations are being saved with status="successful"');
        }

        console.log('\n' + '='.repeat(60));
        
      } catch (err) {
        console.error('❌ Exception in debugger:', err);
      }
    };

    fetchAllDonations();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchAllDonations, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Return null - no UI rendering
  return null;
};

export default DatabaseDebugger;
