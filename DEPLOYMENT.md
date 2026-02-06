# 🚀 Full Stack Deployment Guide
## Angular + Node.js + MySQL to Production

This guide covers deploying your complete application with frontend (Angular) and backend (Node.js + MySQL).

## 📋 Table of Contents

1. [Backend Deployment Options](#backend-deployment)
2. [Frontend Deployment Options](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Domain & SSL](#domain--ssl)

---

## 🔧 Backend Deployment Options

### Option 1: Heroku (Recommended)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Deploy
cd backend
git init
git add .
git commit -m "Initial deployment"
heroku git:remote -a heroku https://git.heroku.com/your-app-name.git
git push heroku main

# Set environment variables
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_DATABASE=your-db-name
heroku config:set NODE_ENV=production
```

### Option 2: AWS EC2
```bash
# Connect to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and deploy
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
npm install
pm2 start server.js --name "nimap-backend"
```

### Option 3: DigitalOcean
```bash
# Create droplet with Ubuntu
# SSH into droplet
ssh root@your-droplet-ip

# Install dependencies
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt install -y mysql-server
apt install -y nginx

# Setup Node.js app
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
npm install
pm2 start server.js --name "nimap-backend"
```

### Option 4: Vercel (Backend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel --prod
```

---

## 🎨 Frontend Deployment Options

### Option 1: Netlify (Recommended for Angular)
```bash
# Already configured in your project!
npm run build:prod
netlify deploy --prod --dir=dist/frontend

# Or drag and drop dist/frontend folder to Netlify
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
npm run build:prod
vercel --prod
```

### Option 3: AWS S3 + CloudFront
```bash
# Install AWS CLI
npm install -g @aws-cli/amazon-cloudfront

# Build and deploy
cd frontend
npm run build:prod
aws s3 sync dist/frontend s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Option 4: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Deploy
cd frontend
npm run build:prod
firebase deploy --only hosting
```

---

## 🗄️ Database Setup

### MySQL Production Database

#### Option 1: AWS RDS
```bash
# Create RDS instance via AWS Console
# Note: Security group, VPC, subnet configuration
# Connection string available in RDS console
```

#### Option 2: PlanetScale
```bash
# Install PlanetScale CLI
npm install -g planetscale

# Create database
planetscale database create your-db-name --region us-east

# Get connection string
planetscale database connect your-db-name
```

#### Option 3: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy database
railway login
railway up
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables
Create `.env` file in backend:
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_DATABASE=your-production-db-name
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment
Update `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api'
};
```

Update services to use production API:
```typescript
// In category.service.ts
private apiUrl = environment.apiUrl;

// In product.service.ts  
private apiUrl = environment.apiUrl;
```

---

## 🌐 Domain & SSL Setup

### Option 1: Netlify + Custom Domain
1. **In Netlify Dashboard**:
   - Go to Domain settings
   - Add custom domain: `yourapp.com`
   - Netlify provides SSL certificate automatically

2. **DNS Configuration**:
   ```
   Type: A Record
   Name: @
   Value: 75.2.60.153.134
   TTL: 300
   ```

### Option 2: Cloudflare (Recommended)
1. **Cloudflare Setup**:
   - Sign up for Cloudflare account
   - Add your domain to Cloudflare
   - Point nameservers to Cloudflare

2. **SSL Certificate**:
   - Cloudflare provides free SSL certificates
   - Automatic HTTPS redirection

---

## 🔗 Connecting Frontend to Backend

### CORS Configuration
Update backend `server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-frontend-domain.com', 'https://your-app.netlify.app'],
  credentials: true
}));
```

### Frontend API Configuration
Update Angular services to use production URL:
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api'
};
```

---

## 🚀 Quick Deployment Commands

### Complete Deployment (Backend + Frontend)
```bash
# 1. Deploy Backend (choose one option)
heroku git:remote -a heroku https://git.heroku.com/your-app.git
git push heroku main

# 2. Deploy Frontend
cd frontend
npm run build:prod
netlify deploy --prod --dir=dist/frontend

# 3. Update Environment
# Set production URLs in both frontend and backend
# Test the complete application
```

---

## 📊 Production Checklist

### Backend ✅
- [ ] MySQL database created and configured
- [ ] Environment variables set
- [ ] CORS configured for frontend domain
- [ ] Server running on port 3000
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured

### Frontend ✅
- [ ] Production build created
- [ ] Environment configured
- [ ] API URLs updated to production
- [ ] Routing tested
- [ ] Responsive design verified
- [ ] All CRUD operations working
- [ ] Pagination tested
- [ ] Notifications working

### Database ✅
- [ ] Database tables created
- [ ] Foreign key constraints set
- [ ] Indexes optimized
- [ ] Backup strategy planned
- [ ] Connection security configured

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### CORS Errors
```javascript
// Backend fix
app.use(cors({
  origin: true, // Allow all origins in development
  origin: ['https://yourdomain.com'], // Specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

#### Database Connection Issues
```bash
# Test connection
mysql -h your-db-host -u your-db-user -p

# Check if MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql
```

#### Build Errors
```bash
# Clear Angular cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Monitoring & Analytics

### Recommended Tools
- **Backend**: PM2 for process management
- **Frontend**: Google Analytics for Angular app
- **Database**: MySQL slow query log
- **Server**: Nginx/Apache access logs
- **Uptime**: UptimeRobot monitoring

### PM2 Commands
```bash
# List running processes
pm2 list

# Restart application
pm2 restart nimap-backend

# View logs
pm2 logs nimap-backend
```

---

## 🎯 Final Notes

1. **Security**: Always use environment variables for sensitive data
2. **Backups**: Regular database backups are essential
3. **SSL**: Use HTTPS in production
4. **Testing**: Test all CRUD operations before deployment
5. **Monitoring**: Set up alerts for application downtime
6. **Scaling**: Consider load balancers for high traffic

---

## 🆘 Support & Resources

- [Angular Documentation](https://angular.io/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [MySQL Guide](https://dev.mysql.com/doc/)
- [Netlify Docs](https://docs.netlify.com/)
- [Heroku Dev Center](https://devcenter.heroku.com/)

---

**🎉 Your application is now ready for production deployment!**
