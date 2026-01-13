#!/bin/bash

echo "🧹 Cleaning up..."
pkill -f "node server.js" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

echo "🏦 Starting Virtual Bank..."

# Start backend
cd backend
npm install > /dev/null 2>&1
PORT=5001 npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend starting on port 5001 (PID: $BACKEND_PID)"

sleep 3

# Start frontend
cd ../frontend
npm install > /dev/null 2>&1
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend starting (PID: $FRONTEND_PID)"

sleep 3

echo ""
echo "=========================================="
echo "✅ VIRTUAL SAVINGS BANK IS RUNNING!"
echo "=========================================="
echo ""
echo "🌐 FRONTEND URL:"
echo "   http://localhost:3000"
echo ""
echo "🔗 BACKEND API:"
echo "   http://localhost:5001/api/health"
echo ""
echo "🔐 LOGIN CREDENTIALS:"
echo "   👑 ADMIN: admin@virtualbank.com / admin123"
echo "   👤 USER:  fanshawmarkk@yahoo.com / Fanshawsadday1956"
echo ""
echo "💰 ACCOUNT INFO:"
echo "   Name: Mark Jackson Fanshaw"
echo "   Account: VSB20240012345"
echo "   Balance: $204,000.00"
echo "   Safe Box: $4,000,000.00"
echo ""
echo "📊 TRANSACTION HISTORY:"
echo "   2008-2010 • Real bank transactions"
echo "   $7.5M transfer from Washington Mutual"
echo "   $4M in Safe Box deposit"
echo ""
echo "📁 LOGS:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: Press Ctrl+C"
echo ""

# Keep script running
wait
