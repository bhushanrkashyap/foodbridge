# FoodBridge Nearest Neighbor Matching - Jupyter Notebook

## Linux Instance Setup Guide

This notebook is designed to run on Linux cloud instances (AWS, Google Cloud, Azure, etc.) for analyzing food donation matching algorithms.

---

## 🚀 Quick Start on Linux Instance

### 1. **Prerequisites**
```bash
# Update system
sudo apt-get update

# Install Python 3.8+ (if not already installed)
sudo apt-get install -y python3 python3-pip python3-venv

# Install Jupyter
pip3 install jupyter notebook jupyterlab
```

### 2. **Clone/Upload Your Project**
```bash
cd /home/ubuntu  # or your preferred directory
# Upload the foodbridge folder containing this notebook
```

### 3. **Set Up Environment**
```bash
cd /path/to/foodbridge/backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install required packages
pip install supabase pandas geopy requests python-dotenv matplotlib
```

### 4. **Configure Environment Variables**
Create a `.env` file in the `backend` folder:
```bash
nano .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 5. **Start Jupyter Notebook**
```bash
# Option 1: Local access only
jupyter notebook

# Option 2: Remote access (from external IP)
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root

# Option 3: JupyterLab (modern interface)
jupyter lab --ip=0.0.0.0 --port=8888 --no-browser --allow-root
```

**Security Note**: For production, always use a password and SSL:
```bash
jupyter notebook --generate-config
jupyter notebook password
# Then add SSL certificates in jupyter_notebook_config.py
```

### 6. **Access the Notebook**
- **Local**: Open browser to `http://localhost:8888`
- **Remote**: Open browser to `http://YOUR_SERVER_IP:8888`
- Enter the token shown in terminal

---

## 📊 Using the Notebook

### **Sorting Strategies**

In **Cell 8**, you can choose your sorting strategy:

```python
SORTING_STRATEGY = 'distance'  # Options: 'distance', 'urgency', 'balanced'
```

#### **Strategy Details:**

1. **`'distance'` - Nearest First** 📍
   - **Purpose**: Minimize travel time and distance
   - **Best for**: Quick pickups, fuel efficiency
   - **How it works**: Ranks donations by proximity, closest first
   - **Priority formula**: `(1 / (distance + 0.1)) × 40`
   - **Use case**: When you want to grab nearby donations fast

2. **`'urgency'` - Expiring Soon** ⏰
   - **Purpose**: Prevent food waste
   - **Best for**: Critical situations, expiring food
   - **How it works**: Ranks by time until expiry
   - **Priority formula**: `urgency_score` (0-100 based on time left)
   - **Scoring**:
     - 100: Already expired
     - 90: < 1 hour left
     - 70: < 3 hours
     - 50: < 6 hours
     - 30: < 12 hours
     - 10: < 24 hours
     - 0: > 24 hours
   - **Use case**: When saving food from expiration is top priority

3. **`'balanced'` - Default** ⚖️
   - **Purpose**: Balance between distance and urgency
   - **Best for**: General use, optimal overall
   - **How it works**: Combines both factors
   - **Priority formula**: `(urgency_score × 0.6) + (distance_score × 0.4)`
   - **Weights**: 60% urgency, 40% distance
   - **Use case**: Most scenarios, recommended default

---

## 🔧 Running the Analysis

### **Step-by-Step Execution:**

1. **Cell 1-2**: Install packages (run once)
2. **Cell 3**: Import libraries
3. **Cell 4**: Connect to Supabase
4. **Cell 5**: Define helper functions
5. **Cell 6-7**: Set recipient location
6. **Cell 8**: **⭐ Choose your sorting strategy**
7. **Cell 9**: Fetch donations from database
8. **Cell 10**: Define optimization algorithm
9. **Cell 11**: Run optimization and see results
10. **Cell 12**: Visualize results (distance distribution)
11. **Cell 13**: Export to CSV (optional)
12. **Cell 14**: View summary statistics

### **Expected Output:**

