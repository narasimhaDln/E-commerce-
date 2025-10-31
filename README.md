# E-Commerce Application - ShopEase

A full-stack e-commerce application built with React (frontend) and Node.js/Express (backend) featuring modern UI/UX, secure authentication, product management, shopping cart functionality, and professional email templates.

## 🚀 Features

### Core Features

- **User Authentication**: Secure login/register with JWT tokens
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items, quantity management
- **Admin Panel**: Full product CRUD operations for administrators
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Email Notifications**: Professional email templates for all user actions

### Advanced Features

- **Debounced Search**: Real-time search with 500ms debounce
- **Auto-scrolling Product Carousel**: Smooth testimonial-style scrolling
- **Image Carousel**: Auto-changing hero images every 2 seconds
- **Role-based Access**: User and Admin role management
- **Password Reset**: Secure password recovery flow
- **Email Verification**: Account verification system
- **CORS Security**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error management

## 🏗️ Project Structure

```
DLN FLO/E-Commerance/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Authentication logic
│   │   │   ├── product.controller.js   # Product operations
│   │   │   ├── cart.controller.js      # Shopping cart logic
│   │   │   └── user.controller.js      # User management
│   │   ├── models/
│   │   │   ├── User.js                 # User schema
│   │   │   ├── Product.js              # Product schema
│   │   │   └── Cart.js                 # Cart schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # Auth endpoints
│   │   │   ├── product.routes.js       # Product endpoints
│   │   │   ├── admin.product.routes.js # Admin product endpoints
│   │   │   ├── cart.routes.js          # Cart endpoints
│   │   │   └── user.routes.js          # User endpoints
│   │   ├── emails/
│   │   │   └── templates.js            # Email templates
│   │   ├── middleware/
│   │   │   └── auth.js                 # JWT authentication middleware
│   │   ├── utils/
│   │   │   ├── sendEmail.js            # Email sending utility
│   │   │   ├── errorHandler.js         # Error handling middleware
│   │   │   ├── notFound.js             # 404 handler
│   │   │   ├── seed.js                 # Database seeding
│   │   │   └── bootstrapAdmin.js       # Admin user creation
│   │   └── server.js                   # Main server file
│   ├── .env                            # Backend environment variables
│   └── package.json                    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Authentication context
│   │   ├── lib/
│   │   │   └── api.js                  # API client configuration
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Main landing page
│   │   │   ├── ProductDetailsPage.jsx  # Individual product view
│   │   │   ├── CartPage.jsx            # Shopping cart
│   │   │   ├── LoginPage.jsx           # User login
│   │   │   ├── RegisterPage.jsx        # User registration
│   │   │   ├── ProfilePage.jsx         # User profile
│   │   │   ├── AdminProductsPage.jsx   # Admin product management
│   │   │   ├── AboutPage.jsx           # About page
│   │   │   ├── ContactPage.jsx         # Contact page
│   │   │   ├── ForgotPasswordPage.jsx  # Password reset request
│   │   │   ├── ResetPasswordPage.jsx   # Password reset form
│   │   │   └── VerifyPage.jsx          # Email verification
│   │   ├── App.jsx                     # Main app component
│   │   └── main.jsx                    # App entry point
│   ├── .env                            # Frontend environment variables
│   └── package.json                    # Frontend dependencies
└── SETUP.md                            # Setup instructions
```

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration
- `GET /verify/:token` - Email verification
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password

### Product Routes (`/api/products`)

- `GET /` - Get all products (with search/filter)
- `GET /:id` - Get single product

### Admin Product Routes (`/api/admin/products`)

- `GET /` - Get all products (admin)
- `POST /` - Create new product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

### Cart Routes (`/api/cart`)

- `GET /` - Get user's cart
- `POST /` - Add item to cart
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove item from cart

### User Routes (`/api/users`)

- `GET /me` - Get current user profile
- `PUT /me` - Update user profile

## ⚙️ Environment Variables

### Backend (.env in backend/)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Admin Configuration
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=admin123

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Shop <your_email@gmail.com>"

