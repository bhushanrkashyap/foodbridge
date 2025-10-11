# Post Surplus Food - Navigation Flow Documentation

## 📋 Overview
The Post Surplus Food component now uses a **Save & Continue** pattern where each step:
1. ✅ Validates form data
2. 💾 Saves to Supabase database
3. ✨ Shows success message
4. ➡️ Auto-navigates to next step (after 800ms delay)

---

## 🔄 Step-by-Step Flow

### **Step 1: Photos & Basic Details**
**Button:** `Save & Continue`
**Action on Click:**
- Validates all required fields (food name, type, quantity, expiry date, description)
- **Creates** new donation record in Supabase `donations` table
- Stores `donationId` for use in subsequent steps
- Saves: food_name, food_type, quantity, unit, estimated_servings, expiry_datetime, description
- **Auto-navigates** to Step 2

---

### **Step 2: AI Enhancement & Categories**
**Component 1:** AI Description Enhancer
- Optional AI enhancement of description
- Button: `Save & Continue` (appears after enhancement)
- **Updates** donation with `enhanced_description`
- **Auto-navigates** to Category Selection

**Component 2:** Category Selection
- Button: `Save & Continue`
- **Updates** donation with selected `food_category_check` (tags array)
- **Auto-navigates** to Step 3

---

### **Step 3: Location & Pickup**
**Button:** `Save & Continue`
**Action on Click:**
- Validates address fields (street, city, state, pincode, contact info)
- **Updates** donation with:
  - pickup_state, pickup_pin_code, pickup_street_address
  - pickup_area, pickup_city, pickup_instructions
  - preferred_pickup_time, contact_person_name, contact_phone
- **Auto-navigates** to Step 4

---

### **Step 4: Dietary & Urgency**
**Component 1:** Dietary Information
- Real-time auto-save to Supabase on field change
- No separate button needed

**Component 2:** Urgency Indicator
- Button: `Save & Continue`
- **Updates** donation with:
  - spice_level, allergens, urgency_level, tags
- **Auto-navigates** to Step 5

---

### **Step 5: Advanced Options**
**Component 1:** Recurring Donation
- Button: `Save & Continue`
- **Updates** donation with recurring settings:
  - is_recurring, recurring_frequency, recurring_days
  - recurring_posting_time, recurring_pickup_time, etc.
- **Auto-navigates** to final submit section

**Component 2:** Bulk Posting
- Optional bulk configuration (no save required)

**Final Section:** 
- Big green **"Post Food Donation"** button
- **Updates** donation status to `active` and sets `posted_at` timestamp
- **Redirects** to Donor Dashboard with success message

---

## 🎯 Button States

### Save & Continue Button States:
1. **Default:** `Save & Continue` (green button with save icon)
2. **Loading:** `Saving...` (button disabled, loading spinner)
3. **Success:** `Saved ✓` (button disabled, checkmark shown, auto-navigating)

### Visual Feedback:
- ✅ **Green success banner** appears on successful save
- ❌ **Red error banner** appears if save fails
- 🔄 **Auto-navigation** happens 800ms after success
- 💾 **Save icon** on all Save & Continue buttons

---

## 🗄️ Supabase Data Structure

### Donations Table Fields:
```
Step 1: food_name, food_type, quantity, unit, estimated_servings, 
        expiry_datetime, description, image_url

Step 2: enhanced_description, food_category_check (tags array)

Step 3: pickup_street_address, pickup_area, pickup_city, pickup_state,
        pickup_pin_code, pickup_instructions, preferred_pickup_time,
        contact_person_name, contact_phone

Step 4: spice_level, allergens, urgency_level, tags

Step 5: is_recurring, recurring_frequency, recurring_days, 
        recurring_posting_time, recurring_pickup_time, 
        recurring_typical_quantity, recurring_duration,
        recurring_auto_post, recurring_confirm_before_post,
        recurring_use_ai_enhancement

Final: status ('active'), posted_at (timestamp)
```

---

## ⚠️ Important Notes

### Validation:
- Each step validates required fields before allowing save
- Phone numbers are cleaned and validated (must be 10 digits)
- Expiry dates must be in the future
- All required fields must be filled before proceeding

### Navigation:
- **Previous Step** button: Navigate back without saving
- **Save as Draft & Exit**: Return to dashboard (keeps data in Supabase)
- **Save & Continue**: Saves current step and moves forward
- **Can revisit steps** using Previous button without losing data

### Error Handling:
- If save fails, error message is shown and user stays on current step
- If donationId is missing in Steps 2-5, user is prompted to complete Step 1 first
- Network errors are caught and displayed clearly

---

## 🎨 User Experience

### Flow Timeline:
1. User fills form fields
2. Clicks "Save & Continue"
3. Button shows "Saving..." with spinner
4. Data saves to Supabase (~500-1500ms)
5. Green success banner appears
6. Button shows "Saved ✓"
7. After 800ms, auto-navigate to next step
8. Progress bar updates at top
9. Next step loads with fresh form

### Benefits:
- ✅ **No data loss** - Everything saved to database
- ✅ **Clear feedback** - Users know when data is saved
- ✅ **Smooth transitions** - Small delay shows success state
- ✅ **Can resume later** - Draft saved in Supabase
- ✅ **No duplicate submissions** - Button disabled after save

---

## 🚀 Testing Checklist

- [ ] Step 1: Fill basic details → Click Save & Continue → Navigates to Step 2
- [ ] Step 2: Enhance description → Click Save & Continue → Navigates to categories
- [ ] Step 2: Select categories → Click Save & Continue → Navigates to Step 3
- [ ] Step 3: Fill location → Click Save & Continue → Navigates to Step 4
- [ ] Step 4: Select dietary info → Click Save & Continue → Navigates to Step 5
- [ ] Step 5: Configure recurring → Click Save & Continue → Shows final submit
- [ ] Step 5: Click "Post Food Donation" → Redirects to dashboard
- [ ] Previous button works at any step
- [ ] Save as Draft returns to dashboard with data preserved
- [ ] Error messages display correctly on validation failures
- [ ] Success messages appear and auto-dismiss before navigation

---

## 📝 Developer Notes

### Key Implementation Details:
- Parent component passes `donationId`, `onNextStep`, and `onDonationIdChange` props
- Each child component manages its own save state (loading, success, error)
- `handleStepComplete()` in parent increments step counter
- 800ms timeout allows users to see success message before navigation
- Buttons are disabled after successful save to prevent double-submission
- All Supabase calls use async/await with proper error handling