```
📊 SUMMARY STATISTICS
============================================================
Total Donations: 15
With Location Data: 12
Without Location Data: 3

Feasible Deliveries: 8
Infeasible Deliveries: 4

Distance Statistics:
  Min Distance: 2.34 km
  Max Distance: 45.67 km
  Avg Distance: 15.23 km

Travel Time Statistics (@ 20 km/h):
  Min Travel Time: 7 min
  Max Travel Time: 138 min
  Avg Travel Time: 46 min

Priority Score Statistics:
  Highest Priority: 95.23
  Lowest Priority: 12.45
  Avg Priority: 54.67
```

---

## 📁 Output Files

The notebook generates:

1. **`ranked_donations.csv`** - Complete list with all metrics
   - Columns: id, food_name, food_type, quantity, distance, travel_time, priority_score, etc.
   - Can be imported into Excel, Google Sheets, or other tools

2. **Console Logs** - Detailed processing information
   - Shows geocoding attempts
   - Displays feasibility calculations
   - Lists top recommendations

3. **Visualizations**
   - Distance histogram
   - Priority vs Distance scatter plot

---

## 🐛 Troubleshooting

### **Issue: "No module named 'supabase'"**
```bash
pip install supabase pandas geopy requests python-dotenv matplotlib
```

### **Issue: "Connection refused" to Supabase**
- Check your `.env` file has correct credentials
- Verify Supabase project is active
- Check firewall rules on Linux instance

### **Issue: "No donations found"**
- Verify donations exist with `status='successful'` in database
- Check console output for SQL errors
- Try posting a test donation from the web app

### **Issue: Matplotlib not showing plots**
```python
# Add this at the top of visualization cell
%matplotlib inline
```

### **Issue: Permission denied on Linux**
```bash
sudo chmod +x nearest_neighbor_matching.ipynb
# Or run jupyter with appropriate user permissions
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** to git
2. **Use firewall rules** to restrict Jupyter access
3. **Set strong password**: `jupyter notebook password`
4. **Use HTTPS** in production
5. **Regularly update packages**: `pip install --upgrade supabase pandas geopy`

---

## 📊 Performance Tips

### **For Large Datasets (1000+ donations):**

```python
# Limit initial fetch for testing
donations = donations[:100]  # Process first 100 only

# Or add filters
response = supabase.table('donations')\
    .select('*')\
    .eq('status', 'successful')\
    .gte('created_at', '2025-01-01')\  # Recent only
    .limit(500)\
    .execute()
```

### **Optimize geocoding:**
```python
# Skip geocoding if address is incomplete
if not (donation['pickup_street_address'] and 
        donation['pickup_city'] and 
        donation['pickup_pin_code']):
    continue  # Skip this donation
```

---

## 🆘 Support

- **Documentation**: See code comments in notebook
- **Issues**: Check console output for detailed error messages
- **Logs**: All operations are logged with emoji indicators:
  - ✅ Success
  - ⚠️ Warning
  - ❌ Error
  - 🔍 Processing
  - 📊 Results

---

## 📝 Example Workflow

```python
# 1. Set your location
RECIPIENT_LOCATION = {'lat': 12.9716, 'lng': 77.5946}  # Bangalore

# 2. Choose strategy
SORTING_STRATEGY = 'distance'  # Nearest first

# 3. Run optimization
ranked_donations = find_optimal_donations(RECIPIENT_LOCATION, donations, strategy=SORTING_STRATEGY)

# 4. Get top 3
top_3 = ranked_donations[ranked_donations['is_feasible'] == True].head(3)

# 5. Export results
ranked_donations.to_csv('results.csv', index=False)
```

---

## 🌐 Integration with Web App

The JavaScript version (`nearestNeighborMatcher.js`) uses the same algorithm.

To sync changes:
1. Update formula in Jupyter notebook
2. Test and verify results
3. Apply same changes to JavaScript file
4. Deploy updated web app

---

**Last Updated**: October 12, 2025  
**Version**: 2.0 (Linux-compatible with multi-strategy support)
