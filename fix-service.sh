#!/bin/bash

# Eisenhower Matrix Service Fix Script
# This script fixes common issues with the service

# Configuration
PROJECT_DIR="/var/www/eisenhower-matrix"
SERVICE_NAME="eisenhower-matrix"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check service status
check_service_status() {
    print_status "=== Service Status Check ==="
    
    # Check if service exists
    if systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
        print_success "Service exists"
    else
        print_error "Service not found"
        return 1
    fi
    
    # Check service status
    SERVICE_STATUS=$(systemctl is-active $SERVICE_NAME 2>/dev/null)
    print_status "Service status: $SERVICE_STATUS"
    
    # Show detailed status
    print_status "Detailed service status:"
    systemctl status $SERVICE_NAME --no-pager -l
    
    # Show recent logs
    print_status "Recent service logs:"
    journalctl -u $SERVICE_NAME --no-pager -n 20
}

# Function to check project structure
check_project() {
    print_status "=== Project Structure Check ==="
    
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Project directory not found: $PROJECT_DIR"
        return 1
    fi
    
    print_success "Project directory exists: $PROJECT_DIR"
    
    # Check if start-app.sh exists and is executable
    if [ -f "$PROJECT_DIR/start-app.sh" ]; then
        print_success "start-app.sh exists"
        if [ -x "$PROJECT_DIR/start-app.sh" ]; then
            print_success "start-app.sh is executable"
        else
            print_warning "start-app.sh is not executable, fixing..."
            chmod +x "$PROJECT_DIR/start-app.sh"
        fi
    else
        print_error "start-app.sh not found in $PROJECT_DIR"
        return 1
    fi
    
    # Check backend directory
    if [ -d "$PROJECT_DIR/backend" ]; then
        print_success "Backend directory exists"
        if [ -f "$PROJECT_DIR/backend/server.js" ]; then
            print_success "server.js exists"
        else
            print_error "server.js not found in backend directory"
        fi
    else
        print_error "Backend directory not found"
    fi
}

# Function to check permissions
check_permissions() {
    print_status "=== Permissions Check ==="
    
    # Check project directory permissions
    PROJECT_OWNER=$(stat -c '%U:%G' "$PROJECT_DIR" 2>/dev/null)
    print_status "Project directory owner: $PROJECT_OWNER"
    
    # Check if www-data can access the directory
    if sudo -u www-data test -r "$PROJECT_DIR"; then
        print_success "www-data can read project directory"
    else
        print_error "www-data cannot read project directory"
        print_status "Fixing permissions..."
        chown -R www-data:www-data "$PROJECT_DIR"
    fi
    
    # Check log directory
    LOG_DIR="/var/log/eisenhower-matrix"
    if [ -d "$LOG_DIR" ]; then
        print_success "Log directory exists"
        LOG_OWNER=$(stat -c '%U:%G' "$LOG_DIR" 2>/dev/null)
        print_status "Log directory owner: $LOG_OWNER"
    else
        print_warning "Log directory not found, creating..."
        mkdir -p "$LOG_DIR"
        chown www-data:www-data "$LOG_DIR"
    fi
}

# Function to test manual startup
test_manual_startup() {
    print_status "=== Manual Startup Test ==="
    
    # Test if start-app.sh can run manually
    print_status "Testing manual startup..."
    
    # Run as www-data user
    if sudo -u www-data "$PROJECT_DIR/start-app.sh" status; then
        print_success "Manual startup test passed"
    else
        print_error "Manual startup test failed"
        print_status "Trying to run start-app.sh manually to see errors..."
        sudo -u www-data "$PROJECT_DIR/start-app.sh" 2>&1 | head -20
    fi
}

# Function to fix common issues
fix_issues() {
    print_status "=== Fixing Common Issues ==="
    
    # 1. Fix permissions
    print_status "Fixing permissions..."
    chown -R www-data:www-data "$PROJECT_DIR"
    chmod +x "$PROJECT_DIR/start-app.sh"
    
    # 2. Create log directory
    print_status "Creating log directory..."
    mkdir -p /var/log/eisenhower-matrix
    chown www-data:www-data /var/log/eisenhower-matrix
    
    # 3. Install dependencies if needed
    print_status "Installing dependencies..."
    cd "$PROJECT_DIR"
    if [ -f "package.json" ]; then
        sudo -u www-data npm install --production
    fi
    
    cd "$PROJECT_DIR/backend"
    if [ -f "package.json" ]; then
        sudo -u www-data npm install --production
    fi
    
    cd "$PROJECT_DIR/frontend"
    if [ -f "package.json" ]; then
        sudo -u www-data npm install
        sudo -u www-data npm run build
    fi
    
    # 4. Update systemd service file
    print_status "Updating systemd service..."
    systemctl daemon-reload
}

# Function to restart service
restart_service() {
    print_status "=== Restarting Service ==="
    
    # Stop service
    print_status "Stopping service..."
    systemctl stop $SERVICE_NAME
    
    # Wait a moment
    sleep 2
    
    # Start service
    print_status "Starting service..."
    systemctl start $SERVICE_NAME
    
    # Check status
    sleep 3
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "Service started successfully"
    else
        print_error "Service failed to start"
        print_status "Service logs:"
        journalctl -u $SERVICE_NAME --no-pager -n 10
    fi
}

# Function to show final status
show_final_status() {
    print_status "=== Final Status ==="
    
    # Service status
    systemctl status $SERVICE_NAME --no-pager
    
    # Recent logs
    print_status "Recent logs:"
    journalctl -u $SERVICE_NAME --no-pager -n 5
    
    # Process check
    print_status "Running processes:"
    ps aux | grep -E "(node|eisenhower)" | grep -v grep
}

# Main execution
main() {
    print_status "Eisenhower Matrix Service Fix Tool"
    print_status "===================================="
    
    check_service_status
    echo ""
    
    check_project
    echo ""
    
    check_permissions
    echo ""
    
    test_manual_startup
    echo ""
    
    fix_issues
    echo ""
    
    restart_service
    echo ""
    
    show_final_status
}

# Handle script arguments
case "${1:-}" in
    "status")
        check_service_status
        ;;
    "fix")
        fix_issues
        restart_service
        ;;
    "restart")
        restart_service
        ;;
    "logs")
        print_status "Service logs:"
        journalctl -u $SERVICE_NAME -f
        ;;
    *)
        main
        ;;
esac
