# Deployment Guide

## Overview
This guide covers different deployment strategies for the TypeScript backend with various database configurations.

## Environment Configurations

### Development (SQLite)
```bash
NODE_ENV=development
DATABASE_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/database.sqlite
PORT=5000
IS_SSR=true
```

### Staging (Supabase)
```bash
NODE_ENV=staging
DATABASE_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
IS_SSR=true
```

### Production (PostgreSQL + Docker)
```bash
NODE_ENV=production
DATABASE_TYPE=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DATABASE=example_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=secure-password
PORT=5000
IS_SSR=true
```

## Deployment Methods

### 1. Local Development

#### Prerequisites
- Node.js 18+
- Git

#### Steps
```bash
# Clone repository
git clone <repository-url>
cd server-ts

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run setup:db

# Start development server
npm run dev
```

### 2. Docker Compose (Recommended for Production)

#### Prerequisites
- Docker
- Docker Compose

#### Steps
```bash
# Clone repository
git clone <repository-url>
cd server-ts

# Create environment file
cp .env.example .env
# Edit .env with production values

# Build and start services
cd docker
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### Services Included
- **app**: TypeScript backend application
- **postgres**: PostgreSQL database
- **redis**: Redis cache (optional)

### 3. Manual Server Deployment

#### Prerequisites
- Ubuntu/CentOS server
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

#### Steps

1. **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Application Deployment**
```bash
# Clone and setup application
git clone <repository-url> /var/www/example-server
cd /var/www/example-server

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Setup environment
cp .env.example .env
# Edit .env with production values

# Setup database
npm run setup:db

# Start with PM2
pm2 start dist/main.js --name "example-server"
pm2 save
pm2 startup
```

3. **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/example-server
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/example-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_TYPE=postgres
heroku config:set JWT_SECRET=your-secret

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Set environment variables
3. Configure build and run commands:
   - Build: `npm run build`
   - Run: `npm start`

## Database Setup

### PostgreSQL with Docker
```bash
# Start PostgreSQL container
cd docker
docker-compose up -d postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d example_db
```

### Supabase Setup
1. Create project at https://supabase.com
2. Get URL and keys from project settings
3. Run SQL migrations in Supabase SQL editor
4. Update environment variables

### Migration from Old Backend
```bash
# Set old MongoDB URL
export OLD_MONGO_URL=mongodb://localhost:27017/old-db

# Run migration
npm run migrate:old
```

## Monitoring and Maintenance

### Health Checks
```bash
# Check application health
curl http://localhost:5000/health

# Check with Docker
docker-compose exec app curl http://localhost:5000/health
```

### Logs
```bash
# PM2 logs
pm2 logs example-server

# Docker logs
docker-compose logs -f app

# System logs
sudo journalctl -u nginx -f
```

### Backup
```bash
# SQLite backup
cp ./data/database.sqlite ./backups/database-$(date +%Y%m%d).sqlite

# PostgreSQL backup
docker-compose exec postgres pg_dump -U postgres example_db > backup.sql
```

### Updates
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Restart application
pm2 restart example-server

# Or with Docker
docker-compose up -d --build app
```

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Secrets**: Use strong, unique secrets
3. **Database**: Use strong passwords and restrict access
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS properly for your frontend domains
6. **Rate Limiting**: Configure rate limiting for API endpoints
7. **Firewall**: Configure server firewall to allow only necessary ports

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

2. **Database Connection Failed**
```bash
# Check database status
docker-compose ps
# Check logs
docker-compose logs postgres
```

3. **Permission Denied**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/example-server
```

4. **Out of Memory**
```bash
# Check memory usage
free -h
# Restart application
pm2 restart example-server
```

### Performance Optimization

1. **Enable Gzip**: Configure Nginx gzip compression
2. **Static Files**: Serve static files directly with Nginx
3. **Database Indexing**: Ensure proper database indexes
4. **Connection Pooling**: Configure database connection pooling
5. **Caching**: Implement Redis caching for frequently accessed data
