#!/bin/bash

# Eisenhower Matrix Service Installation Script
# This script installs and configures the systemd service for auto-startup

# Configuration
PROJECT_DIR="/var/www/eisenhower-matrix"
SERVICE_NAME="eisenhower-matrix"
SERVICE_FILE="eisenhower-matrix.service"
STARTUP_SCRIPT="start-app.sh"

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

# Function to check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root or with sudo"
        exit 1
    fi
}

# Function to check if project directory exists
check_project() {
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Project directory $PROJECT_DIR does not exist!"
        print_status "Please update PROJECT_DIR in this script to match your actual project path"
        exit 1
    fi
}

# Function to install required packages
install_packages() {
    print_status "Installing required packages..."
    
    # Update package list
    apt-get update
    
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        print_status "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    else
        print_success "Node.js is already installed: $(node --version)"
    fi
    
    # Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
    else
        print_success "PM2 is already installed: $(pm2 --version)"
    fi
    
    # Install other required packages
    apt-get install -y curl wget git
}

# Function to setup project permissions
setup_permissions() {
    print_status "Setting up project permissions..."
    
    # Create log directory
    mkdir -p /var/log/eisenhower-matrix
    chown www-data:www-data /var/log/eisenhower-matrix
    
    # Set project permissions
    chown -R www-data:www-data "$PROJECT_DIR"
    chmod +x "$PROJECT_DIR/$STARTUP_SCRIPT"
    
    # Make sure the startup script is executable
    chmod +x "$PROJECT_DIR/start-app.sh"
}

# Function to install systemd service
install_service() {
    print_status "Installing systemd service..."
    
    # Copy service file to systemd directory
    cp "$PROJECT_DIR/$SERVICE_FILE" "/etc/systemd/system/$SERVICE_NAME.service"
    
    # Reload systemd daemon
    systemctl daemon-reload
    
    # Enable service for auto-start
    systemctl enable "$SERVICE_NAME"
    
    print_success "Service installed and enabled"
}

# Function to configure Apache (if needed)
configure_apache() {
    print_status "Checking Apache configuration..."
    
    if command -v apache2 &> /dev/null; then
        print_status "Apache is installed"
        
        # Check if virtual host is configured
        if [ ! -f "/etc/apache2/sites-available/eisenhower-matrix.conf" ]; then
            print_warning "Apache virtual host not found. Creating basic configuration..."
            
            cat > "/etc/apache2/sites-available/eisenhower-matrix.conf" << EOF
<VirtualHost *:80>
    ServerName todolist.su
    ServerAlias www.todolist.su
    DocumentRoot $PROJECT_DIR/frontend/dist
    
    # Proxy API requests to backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/
    ProxyPassReverse /api/ http://localhost:5000/
    
    # Serve static files
    <Directory "$PROJECT_DIR/frontend/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logging
    ErrorLog \${APACHE_LOG_DIR}/eisenhower-matrix_error.log
    CustomLog \${APACHE_LOG_DIR}/eisenhower-matrix_access.log combined
</VirtualHost>
EOF
            
            # Enable the site
            a2ensite eisenhower-matrix.conf
            a2enmod proxy
            a2enmod proxy_http
            a2enmod rewrite
            
            print_status "Apache configuration created. Please restart Apache:"
            print_warning "sudo systemctl restart apache2"
        else
            print_success "Apache virtual host already configured"
        fi
    else
        print_warning "Apache not found. Please configure your web server manually."
    fi
}

# Function to start the service
start_service() {
    print_status "Starting the service..."
    
    # Start the service
    systemctl start "$SERVICE_NAME"
    
    # Check status
    sleep 3
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        print_success "Service started successfully"
    else
        print_error "Service failed to start"
        print_status "Check logs with: journalctl -u $SERVICE_NAME -f"
        exit 1
    fi
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    systemctl status "$SERVICE_NAME" --no-pager
    
    print_status "\nService Logs (last 20 lines):"
    journalctl -u "$SERVICE_NAME" --no-pager -n 20
}

# Function to uninstall service
uninstall_service() {
    print_status "Uninstalling service..."
    
    # Stop and disable service
    systemctl stop "$SERVICE_NAME" 2>/dev/null || true
    systemctl disable "$SERVICE_NAME" 2>/dev/null || true
    
    # Remove service file
    rm -f "/etc/systemd/system/$SERVICE_NAME.service"
    
    # Reload systemd
    systemctl daemon-reload
    
    print_success "Service uninstalled"
}

# Main execution
main() {
    print_status "Installing Eisenhower Matrix Service..."
    
    check_root
    check_project
    install_packages
    setup_permissions
    install_service
    configure_apache
    start_service
    
    print_success "Installation completed successfully!"
    print_status "Service commands:"
    print_status "  Start:   sudo systemctl start $SERVICE_NAME"
    print_status "  Stop:    sudo systemctl stop $SERVICE_NAME"
    print_status "  Restart: sudo systemctl restart $SERVICE_NAME"
    print_status "  Status:  sudo systemctl status $SERVICE_NAME"
    print_status "  Logs:    sudo journalctl -u $SERVICE_NAME -f"
    
    show_status
}

# Handle script arguments
case "${1:-}" in
    "uninstall")
        print_status "Uninstalling Eisenhower Matrix Service..."
        check_root
        uninstall_service
        ;;
    "status")
        show_status
        ;;
    "restart")
        print_status "Restarting service..."
        check_root
        systemctl restart "$SERVICE_NAME"
        show_status
        ;;
    "logs")
        print_status "Showing service logs..."
        journalctl -u "$SERVICE_NAME" -f
        ;;
    *)
        main
        ;;
esac
