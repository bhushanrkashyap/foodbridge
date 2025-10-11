#!/bin/bash

# FoodBridge Deployment Script for IBM LinuxONE
# This script automates the deployment process

set -e  # Exit on error

# Configuration
LINUXONE_HOST="${LINUXONE_HOST:-your-linuxone-instance}"
LINUXONE_USER="${LINUXONE_USER:-ubuntu}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/foodbridge}"
APP_NAME="foodbridge"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

# Build the project
build_project() {
    log_info "Building FoodBridge project..."
    
    # Install dependencies
    npm ci
    
    # Run build
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
        exit 1
    fi
    
    log_info "Build completed successfully"
}

# Create deployment archive
create_archive() {
    log_info "Creating deployment archive..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE_NAME="foodbridge_${TIMESTAMP}.tar.gz"
    
    tar -czf "${ARCHIVE_NAME}" -C dist .
    
    log_info "Archive created: ${ARCHIVE_NAME}"
    echo "${ARCHIVE_NAME}"
}

# Deploy to LinuxONE
deploy_to_linuxone() {
    local archive=$1
    
    log_info "Deploying to LinuxONE instance: ${LINUXONE_HOST}"
    
    # Test SSH connection
    if ! ssh -o ConnectTimeout=5 "${LINUXONE_USER}@${LINUXONE_HOST}" "echo 'SSH connection successful'" &> /dev/null; then
        log_error "Cannot connect to LinuxONE instance"
        exit 1
    fi
    
    # Create backup of current deployment
    log_info "Creating backup of current deployment..."
    ssh "${LINUXONE_USER}@${LINUXONE_HOST}" "
        if [ -d ${DEPLOY_PATH} ]; then
            sudo tar -czf ~/foodbridge_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C ${DEPLOY_PATH} . || true
        fi
    "
    
    # Transfer archive
    log_info "Transferring files to LinuxONE..."
    scp "${archive}" "${LINUXONE_USER}@${LINUXONE_HOST}:/tmp/"
    
    # Extract and deploy
    log_info "Extracting and deploying..."
    ssh "${LINUXONE_USER}@${LINUXONE_HOST}" "
        sudo mkdir -p ${DEPLOY_PATH}
        sudo tar -xzf /tmp/${archive} -C ${DEPLOY_PATH}
        sudo chown -R www-data:www-data ${DEPLOY_PATH}
        sudo chmod -R 755 ${DEPLOY_PATH}
        rm /tmp/${archive}
    "
    
    log_info "Deployment completed successfully"
}

# Restart web server
restart_webserver() {
    log_info "Restarting web server..."
    
    ssh "${LINUXONE_USER}@${LINUXONE_HOST}" "
        if systemctl is-active --quiet nginx; then
            sudo systemctl restart nginx
            echo 'Nginx restarted'
        elif systemctl is-active --quiet apache2; then
            sudo systemctl restart apache2
            echo 'Apache restarted'
        else
            echo 'No web server found running'
        fi
    "
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check if files exist
    ssh "${LINUXONE_USER}@${LINUXONE_HOST}" "
        if [ -f ${DEPLOY_PATH}/index.html ]; then
            echo 'index.html found'
        else
            echo 'ERROR: index.html not found'
            exit 1
        fi
    "
    
    log_info "Deployment verification passed"
}

# Main deployment workflow
main() {
    log_info "========================================="
    log_info "FoodBridge LinuxONE Deployment Script"
    log_info "========================================="
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --host)
                LINUXONE_HOST="$2"
                shift 2
                ;;
            --user)
                LINUXONE_USER="$2"
                shift 2
                ;;
            --path)
                DEPLOY_PATH="$2"
                shift 2
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --host HOST      LinuxONE hostname or IP"
                echo "  --user USER      SSH username (default: ubuntu)"
                echo "  --path PATH      Deployment path (default: /var/www/foodbridge)"
                echo "  --skip-build     Skip build step (use existing dist/)"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_prerequisites
    
    # Build project (unless skipped)
    if [ -z "$SKIP_BUILD" ]; then
        build_project
    else
        log_warn "Skipping build step"
        if [ ! -d "dist" ]; then
            log_error "dist/ directory not found. Cannot skip build."
            exit 1
        fi
    fi
    
    # Create archive
    ARCHIVE=$(create_archive)
    
    # Deploy
    deploy_to_linuxone "$ARCHIVE"
    
    # Restart web server
    restart_webserver
    
    # Verify
    verify_deployment
    
    # Cleanup
    rm -f "$ARCHIVE"
    
    log_info "========================================="
    log_info "Deployment completed successfully!"
    log_info "========================================="
    log_info "Access your application at: http://${LINUXONE_HOST}"
}

# Run main function
main "$@"
