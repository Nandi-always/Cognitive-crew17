#!/bin/bash

# SmartHomeViz AI - Database Setup Script

echo "🏠 SmartHomeViz AI - Database Setup"
echo "===================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ Error: .env.local not found"
  echo "📝 Please copy .env.example to .env.local and configure it"
  exit 1
fi

echo "✅ .env.local found"

# Push schema to database
echo ""
echo "📊 Syncing database schema..."
npm run db:push

if [ $? -eq 0 ]; then
  echo "✅ Database schema synced successfully"
else
  echo "❌ Failed to sync database schema"
  exit 1
fi

# Optional: Seed database with sample data
read -p "Would you like to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding database..."
  npm run db:seed
fi

echo ""
echo "✅ Database setup complete!"
echo "You can now run: npm run dev"
