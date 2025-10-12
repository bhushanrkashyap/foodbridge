"""
Add Location Columns to Donations Table
This script adds latitude/longitude columns to the donations table in Supabase
"""

from supabase import create_client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase credentials - UPDATE THESE WITH YOUR ACTUAL VALUES
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', 'YOUR_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY', 'YOUR_SUPABASE_ANON_KEY')

# Read the SQL migration file
with open('add_location_columns.sql', 'r') as f:
    sql_script = f.read()

print("=" * 60)
print("SUPABASE DATABASE MIGRATION")
print("=" * 60)
print("\nSQL Script to execute:")
print("-" * 60)
print(sql_script)
print("-" * 60)

print("\n⚠️  MANUAL STEPS REQUIRED:")
print("\n1. Go to your Supabase Dashboard: https://app.supabase.com")
print("2. Select your project")
print("3. Go to 'SQL Editor' in the left sidebar")
print("4. Click 'New Query'")
print("5. Copy and paste the SQL script above")
print("6. Click 'Run' or press Ctrl+Enter")
print("\nAlternatively, you can run this via Supabase CLI:")
print("supabase db execute < add_location_columns.sql")
print("\n" + "=" * 60)

# Note: Supabase Python client doesn't support raw SQL execution
# You need to use Supabase Dashboard or CLI
print("\n✅ SQL file created: add_location_columns.sql")
print("📝 Please execute this SQL in your Supabase Dashboard")
