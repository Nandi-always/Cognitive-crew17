#!/bin/bash

# Verify JavaScript Conversion
echo "TypeScript to JavaScript Conversion Verification"
echo "=================================================="
echo ""

# Check for remaining TypeScript files
echo "1. Checking for remaining .ts/.tsx files (should be none or only in types/):"
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v ".next" | grep -v "types/" || echo "   ✅ No TypeScript source files found (only type definitions expected)"
echo ""

# Check for JavaScript files
echo "2. Checking JavaScript files created:"
echo "   Config files:"
ls -la jsconfig.json 2>/dev/null && echo "   ✅ jsconfig.json" || echo "   ❌ Missing jsconfig.json"
ls -la middleware.js 2>/dev/null && echo "   ✅ middleware.js" || echo "   ❌ Missing middleware.js"
ls -la tailwind.config.js 2>/dev/null && echo "   ✅ tailwind.config.js" || echo "   ❌ Missing tailwind.config.js"
ls -la i18n.js 2>/dev/null && echo "   ✅ i18n.js" || echo "   ❌ Missing i18n.js"
echo ""

echo "   Library files:"
find lib -name "*.js" | sort && echo ""

echo "   Component files:"
find components -name "*.jsx" | sort && echo ""

echo "   App files:"
find app -name "*.jsx" | sort && echo ""

echo "3. Checking package.json for TypeScript removal:"
grep -q "typescript" package.json && echo "   ⚠️  TypeScript still in package.json" || echo "   ✅ TypeScript removed from package.json"
grep -q "type-check" package.json && echo "   ⚠️  type-check script still present" || echo "   ✅ type-check script removed"
echo ""

echo "Conversion verification complete!"
