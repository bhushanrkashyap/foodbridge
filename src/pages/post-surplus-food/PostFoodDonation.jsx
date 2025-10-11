import React, { useState } from 'react';
import BulkPosting from './components/BulkPosting';
import CategorySelection from './components/CategorySelection';
import LocationDetails from './components/LocationDetails';
import DietaryInformation from './components/DietaryInformation';
import UrgencyIndicator from './components/UrgencyIndicator';
import RecurringDonation from './components/RecurringDonation';
import AIDescriptionEnhancer from './components/AIDescriptionEnhancer';
import BasicDetailsForm from './components/BasicDetailsForm';
import Button from '../../components/ui/Button';
import { supabase } from '../../supabaseClient';
import { insertDonation } from '../../utils/insertDonation';

const PostFoodDonation = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper: Validate required fields
  const validateDonation = (data) => {
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
    return null;
  };

  // Map formData to DB schema
  const mapDonationData = (item = null) => ({
    image_url: formData.imageUrl || '',
    food_name: item ? item.name : formData.foodName || '',
    food_type: formData.foodType || '',
    quantity: item ? Number(item.quantity) : Number(formData.quantity) || 0,
    unit: item ? item.unit : formData.quantityUnit || '',
    estimated_servings: item ? Math.ceil(Number(item.quantity) * 2.5) : Number(formData.estimatedServings) || 0,
    expiry_datetime: formData.expiryDateTime || null,
    created_at: new Date().toISOString(),
    description: formData.description || '',
    tags: formData.tags || [],
    food_category: formData.foodCategory || '',
    pickup_street_address: formData.pickupAddress?.street || '',
    pickup_area: formData.pickupAddress?.area || '',
    pickup_city: formData.pickupAddress?.city || '',
    pickup_pin_code: formData.pickupAddress?.pincode || '',
    pickup_instructions: formData.pickupInstructions || '',
    contact_person_name: formData.contactPerson || '',
    contact_phone: formData.contactPhone || '',
    pickup_state: formData.pickupAddress?.state || '',
    preferred_pickup_time: formData.preferredPickupTime || '',
    dietary_type: formData.dietaryType || '',
    spice_level: formData.spiceLevel || '',
    allergens: formData.allergens || [],
    additional_notes: formData.dietaryNotes || '',
    urgency_level: formData.urgencyLevel || '',
    donation_reason: formData.donationReason || '',
    urgency_notes: formData.urgencyNotes || '',
    is_recurring: !!formData.isRecurring,
    recurring_frequency: formData.recurringSchedule?.frequency || formData.recurringFrequency || '',
    recurring_posting_time: formData.recurringSchedule?.postingTime || formData.recurringPostingTime || '',
    recurring_days: formData.recurringSchedule?.selectedDays || [],
    recurring_pickup_time: formData.recurringSchedule?.pickupTime || '',
    recurring_typical_quantity: formData.recurringSchedule?.typicalQuantity ? Number(formData.recurringSchedule?.typicalQuantity) : null,
    recurring_duration: formData.recurringSchedule?.duration ? Number(formData.recurringSchedule?.duration) : null,
    recurring_auto_post: !!formData.recurringSchedule?.autoPost,
    recurring_confirm_before_post: !!formData.recurringSchedule?.confirmBeforePost,
    recurring_use_ai_enhancement: !!formData.recurringSchedule?.useAIEnhancement
  });

  // Unified form change handler
  const handleFormChange = (newData) => {
    setFormData(newData);
  };

  // Submission handler
  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Debug: log formData before submission
    console.log('Form data before insert:', formData);

    const { data, error } = await insertDonation(formData);

    setLoading(false);

    if (error) {
      setErrorMessage(
        <>
          <div>{error}</div>
          <pre className="text-xs text-left overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
        </>
      );
      setSuccessMessage('');
      // Also log to browser console for easier debugging
      console.error('Insert error:', error, 'FormData:', formData);
    } else {
      setSuccessMessage('🎉 Your donation has been posted successfully! Thank you for helping reduce food waste and support your community.');
      setErrorMessage('');
      // Optionally reset form or show data
      // console.log('Inserted rows:', data);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading text-primary">Post a New Food Donation</h1>
        <p className="text-muted-foreground mt-2">Fill in the details below to help us connect your surplus food with those in need.</p>
      </div>

      <BasicDetailsForm formData={formData} onFormChange={handleFormChange} errors={errors} imageUrl={formData.imageUrl} />
      <AIDescriptionEnhancer currentDescription={formData.description} onDescriptionUpdate={desc => handleFormChange({ ...formData, description: desc })} foodName={formData.foodName} foodType={formData.foodType} />
      <DietaryInformation formData={formData} onFormChange={handleFormChange} errors={errors} />
      <CategorySelection selectedCategories={formData.tags || []} onCategoriesChange={tags => handleFormChange({ ...formData, tags })} autoSuggestedTags={formData.autoSuggestedTags || []} />
      <BulkPosting formData={formData} onFormChange={handleFormChange} errors={errors} />
      <LocationDetails formData={formData} onFormChange={handleFormChange} errors={errors} />
      <UrgencyIndicator formData={formData} onFormChange={handleFormChange} errors={errors} />
      <RecurringDonation formData={formData} onFormChange={handleFormChange} errors={errors} />

      <div className="pt-6 border-t border-border">
        <Button
          variant="default"
          size="lg"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
          className="w-full"
          iconName="Send"
          iconPosition="left"
        >
          {loading ? 'Submitting Donation...' : 'Post Food Donation'}
        </Button>
        {successMessage && (
          <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded text-success text-center font-semibold">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded text-error text-center font-semibold">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFoodDonation;
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
  const { data, error } = await supabase
    .from('donations')
    .insert(insertRows)
    .select('*'); // Return inserted rows

  // 4. Return result
  if (error) {
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
