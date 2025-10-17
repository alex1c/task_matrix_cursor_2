#!/bin/bash

# Eisenhower Matrix Application Debug Script
# This script helps diagnose issues with the application

# Configuration
PROJECT_DIR="/var/www/eisenhower-matrix"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_DIR="/var/log/eisenhower-matrix"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check system requirements
check_system() {
    print_status "=== System Requirements Check ==="
    
    # Check OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        print_success "OS: $PRETTY_NAME"
    else
        print_warning "Cannot determine OS version"
    fi
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_success "Running as root"
    else
        print_warning "Not running as root (some checks may fail)"
    fi
    
    # Check available memory
    MEMORY=$(free -m | awk 'NR==2{printf "%.1f", $3/$2*100}')
    print_status "Memory usage: ${MEMORY}%"
    
    # Check disk space
    DISK_USAGE=$(df -h "$PROJECT_DIR" 2>/dev/null | awk 'NR==2{print $5}' | sed 's/%//')
    if [ -n "$DISK_USAGE" ]; then
        print_status "Disk usage: ${DISK_USAGE}%"
    fi
}

# Function to check Node.js installation
check_nodejs() {
    print_status "=== Node.js Check ==="
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js installed: $NODE_VERSION"
        
        if command -v npm &> /dev/null; then
            NPM_VERSION=$(npm --version)
            print_success "npm installed: $NPM_VERSION"
        else
            print_error "npm not found"
        fi
    else
        print_error "Node.js not installed"
        return 1
    fi
    
    # Check Node.js version
    NODE_MAJOR=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        print_warning "Node.js version is old (recommended: 16+)"
    fi
}

# Function to check project structure
check_project_structure() {
    print_status "=== Project Structure Check ==="
    
    if [ -d "$PROJECT_DIR" ]; then
        print_success "Project directory exists: $PROJECT_DIR"
    else
        print_error "Project directory not found: $PROJECT_DIR"
        return 1
    fi
    
    # Check backend
    if [ -d "$BACKEND_DIR" ]; then
        print_success "Backend directory exists: $BACKEND_DIR"
        
        if [ -f "$BACKEND_DIR/server.js" ]; then
            print_success "server.js found"
        else
            print_error "server.js not found in backend directory"
        fi
        
        if [ -f "$BACKEND_DIR/package.json" ]; then
            print_success "Backend package.json found"
        else
            print_error "Backend package.json not found"
        fi
    else
        print_error "Backend directory not found: $BACKEND_DIR"
    fi
    
    # Check frontend
    if [ -d "$FRONTEND_DIR" ]; then
        print_success "Frontend directory exists: $FRONTEND_DIR"
        
        if [ -f "$FRONTEND_DIR/package.json" ]; then
            print_success "Frontend package.json found"
        else
            print_error "Frontend package.json not found"
        fi
        
        if [ -d "$FRONTEND_DIR/dist" ]; then
            print_success "Frontend dist directory exists"
        else
            print_warning "Frontend dist directory not found (needs build)"
        fi
    else
        print_error "Frontend directory not found: $FRONTEND_DIR"
    fi
}

# Function to check dependencies
check_dependencies() {
    print_status "=== Dependencies Check ==="
    
    # Check root dependencies
    if [ -f "$PROJECT_DIR/package.json" ]; then
        print_status "Checking root dependencies..."
        cd "$PROJECT_DIR"
        if [ -d "node_modules" ]; then
            print_success "Root node_modules exists"
        else
            print_warning "Root node_modules not found"
        fi
    fi
    
    # Check backend dependencies
    if [ -f "$BACKEND_DIR/package.json" ]; then
        print_status "Checking backend dependencies..."
        cd "$BACKEND_DIR"
        if [ -d "node_modules" ]; then
            print_success "Backend node_modules exists"
        else
            print_warning "Backend node_modules not found"
        fi
    fi
    
    # Check frontend dependencies
    if [ -f "$FRONTEND_DIR/package.json" ]; then
        print_status "Checking frontend dependencies..."
        cd "$FRONTEND_DIR"
        if [ -d "node_modules" ]; then
            print_success "Frontend node_modules exists"
        else
            print_warning "Frontend node_modules not found"
        fi
    fi
}

# Function to check permissions
check_permissions() {
    print_status "=== Permissions Check ==="
    
    # Check project directory permissions
    if [ -r "$PROJECT_DIR" ]; then
        print_success "Project directory is readable"
    else
        print_error "Project directory is not readable"
    fi
    
    if [ -w "$PROJECT_DIR" ]; then
        print_success "Project directory is writable"
    else
        print_error "Project directory is not writable"
    fi
    
    # Check log directory
    if [ -d "$LOG_DIR" ]; then
        print_success "Log directory exists: $LOG_DIR"
        if [ -w "$LOG_DIR" ]; then
            print_success "Log directory is writable"
        else
            print_error "Log directory is not writable"
        fi
    else
        print_warning "Log directory not found: $LOG_DIR"
    fi
    
    # Check file ownership
    PROJECT_OWNER=$(stat -c '%U:%G' "$PROJECT_DIR" 2>/dev/null)
    print_status "Project directory owner: $PROJECT_OWNER"
}

