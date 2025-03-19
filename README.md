
# Cartify E-Shopping App

## Overview
Cartify is a feature-rich e-commerce platform that allows users to browse products, manage their carts, place orders, and make secure payments. It supports user authentication with Google OAuth and provides an admin panel for managing products and orders.

## Features
- **User Authentication** (Google OAuth, Email & Password)
- **Product & Category Management**
- **Cart & Order Management**
- **Secure Payments**
- **Admin Panel for Managing Products & Orders**
- **RESTful API Implementation**

## Technologies Used
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** EJS, CSS
- **Authentication:** Passport.js (Google OAuth)
- **Storage:** Multer (for file uploads)
- **Security:** bcrypt, JSON Web Token (JWT)

## Installation
### Prerequisites:
- Node.js installed
- MongoDB installed and running

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/cartify.git
   cd cartify
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the required environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
4. Run the application:
   ```sh
   npm start
   ```

## Dependencies
```json
"bcrypt": "^5.1.1",
"connect-flash": "^0.1.1",
"cookie-parser": "^1.4.7",
"dotenv": "^16.4.7",
"ejs": "^3.1.10",
"express": "^4.21.2",
"express-session": "^1.18.1",
"joi": "^17.13.3",
"jsonwebtoken": "^9.0.2",
"mongoose": "^8.10.0",
"multer": "^1.4.5-lts.1",
"passport": "^0.7.0",
"passport-google-oauth20": "^2.0.0"
```

## API Endpoints
### **Index Route:**
- `GET /` - Homepage

### **Authentication Routes:**
- `GET /auth`
- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/logout`

### **Admin Routes:**
- `GET /admin`
- `POST /admin/create`
- `PUT /admin/update/:id`
- `DELETE /admin/delete/:id`

### **Product Routes:**
- `GET /product`
- `GET /product/:id`
- `POST /product/create`
- `PUT /product/update/:id`
- `DELETE /product/delete/:id`

### **Category Routes:**
- `GET /categories`
- `GET /categories/:id`
- `POST /categories/create`
- `PUT /categories/update/:id`
- `DELETE /categories/delete/:id`

### **User Routes:**
- `GET /users`
- `GET /users/:id`
- `POST /users/create`
- `PUT /users/update/:id`
- `DELETE /users/delete/:id`

### **Cart Routes:**
- `GET /cart`
- `POST /cart/add/:id`
- `DELETE /cart/remove/:id`

### **Order Routes:**
- `GET /orders`
- `GET /orders/:id`
- `POST /orders/create`
- `PUT /orders/update/:id`
- `DELETE /orders/delete/:id`

### **Profile Routes:**
- `GET /profile`
- `PUT /profile/update`

### **Payment Routes:**
- `GET /payment`
- `POST /payment/process`

### **Error Route:**
- `GET /error`

## Contribution
Feel free to contribute by opening issues or submitting pull requests!

## License
MIT License

