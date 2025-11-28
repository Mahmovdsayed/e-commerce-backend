# 📦 E-Commerce API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0+-green.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

An **AI-powered e-commerce REST API** built with **Node.js, Express, TypeScript, and MongoDB**.
This project provides a **complete backend solution** for modern online stores, featuring user authentication, product management, secure payments, and AI-driven marketing tools.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
  - [Authentication](#-authentication-auth)
  - [User Management](#-user-user)
  - [Products](#-products-product)
  - [Categories](#-categories-category)
  - [Cart](#-cart-cart)
  - [Orders](#-orders-order)
  - [Payments](#-payments-payment)
  - [Discounts](#-discounts-discount)
  - [Reviews](#-reviews-reviews)
  - [Messages](#-messages-message)
  - [AI Tools](#-ai-tools-ai)
  - [Analytics](#-analysis-analysis)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🚀 Features

- **🔐 Robust Authentication**: JWT-based auth (Access + Refresh Tokens), Google OAuth 2.0, and OTP Email Verification.
- **🛒 Complete E-Commerce Flow**: Product management, shopping cart, discount codes, and order processing.
- **💳 Secure Payments**: Integrated **Stripe** for secure checkout and payment processing.
- **🤖 AI Integration**: Leverages **Google Gemini AI** to generate product descriptions, SEO metadata, and marketing plans.
- **📊 Advanced Analytics**: Dashboards for sales, revenue, top products, and customer insights.
- **☁️ Media Management**: Image uploads and optimization using **Cloudinary** and **Sharp**.
- **🚀 Serverless Ready**: Optimized for **Vercel** deployment with no Redis dependency.
- **🛡️ Security**: Rate limiting, Helmet (headers), CORS, and input validation with **Zod**.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT, Google Auth Library, Nodemailer
- **Payments**: Stripe API (with Webhooks)
- **AI**: Google Generative AI SDK
- **File Storage**: Cloudinary, Multer
- **Validation**: Zod
- **Deployment**: Vercel

---

## 📂 Project Structure

```
src/
├── DB/                 # Database connection and configuration
├── Integrations/       # External service integrations (Stripe, Gemini)
├── controllers/        # Request handlers (Auth, Product, Order, etc.)
├── helpers/            # Utility functions (Hashing, Uploads)
├── middlewares/        # Express middlewares (Auth, Validation, Error handling)
├── routes/             # API route definitions
├── types/              # TypeScript type definitions
├── utils/              # Shared utilities (Email, etc.)
├── validation/         # Zod schemas for input validation
└── index.ts            # Entry point of the application
```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (Local or Atlas)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Mahmovdsayed/e-commerce-backend.git
    cd e-commerce-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

| Variable                | Description                     | Example                               |
| :---------------------- | :------------------------------ | :------------------------------------ |
| `PORT`                  | Server port                     | `3000`                                |
| `NODE_ENV`              | Environment mode                | `development` or `production`         |
| `MONGODB_URI`           | MongoDB connection string       | `mongodb://localhost:27017/ecommerce` |
| `BASE_URL`              | Base URL of the API             | `http://localhost:3000`               |
| `EMAIL`                 | Email for sending notifications | `your-email@gmail.com`                |
| `EMAIL_PASSWORD`        | App password for email          | `your-app-password`                   |
| `SALT_ROUNDS`           | Bcrypt salt rounds              | `10`                                  |
| `TOKEN_PREFIX`          | Prefix for JWT tokens           | `Bearer_`                             |
| `LOGIN_SIG`             | Secret for Access Token         | `your-access-token-secret`            |
| `REFRESH_SIG`           | Secret for Refresh Token        | `your-refresh-token-secret`           |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID          | `your-google-client-id`               |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name           | `your-cloud-name`                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API Key              | `your-api-key`                        |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret           | `your-api-secret`                     |
| `STRIPE_SECRET_KEY`     | Stripe Secret Key               | `sk_test_...`                         |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret           | `whsec_...`                           |
| `FRONTEND_URL`          | Frontend application URL        | `http://localhost:3001`               |
| `GEMINI_API_KEY`        | Google Gemini AI API Key        | `your-gemini-key`                     |

### Running the Application

- **Development Mode** (with hot-reload):

  ```bash
  npm run dev
  ```

- **Build and Start Production**:
  ```bash
  npm run build
  npm start
  ```

The server will start at `http://localhost:3000`.

---

## 📖 API Documentation

### 🔑 Authentication (`/auth`)

| Method | Endpoint                | Description                    |
| :----- | :---------------------- | :----------------------------- |
| `POST` | `/auth/signup`          | Register a new user            |
| `POST` | `/auth/signin`          | Sign in with email & password  |
| `POST` | `/auth/google`          | Google OAuth sign in / sign up |
| `POST` | `/auth/refresh-token`   | Refresh access token           |
| `POST` | `/auth/logout`          | Logout user                    |
| `POST` | `/auth/verify-email`    | Verify email with OTP          |
| `POST` | `/auth/forgot-password` | Request password reset         |
| `POST` | `/auth/reset-password`  | Reset password with token      |

### 👤 User (`/user`)

| Method | Endpoint                | Description              |
| :----- | :---------------------- | :----------------------- |
| `GET`  | `/user/getUser/:id`     | Get user profile         |
| `PUT`  | `/user/updateUser/:id`  | Update user profile      |
| `POST` | `/user/change-password` | Change password          |
| `GET`  | `/user/orders`          | Get user's order history |

### 🛒 Products (`/product`)

| Method   | Endpoint              | Description                               |
| :------- | :-------------------- | :---------------------------------------- |
| `GET`    | `/product/all`        | Get all products (Filter, Sort, Paginate) |
| `GET`    | `/product/info/:id`   | Get single product details                |
| `POST`   | `/product/add`        | Add new product (**Admin**)               |
| `PATCH`  | `/product/edit/:id`   | Update product (**Admin**)                |
| `DELETE` | `/product/delete/:id` | Delete product (**Admin**)                |

### 🏷️ Categories (`/category`)

| Method   | Endpoint               | Description                 |
| :------- | :--------------------- | :-------------------------- |
| `GET`    | `/category/all`        | Get all categories          |
| `GET`    | `/category/:id`        | Get category details        |
| `POST`   | `/category/add`        | Add category (**Admin**)    |
| `PATCH`  | `/category/edit/:id`   | Update category (**Admin**) |
| `DELETE` | `/category/delete/:id` | Delete category (**Admin**) |

### 🛍️ Cart (`/cart`)

| Method   | Endpoint               | Description           |
| :------- | :--------------------- | :-------------------- |
| `GET`    | `/cart/get`            | Get user cart         |
| `POST`   | `/cart/add`            | Add item to cart      |
| `PUT`    | `/cart/update`         | Update item quantity  |
| `DELETE` | `/cart/remove/:id`     | Remove item from cart |
| `DELETE` | `/cart/clear`          | Clear cart            |
| `POST`   | `/cart/apply-discount` | Apply discount code   |

### 📦 Orders (`/order`)

| Method | Endpoint                  | Description                       |
| :----- | :------------------------ | :-------------------------------- |
| `POST` | `/order/cash/:cartId`     | Place Cash on Delivery order      |
| `POST` | `/order/checkout/:cartId` | Create Stripe Checkout session    |
| `POST` | `/order/webhook`          | Stripe webhook (payment callback) |
| `GET`  | `/order/all`              | Get all orders (**Admin**)        |

### 💳 Payments (`/payment`)

| Method | Endpoint                     | Description                |
| :----- | :--------------------------- | :------------------------- |
| `GET`  | `/payment/user/:userId`      | Get user payments          |
| `POST` | `/payment/refund/:paymentId` | Refund payment (**Admin**) |

### 🎟️ Discounts (`/discount`)

| Method   | Endpoint               | Description                   |
| :------- | :--------------------- | :---------------------------- |
| `GET`    | `/discount/all`        | Get all discounts (**Admin**) |
| `POST`   | `/discount/add`        | Create discount (**Admin**)   |
| `PATCH`  | `/discount/edit/:id`   | Update discount (**Admin**)   |
| `DELETE` | `/discount/delete/:id` | Delete discount (**Admin**)   |

### ⭐ Reviews (`/reviews`)

| Method   | Endpoint                         | Description     |
| :------- | :------------------------------- | :-------------- |
| `GET`    | `/reviews/all`                   | Get all reviews |
| `POST`   | `/reviews/add-review/:productId` | Add review      |
| `PATCH`  | `/reviews/edit/:id`              | Edit review     |
| `DELETE` | `/reviews/delete/:id`            | Delete review   |

### 📩 Messages (`/message`)

| Method | Endpoint                       | Description                  |
| :----- | :----------------------------- | :--------------------------- |
| `POST` | `/message/send`                | Send contact message         |
| `GET`  | `/message/all`                 | Get all messages (**Admin**) |
| `POST` | `/message/response/:messageId` | Reply to message (**Admin**) |

### 🤖 AI Tools (`/ai`)

| Method | Endpoint                              | Description                  |
| :----- | :------------------------------------ | :--------------------------- |
| `POST` | `/ai/generate-description/:productId` | Generate product description |
| `POST` | `/ai/generate-seo/:productId`         | Generate SEO tags            |
| `POST` | `/ai/generate-marketing-plan`         | Generate marketing strategy  |

### 📊 Analysis (`/analysis`)

| Method | Endpoint                  | Description          |
| :----- | :------------------------ | :------------------- |
| `GET`  | `/analysis/overview`      | Dashboard overview   |
| `GET`  | `/analysis/sales/monthly` | Monthly sales report |
| `GET`  | `/analysis/top-products`  | Top selling products |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📧 Author

**Mahmoud Sayed**

- 📩 Email: `mahmoudsayed3576@gmail.com`
