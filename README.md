# E-Commerce API 

NestJS e-commerce backend API with MongoDB and AWS S3 integration.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth 2.0 integration
  - Role-based access control (RBAC)
  - Email verification with OTP
  - Password reset functionality

- **Product Management**
  - Categories and subcategories
  - Brand management
  - Product CRUD operations
  - Image upload to AWS S3

- **Security**
  - Password hashing with bcrypt
  - JWT token management
  - Authentication guards
  - Role-based authorization

- **File Upload**
  - AWS S3 integration for image storage
  - Presigned URL generation
  - File validation and filtering

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- AWS Account (for S3)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-commerce-main
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the `config` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Application
PORT=3000
```

## 🚦 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

### Run unit tests
```bash
npm run test
```

### Run e2e tests
```bash
npm run test:e2e
```

### Test coverage
```bash
npm run test:cov
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /user/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "address": "123 Main St"
}
```

#### Login
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Verify Email
```http
POST /user/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Google OAuth
```http
POST /user/google-oauth
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

#### Forgot Password
```http
POST /user/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /user/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

### Category Endpoints

#### Get All Categories
```http
GET /category
Authorization: Bearer <token>
```

#### Create Category (Admin Only)
```http
POST /category
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Electronics
image: [file]
```

#### Update Category (Admin Only)
```http
PUT /category/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Updated Electronics
image: [file]
```

#### Delete Category (Admin Only)
```http
DELETE /category/:id
Authorization: Bearer <token>
```

### SubCategory Endpoints

#### Get All SubCategories
```http
GET /subcategory
Authorization: Bearer <token>
```

#### Create SubCategory (Admin Only)
```http
POST /subcategory
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Smartphones
categoryId: 507f1f77bcf86cd799439011
image: [file]
```

### Brand Endpoints

#### Get All Brands
```http
GET /brand
Authorization: Bearer <token>
```

#### Create Brand (Admin Only)
```http
POST /brand
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Apple
logo: [file]
```

#### Update Brand (Admin Only)
```http
PUT /brand/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Updated Apple
logo: [file]
```

#### Delete Brand (Admin Only)
```http
DELETE /brand/:id
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /product
Authorization: Bearer <token>
```

#### Get Product by ID
```http
GET /product/:id
Authorization: Bearer <token>
```

#### Create Product (Admin Only)
```http
POST /product
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: iPhone 15 Pro
description: Latest iPhone model
price: 999
stock: 100
categoryId: 507f1f77bcf86cd799439011
subCategoryId: 507f1f77bcf86cd799439012
brandId: 507f1f77bcf86cd799439013
images: [file1, file2, file3]
```

#### Update Product (Admin Only)
```http
PUT /product/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: iPhone 15 Pro Max
price: 1099
stock: 50
```

#### Delete Product (Admin Only)
```http
DELETE /product/:id
Authorization: Bearer <token>
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Response Example
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "john_doe",
    "role": "user"
  }
}
```

## 🛡️ Role-Based Access Control

The application supports the following roles:
- **Admin**: Full access to all resources
- **User**: Limited access to user-specific features

Protected routes require both authentication and appropriate role authorization.

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @nestjs/common | ^11.0.1 | NestJS core framework |
| @nestjs/mongoose | ^11.0.3 | MongoDB integration |
| @nestjs/jwt | ^11.0.1 | JWT authentication |
| @nestjs/passport | ^11.0.5 | Passport authentication |
| @aws-sdk/client-s3 | ^3.927.0 | AWS S3 integration |
| bcrypt | ^6.0.0 | Password hashing |
| class-validator | ^0.14.2 | Validation decorators |
| mongoose | ^8.19.2 | MongoDB ODM |
| nodemailer | ^7.0.10 | Email service |

## 🔧 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Example
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## 🔒 Security Best Practices

- Passwords are hashed using bcrypt
- JWT tokens expire after configured time
- Role-based access control for admin operations
- Input validation using class-validator
- File upload validation and sanitization
- Environment variables for sensitive data


## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please contact the development team.

---
