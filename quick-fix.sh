#!/bin/bash

# Quick fix for Eisenhower Matrix service issues

echo "=== Eisenhower Matrix Quick Fix ==="

# Configuration
PROJECT_DIR="/var/www/eisenhower-matrix"
SERVICE_NAME="eisenhower-matrix"

echo "1. Stopping service..."
sudo systemctl stop $SERVICE_NAME

echo "2. Fixing permissions..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod +x $PROJECT_DIR/start-app.sh

echo "3. Creating log directory..."
sudo mkdir -p /var/log/eisenhower-matrix
sudo chown www-data:www-data /var/log/eisenhower-matrix

echo "4. Installing dependencies..."
cd $PROJECT_DIR
sudo -u www-data npm install --production

cd $PROJECT_DIR/backend
sudo -u www-data npm install --production

cd $PROJECT_DIR/frontend
sudo -u www-data npm install
sudo -u www-data npm run build

echo "5. Reloading systemd..."
sudo systemctl daemon-reload

echo "6. Starting service..."
sudo systemctl start $SERVICE_NAME

echo "7. Checking status..."
sleep 3
sudo systemctl status $SERVICE_NAME --no-pager

echo "8. Recent logs:"
sudo journalctl -u $SERVICE_NAME --no-pager -n 10

echo "=== Fix completed ==="
