# procell API Server

Backend API server for procell e-commerce platform, built with Express.js and Node.js.

## 🚀 Features

- **Authentication**: Complete user authentication system with Supabase
- **Product Management**: CRUD operations for products and categories
- **Order Processing**: Full order management system
- **Trade-in Service**: Device valuation and trade-in requests
- **Repair Booking**: Service appointment scheduling
- **Partner Program**: Partnership application management
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Comprehensive request validation
- **Error Handling**: Structured error responses

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Environment variables configured

## 🛠️ Installation

1. **Clone and navigate to server directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` file with your configuration:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
API_PREFIX=/api/v1
```

5. **Start the server**

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📡 API Endpoints

### Base URL
- Development: `http://localhost:3001/api/v1`
- Production: `https://your-domain.com/api/v1`

### Health Check
```
GET /health
```

### Authentication
```
POST /api/v1/auth/signup      - User registration
POST /api/v1/auth/signin      - User login  
GET  /api/v1/auth/profile     - Get user profile
PUT  /api/v1/auth/profile     - Update user profile
POST /api/v1/auth/signout     - User logout
POST /api/v1/auth/refresh     - Refresh access token
```

### Products (Coming Soon)
```
GET    /api/v1/products       - Get all products
POST   /api/v1/products       - Create product (admin)
GET    /api/v1/products/:id   - Get product by ID
PUT    /api/v1/products/:id   - Update product (admin)
DELETE /api/v1/products/:id   - Delete product (admin)
```

### Orders (Coming Soon)  
```
POST /api/v1/orders           - Create order
GET  /api/v1/orders           - Get user orders
GET  /api/v1/orders/:id       - Get order by ID
PUT  /api/v1/orders/:id       - Update order status (admin)
```

### Trade-in (Coming Soon)
```
POST /api/v1/trade-in/valuate - Get device valuation
POST /api/v1/trade-in/submit  - Submit trade-in request
GET  /api/v1/trade-in         - Get user trade-in requests
```

### Repair (Coming Soon)
```
POST /api/v1/repair/book      - Book repair service
GET  /api/v1/repair           - Get user repair bookings
PUT  /api/v1/repair/:id       - Update repair status
```

### Partners (Coming Soon)
```
POST /api/v1/partners/apply        - Submit partner application
GET  /api/v1/partners/applications - Get applications (admin)
PUT  /api/v1/partners/:id          - Update application status (admin)
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for specific origins
- **Helmet**: Security headers protection
- **Input Validation**: Comprehensive request validation
- **Authentication**: JWT-based authentication with Supabase
- **Authorization**: Role-based access control (admin, customer, partner)

## 🗄️ Database Schema

The server uses Supabase with a key-value store table:

```sql
CREATE TABLE kv_store_225dbdeb (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

## 📝 Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": ["Additional error details"]
}
```

Common error codes:
- `VALIDATION_ERROR`: Request validation failed
- `AUTH_REQUIRED`: Authentication required
- `ACCESS_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs
The server uses Morgan for request logging:
- Development: Detailed dev format
- Production: Combined Apache format

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
JWT_SECRET=strong_production_secret
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style
2. Add comprehensive error handling
3. Include input validation for all endpoints
4. Write clear commit messages
5. Test your changes thoroughly

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Email: info@procell.app
- GitHub Issues: [Create an issue]
- Documentation: [API Documentation]

---

**procell** - تقنية فلسطينية متقدمة 🇵🇸