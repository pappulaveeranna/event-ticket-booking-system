# Production Configuration

## Environment Variables for Backend Deployment

```bash
# Database Configuration
DB_URL=jdbc:mysql://your-mysql-host:3306/event_db
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

## Environment Variables for Frontend Deployment

```bash
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Docker Configuration (Optional)

### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/event-ticket-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend Dockerfile
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Railway Deployment

1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Netlify Deployment

1. Build command: `npm run build`
2. Publish directory: `build`
3. Set environment variables in Netlify dashboard

## Database Setup for Production

```sql
-- Create production database
CREATE DATABASE event_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'event_app'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON event_db.* TO 'event_app'@'%';
FLUSH PRIVILEGES;
```