# Function to check network and ports
check_network() {
    print_status "=== Network Check ==="
    
    # Check if port 5000 is in use
    if netstat -tlnp 2>/dev/null | grep -q ":5000 "; then
        PORT_PROCESS=$(netstat -tlnp 2>/dev/null | grep ":5000 " | awk '{print $7}')
        print_warning "Port 5000 is in use by: $PORT_PROCESS"
    else
        print_success "Port 5000 is available"
    fi
    
    # Check if curl is available
    if command -v curl &> /dev/null; then
        print_success "curl is available"
    else
        print_warning "curl not found (needed for health checks)"
    fi
}

# Function to check services
check_services() {
    print_status "=== Services Check ==="
    
    # Check if PM2 is installed
    if command -v pm2 &> /dev/null; then
        print_success "PM2 is installed: $(pm2 --version)"
        
        # Check PM2 processes
        if pm2 list | grep -q "eisenhower-backend"; then
            print_status "PM2 process found:"
            pm2 list | grep "eisenhower-backend"
        else
            print_warning "No PM2 process found for eisenhower-backend"
        fi
    else
        print_warning "PM2 not installed"
    fi
    
    # Check systemd service
    if systemctl list-unit-files | grep -q "eisenhower-matrix.service"; then
        print_success "Systemd service exists"
        
        SERVICE_STATUS=$(systemctl is-active eisenhower-matrix 2>/dev/null)
        if [ "$SERVICE_STATUS" = "active" ]; then
            print_success "Service is active"
        elif [ "$SERVICE_STATUS" = "inactive" ]; then
            print_warning "Service is inactive"
        else
            print_warning "Service status: $SERVICE_STATUS"
        fi
    else
        print_warning "Systemd service not found"
    fi
}

# Function to check logs
check_logs() {
    print_status "=== Logs Check ==="
    
    # Check backend log
    if [ -f "$LOG_DIR/backend.log" ]; then
        print_success "Backend log exists: $LOG_DIR/backend.log"
        print_status "Last 5 lines of backend log:"
        tail -5 "$LOG_DIR/backend.log" | sed 's/^/  /'
    else
        print_warning "Backend log not found: $LOG_DIR/backend.log"
    fi
    
    # Check systemd logs
    if systemctl list-unit-files | grep -q "eisenhower-matrix.service"; then
        print_status "Systemd service logs (last 5 lines):"
        journalctl -u eisenhower-matrix --no-pager -n 5 | sed 's/^/  /'
    fi
}

# Function to test backend manually
test_backend() {
    print_status "=== Backend Test ==="
    
    if [ -f "$BACKEND_DIR/server.js" ]; then
        print_status "Testing backend startup..."
        cd "$BACKEND_DIR"
        
        # Test if server.js can be parsed
        if node -c server.js; then
            print_success "server.js syntax is valid"
        else
            print_error "server.js has syntax errors"
            return 1
        fi
        
        # Test dependencies
        print_status "Testing backend dependencies..."
        if timeout 10s node -e "require('./server.js')" 2>&1 | head -5; then
            print_success "Backend dependencies loaded successfully"
        else
            print_error "Backend dependency loading failed"
        fi
    else
        print_error "Cannot test backend - server.js not found"
    fi
}

# Function to provide recommendations
provide_recommendations() {
    print_status "=== Recommendations ==="
    
    echo "Based on the diagnostic results, here are some recommendations:"
    echo ""
    
    # Check if Node.js is missing
    if ! command -v node &> /dev/null; then
        echo "1. Install Node.js:"
        echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        echo "   sudo apt-get install -y nodejs"
        echo ""
    fi
    
    # Check if dependencies are missing
    if [ ! -d "$BACKEND_DIR/node_modules" ] || [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        echo "2. Install dependencies:"
        echo "   cd $PROJECT_DIR && npm install"
        echo "   cd $BACKEND_DIR && npm install"
        echo "   cd $FRONTEND_DIR && npm install"
        echo ""
    fi
    
    # Check if frontend needs build
    if [ ! -d "$FRONTEND_DIR/dist" ]; then
        echo "3. Build frontend:"
        echo "   cd $FRONTEND_DIR && npm run build"
        echo ""
    fi
    
    # Check if PM2 is missing
    if ! command -v pm2 &> /dev/null; then
        echo "4. Install PM2:"
        echo "   sudo npm install -g pm2"
        echo ""
    fi
    
    # Check if service is not installed
    if ! systemctl list-unit-files | grep -q "eisenhower-matrix.service"; then
        echo "5. Install systemd service:"
        echo "   sudo ./install-service.sh"
        echo ""
    fi
    
    echo "6. For detailed troubleshooting:"
    echo "   - Check logs: sudo journalctl -u eisenhower-matrix -f"
    echo "   - Check backend logs: tail -f $LOG_DIR/backend.log"
    echo "   - Test backend manually: cd $BACKEND_DIR && node server.js"
    echo ""
}

# Main execution
main() {
    echo "Eisenhower Matrix Application Debug Tool"
    echo "========================================"
    echo ""
    
    check_system
    echo ""
    
    check_nodejs
    echo ""
    
    check_project_structure
    echo ""
    
    check_dependencies
    echo ""
    
    check_permissions
    echo ""
    
    check_network
    echo ""
    
    check_services
    echo ""
    
    check_logs
    echo ""
    
    test_backend
    echo ""
    
    provide_recommendations
}

# Handle script arguments
case "${1:-}" in
    "quick")
        print_status "Quick diagnostic..."
        check_system
        check_nodejs
        check_project_structure
        ;;
    "logs")
        check_logs
        ;;
    "network")
        check_network
        ;;
    "services")
        check_services
        ;;
    "test")
        test_backend
        ;;
    *)
        main
        ;;
esac
