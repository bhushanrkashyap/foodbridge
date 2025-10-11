# FoodBridge Deployment on IBM LinuxONE

## Prerequisites

- IBM LinuxONE instance access (s390x architecture)
- LinuxONE Community Cloud token
- SSH access to LinuxONE instance
- Node.js 18+ (s390x compatible)
- PostgreSQL or Supabase connection

## Architecture Compatibility

FoodBridge is built with React + Vite, which is fully compatible with IBM Z/LinuxONE (s390x architecture).

### Verified Compatible Technologies:
- ✅ Node.js 18+ (s390x builds available)
- ✅ Vite 5.4.20 (architecture-agnostic)
- ✅ React 18.2.0 (JavaScript-based)
- ✅ Supabase Client (works on all architectures)
- ✅ Tailwind CSS (build tool, architecture-agnostic)

## Deployment Options

### Option 1: Static Build Deployment (Recommended)
Build locally and deploy static files to LinuxONE.

### Option 2: Full Node.js Deployment
Run the entire development/production server on LinuxONE.

### Option 3: Docker Container Deployment
Use Docker on LinuxONE for containerized deployment.

---

## Option 1: Static Build Deployment (Easiest)

### 1. Build the Project Locally
```bash
cd /Users/bhushanrkaashyap/Desktop/data1/foodbridge2/foodbridge
npm run build
```

This creates a `dist/` folder with static files.

### 2. Transfer to LinuxONE
```bash
# Replace with your LinuxONE instance details
scp -r dist/* username@linuxone-instance:/var/www/foodbridge/

# Or use rsync
rsync -avz dist/ username@linuxone-instance:/var/www/foodbridge/
```

### 3. Serve Static Files on LinuxONE
**Option A: Using Nginx**
```bash
# On LinuxONE instance
sudo apt update
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/foodbridge
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/foodbridge;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable and start:
```bash
sudo ln -s /etc/nginx/sites-available/foodbridge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Option B: Using Apache**
```bash
sudo apt install apache2
sudo a2enmod rewrite

# Create Apache config
sudo nano /etc/apache2/sites-available/foodbridge.conf
```

Add:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/foodbridge
    
    <Directory /var/www/foodbridge>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

---

## Option 2: Full Node.js Server on LinuxONE

### 1. Install Node.js on LinuxONE (s390x)
```bash
# SSH into LinuxONE instance
ssh username@linuxone-instance

# Install Node.js 18+ for s390x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
uname -m  # Should show s390x
```

### 2. Transfer Project to LinuxONE
```bash
# On your local machine
cd /Users/bhushanrkaashyap/Desktop/data1/foodbridge2
tar -czf foodbridge.tar.gz foodbridge/
scp foodbridge.tar.gz username@linuxone-instance:~/

# On LinuxONE instance
ssh username@linuxone-instance
tar -xzf foodbridge.tar.gz
cd foodbridge
```

### 3. Install Dependencies on LinuxONE
```bash
npm install
# If you encounter any binary issues, use:
npm install --build-from-source
```

### 4. Build and Run
```bash
# Production build
npm run build

# Preview production build
npm run preview -- --host 0.0.0.0 --port 3000

# Or run in development mode
npm run dev -- --host 0.0.0.0 --port 5174
```

### 5. Use PM2 for Process Management
```bash
# Install PM2
sudo npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'foodbridge',
    script: 'npm',
    args: 'run preview -- --host 0.0.0.0 --port 3000',
    env: {
      NODE_ENV: 'production',
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on reboot
```

---

## Option 3: Docker Container Deployment

### 1. Create Multi-Architecture Dockerfile
See `Dockerfile.linuxone` in project root.

### 2. Build and Run on LinuxONE
```bash
# On LinuxONE instance
docker build -f Dockerfile.linuxone -t foodbridge:latest .
docker run -d -p 80:80 --name foodbridge foodbridge:latest
```

---

## Environment Configuration

### Update Environment Variables for Production
```bash
# Create .env.production on LinuxONE
cat > .env.production << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-api-domain.com
EOF
```

---

## Security Considerations

### 1. Enable HTTPS (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Firewall Configuration
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. Update Supabase CORS Settings
In Supabase Dashboard → Settings → API:
- Add your LinuxONE domain to allowed origins

---

## Performance Optimization

### 1. Enable Nginx Caching
```nginx
# Add to nginx config
location /assets {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Enable HTTP/2
```bash
# In nginx config
listen 443 ssl http2;
```

### 3. Monitor Resources
```bash
# Install monitoring tools
sudo apt install htop iotop

# Monitor in real-time
htop
pm2 monit
```

---

## CI/CD Pipeline (Optional)

### Automated Deployment Script
See `deploy-linuxone.sh` in project root.

---

## Troubleshooting

### Issue: Binary incompatibility
**Solution**: Rebuild native modules
```bash
npm rebuild --build-from-source
```

### Issue: Port already in use
**Solution**: 
```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Issue: Permission denied
**Solution**:
```bash
sudo chown -R $USER:$USER /var/www/foodbridge
```

---

## Testing on LinuxONE

### Health Check
```bash
curl http://localhost:3000
curl http://your-domain.com
```

### Performance Test
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Run load test
ab -n 1000 -c 10 http://localhost:3000/
```

---

## Monitoring & Logs

### PM2 Logs
```bash
pm2 logs foodbridge
pm2 logs --lines 100
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Backup & Restore

### Backup
```bash
tar -czf foodbridge-backup-$(date +%Y%m%d).tar.gz /var/www/foodbridge
```

### Restore
```bash
tar -xzf foodbridge-backup-YYYYMMDD.tar.gz -C /
```

---

## Support

- IBM LinuxONE Community: https://community.ibm.com/community/user/ibmz-and-linuxone/groups/community-home
- Node.js on s390x: https://nodejs.org/en/download/
- Contact: bhushanrkashyap

---

## Checklist

- [ ] LinuxONE instance provisioned
- [ ] Node.js installed (if using Option 2)
- [ ] Project transferred to LinuxONE
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Build completed successfully
- [ ] Web server configured (Nginx/Apache)
- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] PM2 configured for auto-restart
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] DNS configured
- [ ] Performance tested
