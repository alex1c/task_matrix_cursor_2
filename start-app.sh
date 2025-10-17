#!/bin/bash

# Eisenhower Matrix Application Startup Script
# This script starts both backend and frontend services

# Configuration
PROJECT_DIR="/var/www/eisenhower-matrix"  # Change this to your actual project path
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOG_DIR="/var/log/eisenhower-matrix"
NODE_VERSION="18"  # Specify your Node.js version

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

# Function to check if directory exists
check_directory() {
    if [ ! -d "$1" ]; then
        print_error "Directory $1 does not exist!"
        exit 1
    fi
}

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_status "Installing Node.js version $NODE_VERSION..."
        
        # Install Node.js using NodeSource repository
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        if [ $? -ne 0 ]; then
            print_error "Failed to add NodeSource repository"
            exit 1
        fi
        
        apt-get update
        apt-get install -y nodejs
        
        if [ $? -eq 0 ]; then
            print_success "Node.js installed successfully: $(node --version)"
        else
            print_error "Failed to install Node.js"
            exit 1
        fi
    else
        print_success "Node.js is already installed: $(node --version)"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    if [ -f "$PROJECT_DIR/package.json" ]; then
        print_status "Installing root dependencies..."
        cd "$PROJECT_DIR"
        npm install --production
    fi
    
    # Install backend dependencies
    if [ -f "$BACKEND_DIR/package.json" ]; then
        print_status "Installing backend dependencies..."
        cd "$BACKEND_DIR"
        npm install --production
    fi
    
    # Install frontend dependencies and build
    if [ -f "$FRONTEND_DIR/package.json" ]; then
        print_status "Installing frontend dependencies..."
        cd "$FRONTEND_DIR"
        npm install
        
        print_status "Building frontend..."
        npm run build
        
        if [ $? -eq 0 ]; then
            print_success "Frontend built successfully"
        else
            print_error "Frontend build failed"
            exit 1
        fi
    fi
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    
    cd "$BACKEND_DIR"
    
    # Check if server.js exists
    if [ ! -f "server.js" ]; then
        print_error "server.js not found in $BACKEND_DIR"
        exit 1
    fi
    
    # Set environment variables
    export NODE_ENV=production
    export PORT=5000
    
    # Start backend with PM2 or directly with node
    if command -v pm2 &> /dev/null; then
        print_status "Using PM2 to start backend..."
        pm2 start server.js --name "eisenhower-backend" --env production
        pm2 save
        sleep 3
        
        # Check PM2 status
        if pm2 list | grep -q "eisenhower-backend.*online"; then
            print_success "Backend started successfully with PM2 on port 5000"
        else
            print_error "Backend failed to start with PM2"
            pm2 logs eisenhower-backend --lines 10
            exit 1
        fi
    else
        print_status "Starting backend with node..."
        nohup node server.js > "$LOG_DIR/backend.log" 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > "$LOG_DIR/backend.pid"
        
        # Wait a moment and check if process is still running
        sleep 3
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_success "Backend process started (PID: $BACKEND_PID)"
        else
            print_error "Backend process failed to start"
            print_status "Check logs at $LOG_DIR/backend.log"
            if [ -f "$LOG_DIR/backend.log" ]; then
                print_status "Last 10 lines of backend log:"
                tail -10 "$LOG_DIR/backend.log"
            fi
            exit 1
        fi
    fi
    
    # Test backend connectivity
    print_status "Testing backend connectivity..."
    sleep 2
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_success "Backend health check passed"
    else
        print_warning "Backend health check failed, but process is running"
        print_status "Backend may be starting up or health endpoint not available"
    fi
}

# Function to setup log directory
setup_logs() {
    if [ ! -d "$LOG_DIR" ]; then
        print_status "Creating log directory..."
        mkdir -p "$LOG_DIR"
        chown www-data:www-data "$LOG_DIR" 2>/dev/null || true
    fi
}

# Function to stop existing processes
stop_existing() {
    print_status "Stopping existing processes..."
    
    # Stop PM2 processes if PM2 is installed
    if command -v pm2 &> /dev/null; then
        pm2 stop eisenhower-backend 2>/dev/null || true
        pm2 delete eisenhower-backend 2>/dev/null || true
    fi
    
    # Stop processes by PID file
    if [ -f "$LOG_DIR/backend.pid" ]; then
        PID=$(cat "$LOG_DIR/backend.pid")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            print_status "Stopped backend process (PID: $PID)"
        fi
        rm -f "$LOG_DIR/backend.pid"
    fi
    
    # Kill any remaining node processes for this project
    pkill -f "node.*server.js" 2>/dev/null || true
}

# Main execution
main() {
    print_status "Starting Eisenhower Matrix Application..."
    
    # Check if running as root or with sudo
    if [ "$EUID" -ne 0 ]; then
        print_warning "This script should be run with sudo for proper setup"
    fi
    
    # Setup logs
    setup_logs
    
    # Check directories
    check_directory "$PROJECT_DIR"
    check_directory "$BACKEND_DIR"
    check_directory "$FRONTEND_DIR"
    
    # Check and install Node.js if needed
    check_node
    
    # Stop existing processes
    stop_existing
    
    # Install dependencies
    install_dependencies
    
    # Start backend
    start_backend
    
    print_success "Eisenhower Matrix Application started successfully!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: Built and served by Apache"
    print_status "Logs: $LOG_DIR"
    
    # Show status
    if command -v pm2 &> /dev/null; then
        print_status "PM2 Status:"
        pm2 status
    fi
}

# Handle script arguments
case "${1:-}" in
    "stop")
        print_status "Stopping Eisenhower Matrix Application..."
        stop_existing
        print_success "Application stopped"
        ;;
    "restart")
        print_status "Restarting Eisenhower Matrix Application..."
        stop_existing
        sleep 2
        main
        ;;
    "status")
        print_status "Checking application status..."
        if [ -f "$LOG_DIR/backend.pid" ]; then
            PID=$(cat "$LOG_DIR/backend.pid")
            if kill -0 "$PID" 2>/dev/null; then
                print_success "Backend is running (PID: $PID)"
            else
                print_error "Backend is not running"
            fi
        else
            print_error "Backend PID file not found"
        fi
        
        if command -v pm2 &> /dev/null; then
            pm2 status
        fi
        ;;
    "logs")
        print_status "Showing application logs..."
        if [ -f "$LOG_DIR/backend.log" ]; then
            tail -f "$LOG_DIR/backend.log"
        else
            print_error "Log file not found: $LOG_DIR/backend.log"
        fi
        ;;
    "install")
        print_status "Installing PM2 globally..."
        npm install -g pm2
        print_success "PM2 installed successfully"
        ;;
    *)
        main
        ;;
esac