# Email Branding
EMAIL_BRAND_NAME=Shop
EMAIL_BRAND_COLOR=#0ea5e9
EMAIL_LOGO_URL=https://yourstore.com/logo.png
EMAIL_HERO_URL=https://yourstore.com/email-hero.jpg
SUPPORT_EMAIL=support@shop.com
CLIENT_URL=https://shop.com
```

### Frontend (.env in frontend/)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Gmail account for SMTP (or any SMTP provider)

### Backend Setup

```bash
cd backend
npm install
# Configure .env file with your settings
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
# Configure .env file with your settings
npm run dev
```

### Database Setup

The application automatically creates an admin user on first startup using the credentials from the `.env` file.

## 🎨 Key Features Explained

### 1. **Responsive Design**

- Mobile-first approach using Tailwind CSS
- Adaptive layouts for all screen sizes
- Touch-friendly navigation and interactions

### 2. **Authentication System**

- JWT-based authentication with secure tokens
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Email verification and password reset flows

### 3. **Product Management**

- Real-time search with debouncing
- Category-based filtering
- Image upload and management
- Admin CRUD operations for products

### 4. **Shopping Cart**

- Persistent cart storage
- Quantity management
- Real-time updates
- Secure checkout preparation

### 5. **Email System**

- Professional HTML email templates
- Welcome emails for new users
- Login notifications
- Password reset emails
- Customizable branding

### 6. **UI/UX Features**

- Auto-scrolling product carousel
- Image carousel in hero section
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback

## 🔒 Security Features

- **CORS Protection**: Configured for specific origins
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: Built-in protection against abuse
- **SQL Injection Protection**: Parameterized queries

## 📱 Frontend Architecture

### React Components

- **Functional Components**: Modern React hooks approach
- **Context API**: Global state management for authentication
- **React Router**: Client-side routing with protected routes
- **Axios**: HTTP client for API communication

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first responsive approach
- **Custom Animations**: CSS animations for enhanced UX

## 🖥️ Backend Architecture

### Express.js Server

- **RESTful API**: Clean REST API design
- **Middleware**: Authentication, error handling, CORS
- **Validation**: Input validation and sanitization
- **Async/Await**: Modern asynchronous programming

### Database Models

- **User Model**: Authentication and profile data
- **Product Model**: Product catalog with images and categories
- **Cart Model**: Shopping cart persistence

### Email Templates

- **Modular Design**: Reusable email template system
- **Responsive HTML**: Mobile-friendly email layouts
- **Brand Customization**: Configurable colors and assets

## 🔄 Development Workflow

1. **Authentication Flow**:

   - User registers → Email verification → Login → JWT token issued
   - Password reset → Email with reset link → New password set

2. **Product Management**:

   - Admin creates/edits products → Image upload → Database storage
   - Users browse/search → Real-time filtering → Product details

3. **Shopping Experience**:
   - Browse products → Add to cart → Update quantities → Checkout preparation

## 🚀 Deployment

### Production Considerations

- Environment variables for all sensitive data
- Database connection pooling
- CDN for static assets
- SSL/TLS encryption
- Monitoring and logging
- Backup strategies

### Build Commands

```bash
# Backend production build
npm run start

# Frontend production build
npm run build
```

## 📈 Performance Optimizations

- **Code Splitting**: React lazy loading for components
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Browser caching for static assets
- **Debouncing**: Search input optimization
- **Virtual Scrolling**: Efficient rendering of large lists

## 🧪 Testing

The application includes comprehensive error handling and validation. For testing:

1. **User Registration/Login**: Test all auth flows
2. **Product Operations**: CRUD operations for products
3. **Cart Functionality**: Add/remove/update items
4. **Email Templates**: Verify email delivery and formatting
5. **Responsive Design**: Test on various screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎯 Conclusion

ShopEase is a comprehensive e-commerce solution that demonstrates modern web development practices with React and Node.js. The application features a clean, responsive design, robust authentication, comprehensive product management, and professional email communication. With its modular architecture and extensive feature set, it serves as an excellent foundation for real-world e-commerce applications.

The project showcases:

- Full-stack JavaScript development
- Modern UI/UX design principles
- Secure authentication and authorization
- Scalable API design
- Professional email templating
- Responsive web development
- Database design and management

Whether you're learning web development or building a production e-commerce platform, ShopEase provides a solid, well-documented foundation to build upon.
