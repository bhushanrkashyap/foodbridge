import { supabase } from '../supabaseClient';

/**
 * Allowed values for array fields and enums (from DB constraints)
 */
const ALLOWED_TAGS = [
  'vegetarian', 'vegan', 'non-vegetarian', 'dairy-free', 'gluten-free', 'organic',
  'spicy', 'mild', 'ready-to-eat', 'requires-heating', 'fresh', 'frozen'
];
const ALLOWED_ALLERGENS = [
  'Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat/Gluten', 'Seafood', 'Sesame', 'Mustard'
];
const ALLOWED_DAYS = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

/**
 * Validate required fields and constraints
 */
function validateDonation(data) {
  const requiredFields = [
    'image_url', 'food_name', 'food_type', 'quantity', 'unit', 'estimated_servings',
    'expiry_datetime', 'pickup_street_address', 'pickup_city', 'pickup_pin_code',
    'pickup_state', 'contact_person_name', 'contact_phone'
  ];
  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      (typeof data[field] === 'string' && data[field].trim() === '')
    ) {
      return `Missing required field: ${field}`;
    }
  }
  // Validate phone and pin code
  if (!/^\d{10}$/.test(data.contact_phone)) {
    return 'Contact phone must be 10 digits.';
  }
  if (!/^\d{6}$/.test(data.pickup_pin_code)) {
    return 'Pickup PIN code must be 6 digits.';
  }
  // Validate arrays
  if (data.tags && !data.tags.every(tag => ALLOWED_TAGS.includes(tag))) {
    return 'Invalid tag(s) selected.';
  }
  if (data.allergens && !data.allergens.every(a => ALLOWED_ALLERGENS.includes(a))) {
    return 'Invalid allergen(s) selected.';
  }
  if (data.recurring_days && !data.recurring_days.every(d => ALLOWED_DAYS.includes(d))) {
    return 'Invalid recurring day(s) selected.';
  }
  return null;
}

/**
 * Map form data from all subcomponents to DB schema
 */
function mapDonationData(formData, item = null) {
  // If bulk item, override name/quantity/unit
  return {
    image_url: formData.imageUrl || '',
    food_name: item ? item.name : formData.foodName || '',
    food_type: formData.foodType || '',
    quantity: item ? Number(item.quantity) : Number(formData.quantity) || 0,
    unit: item ? item.unit : formData.quantityUnit || '',
    estimated_servings: item ? Math.ceil(Number(item.quantity) * 2.5) : Number(formData.estimatedServings) || 0,
    expiry_datetime: formData.expiryDateTime || null,
    created_at: new Date().toISOString(),
    description: formData.enhancedDescription || formData.description || '',
    tags: Array.isArray(formData.tags) ? formData.tags.filter(tag => ALLOWED_TAGS.includes(tag)) : [],
    food_category: formData.foodCategory || null,
    pickup_street_address: formData.pickupAddress?.street || '',
    pickup_area: formData.pickupAddress?.area || null,
    pickup_city: formData.pickupAddress?.city || '',
    pickup_pin_code: formData.pickupAddress?.pincode || '',
    pickup_latitude: formData.pickupAddress?.latitude || null,
    pickup_longitude: formData.pickupAddress?.longitude || null,
    pickup_instructions: formData.pickupInstructions || null,
    contact_person_name: formData.contactPerson || '',
    contact_phone: formData.contactPhone || '',
    pickup_state: formData.pickupAddress?.state || '',
    preferred_pickup_time: formData.preferredPickupTime || null,
    dietary_type: formData.dietaryType || null,
    spice_level: formData.spiceLevel || null,
    allergens: Array.isArray(formData.allergens) ? formData.allergens.filter(a => ALLOWED_ALLERGENS.includes(a)) : [],
    additional_notes: formData.dietaryNotes || null,
    urgency_level: formData.urgencyLevel || null,
    donation_reason: formData.donationReason || null,
    urgency_notes: formData.urgencyNotes || null,
    is_recurring: !!formData.isRecurring,
    recurring_frequency: formData.recurringSchedule?.frequency || formData.recurringFrequency || null,
    recurring_posting_time: formData.recurringSchedule?.postingTime || formData.recurringPostingTime || null,
    recurring_days: Array.isArray(formData.recurringSchedule?.selectedDays)
      ? formData.recurringSchedule.selectedDays.filter(d => ALLOWED_DAYS.includes(d))
      : [],
    recurring_pickup_time: formData.recurringSchedule?.pickupTime || null,
    recurring_typical_quantity: formData.recurringSchedule?.typicalQuantity
      ? Number(formData.recurringSchedule?.typicalQuantity)
      : null,
    recurring_duration: formData.recurringSchedule?.duration
      ? Number(formData.recurringSchedule?.duration)
      : null,
    recurring_auto_post: !!formData.recurringSchedule?.autoPost,
    recurring_confirm_before_post: !!formData.recurringSchedule?.confirmBeforePost,
    recurring_use_ai_enhancement: !!formData.recurringSchedule?.useAIEnhancement
  };
}

/**
 * Insert donation(s) into Supabase
 * @param {object} formData - All form data collected from subcomponents
 * @returns {Promise<{data: any, error: any}>}
 */
export async function insertDonation(formData) {
  // 1. Handle bulk posting
  let insertRows = [];
  if (formData.isBulkPosting && formData.bulkOptions?.separatePosts && Array.isArray(formData.bulkItems)) {
    const enabledItems = formData.bulkItems.filter(item => item.enabled && item.name && item.quantity);
    if (enabledItems.length === 0) {
      return { data: null, error: 'No enabled bulk items to post.' };
    }
    insertRows = enabledItems.map(item => mapDonationData(formData, item));
  } else {
    insertRows = [mapDonationData(formData)];
  }

  // 2. Validate each row
  for (const row of insertRows) {
    const validationError = validateDonation(row);
    if (validationError) {
      return { data: null, error: validationError };
    }
  }

  // 3. Insert using Supabase (parameterized)
  // Debug: log insertRows before sending to Supabase
  console.log('Rows to insert:', insertRows);

  const { data, error } = await supabase
    .from('donations')
    .insert(insertRows)
    .select('*'); // Return inserted rows

  // Debug: log result from Supabase
  if (error) {
    console.error('Supabase insert error:', error, 'Rows:', insertRows);
    return { data: null, error: error.message || error };
  }
  return { data, error: null };
}

/*
Usage Example (in your parent component):

import { insertDonation } from '../utils/insertDonation';

const handleSubmit = async () => {
  const { data, error } = await insertDonation(formData);
  if (error) {
    alert('Error: ' + error);
  } else {
    alert('🎉 Donation posted successfully!');
    // Optionally reset form or show data
    console.log('Inserted rows:', data);
  }
};
*/