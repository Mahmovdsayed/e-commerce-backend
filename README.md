# 📦 E-Commerce API

An **e-commerce REST API** built with **Node.js, Express, TypeScript, and MongoDB**.  
Supports **user authentication, authorization, Google OAuth, email verification, password reset, and user profile management**, **product and category management, coupon system, customer messaging, reviews, and shopping cart**.

---

## 🚀 Base URL

### http://localhost:3000

---

## 📂 Routes

### 🔑 Authentication (`/auth`)

| #   | Endpoint                          | Method   | Body                                                                                           | Description                                    |
| --- | --------------------------------- | -------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | `/auth/signup`                    | **POST** | `{ "name": "Mahmoud", "email": "mah@example.com", "password": "12345678" }`                    | Register new user                              |
| 2   | `/auth/signin`                    | **POST** | `{ "email": "mah@example.com", "password": "12345678" }`                                       | Sign in with email & password                  |
| 3   | `/auth/google`                    | **POST** | `{ "credential": "GOOGLE_ID_TOKEN" }`                                                          | Google OAuth sign in / sign up                 |
| 4   | `/auth/refresh-token`             | **POST** | -                                                                                              | Refresh access token using **HttpOnly cookie** |
| 5   | `/auth/logout`                    | **POST** | -                                                                                              | Logout and clear refresh token                 |
| 6   | `/auth/verify-email`              | **POST** | `{ "email": "mah@example.com", "otp": "123456" }`                                              | Verify email with OTP                          |
| 7   | `/auth/resend-verification-email` | **POST** | `{ "email": "mah@example.com" }`                                                               | Request new OTP                                |
| 8   | `/auth/forgot-password`           | **POST** | `{ "email": "mah@example.com" }`                                                               | Request password reset link                    |
| 9   | `/auth/reset-password`            | **POST** | `{ "email": "mah@example.com", "newPassword": "newPass123", "token": "RESET_PASSWORD_TOKEN" }` | Reset password using token                     |

---

### 👤 User (`/user`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`

| #   | Endpoint                | Method   | Body                                                         | Description          |
| --- | ----------------------- | -------- | ------------------------------------------------------------ | -------------------- |
| 1   | `/user/getUser/:id`     | **GET**  | -                                                            | Get user info by ID  |
| 2   | `/user/updateUser/:id`  | **PUT**  | `{ "name": "Mahmoud Updated", "email": "mah@example.com" }`  | Update user profile  |
| 3   | `/user/change-password` | **POST** | `{ "oldPassword": "12345678", "newPassword": "newPass123" }` | Change user password |

---

### ⭐ Reviews (`/reviews`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can access `getAllReviews`

| #   | Endpoint                                | Method     | Body                                           | Description                                                 |
| --- | --------------------------------------- | ---------- | ---------------------------------------------- | ----------------------------------------------------------- |
| 1   | `/reviews/add-review/:productId`        | **POST**   | `{ "rating": 5, "comment": "Great product!" }` | Add a review to a product (user only)                       |
| 2   | `/reviews/delete/:id`                   | **DELETE** | -                                              | Delete a review by ID (review owner or admin)               |
| 3   | `/reviews/all`                          | **GET**    | -                                              | Get all reviews (admin only, supports pagination & filters) |
| 4   | `/reviews/all?productId=PRODUCT_ID`     | **GET**    | -                                              | Get reviews for a specific product (admin only, paginated)  |
| 5   | `/reviews/all?rating=5&page=1&limit=10` | **GET**    | -                                              | Filter reviews by rating (admin only, paginated)            |
| 6   | `/reviews/edit/:id`                     | **PATCH**  | `{ "rating": 4, "comment": "Updated review" }` | Edit an existing review (review owner only)                 |

---

### 🏷️ Categories (`/category`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can `add`, `edit`, or `delete` categories.  
> `getAll` and `getCategoryInfo` are public.

| #   | Endpoint               | Method     | Body                                                                       | Description                                               |
| --- | ---------------------- | ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | `/category/add`        | **POST**   | `{ "name": "Electronics", "description": "Tech devices", "image": file }`  | Add a new category (**admin only**)                       |
| 2   | `/category/all`        | **GET**    | -                                                                          | Get all categories (public, supports pagination & search) |
| 3   | `/category/:id`        | **GET**    | -                                                                          | Get single category by ID (public)                        |
| 4   | `/category/edit/:id`   | **PATCH**  | `{ "name": "Updated Name", "description": "Updated Desc", "image": file }` | Update category by ID (**admin only**)                    |
| 5   | `/category/delete/:id` | **DELETE** | -                                                                          | Delete category by ID (**admin only**)                    |

---

### 🎟️ Coupons (`/coupon`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can `add`, `edit`, `delete`, or `getAll`.  
> Users can **apply a coupon** during checkout.

| #   | Endpoint                   | Method     | Body                                                                                                                                                                                                              | Description                                                     |
| --- | -------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | `/coupon/add`              | **POST**   | `{ "code": "SALE20", "discountType": "percentage", "discountValue": 20, "expirationDate": "2025-12-31", "usageLimit": 100, "minPurchaseAmount": 200, "isActive": true, "products": ["PRODUCT_ID"], "users": [] }` | Add a new coupon (**admin only**)                               |
| 2   | `/coupon/apply`            | **POST**   | `{ "codes": ["SALE20", "NEW10"], "products": [{ "_id": "PRODUCT_ID", "price": 500 }], "totalAmount": 1000 }`                                                                                                      | Apply one or multiple coupons on a cart (**user only**)         |
| 3   | `/coupon/delete/:couponId` | **DELETE** | -                                                                                                                                                                                                                 | Delete coupon by ID (**admin only**)                            |
| 4   | `/coupon/edit/:couponId`   | **PATCH**  | `{ "code": "SALE50", "discountValue": 50 }`                                                                                                                                                                       | Update coupon by ID (**admin only**)                            |
| 5   | `/coupon/all`              | **GET**    | -                                                                                                                                                                                                                 | Get all coupons (**admin only**, supports pagination & filters) |

---

### 📩 Messages (`/message`)

| #   | Endpoint                       | Method     | Body                                                                                                                        | Description                                                      |
| --- | ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | `/message/send`                | **POST**   | `{ "name": "John Doe", "email": "john@example.com", "subject": "Support needed", "message": "I need help with my order." }` | Send a new message (public)                                      |
| 2   | `/message/response/:messageId` | **POST**   | `{ "response": "Thanks for reaching out, we’ll help you shortly." }`                                                        | Send a response to a message (**admin only**)                    |
| 3   | `/message/delete/:messageId`   | **DELETE** | -                                                                                                                           | Delete a message by ID (**admin only**)                          |
| 4   | `/message/all`                 | **GET**    | -                                                                                                                           | Get all messages (**admin only**, supports pagination & filters) |
| 5   | `/message/info/:messageId`     | **GET**    | -                                                                                                                           | Get single message details by ID (**admin only**)                |

---

### 🛒 Products (`/product`)

| #   | Endpoint                                                                                           | Method | Body                                                                                                                                         | Description                                                                              |
| --- | -------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | `/product/add`                                                                                     | POST   | `{ "name": "Laptop", "description": "High performance laptop", "price": 1200, "stock": 50, "categoryId": "CATEGORY_ID", "images": [files] }` | Add a new product (**admin only**)                                                       |
| 2   | `/product/edit/:id`                                                                                | PATCH  | `{ "name": "Updated Laptop", "price": 1100 }`                                                                                                | Update product details by ID (**admin only**)                                            |
| 3   | `/product/delete/:id`                                                                              | DELETE | -                                                                                                                                            | Delete product by ID (**admin only**)                                                    |
| 4   | `/product/info/:id`                                                                                | GET    | -                                                                                                                                            | Get single product info by ID (**public**)                                               |
| 5   | `/product/all?page=1&limit=10&search=laptop&minPrice=500&maxPrice=2000&sortBy=price&sortOrder=asc` | GET    | -                                                                                                                                            | Get all products (**public**, supports pagination, filtering, sorting, search, and tags) |

---

### 🛍️ Cart (`/cart`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Each user can only have **one cart**.

| #   | Endpoint           | Method     | Body                                    | Description                              |
| --- | ------------------ | ---------- | --------------------------------------- | ---------------------------------------- |
| 1   | `/cart/add`        | **POST**   | `{ "productId": "PID", "quantity": 2 }` | Add product to cart (or update quantity) |
| 2   | `/cart/get`        | **GET**    | -                                       | Get user’s cart with all items           |
| 3   | `/cart/update`     | **PUT**    | `{ "productId": "PID", "quantity": 5 }` | Update quantity of a cart item           |
| 4   | `/cart/remove/:id` | **DELETE** | -                                       | Remove a single product from cart        |
| 5   | `/cart/clear`      | **DELETE** | -                                       | Clear all items from the cart            |

#### 📌 Notes

- `totalAmount` is automatically recalculated based on product prices.
- Adding the same product again will **update its quantity**.
- Cart data is **cached** for faster retrieval.

---

## 🛠️ Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication (Access + Refresh Tokens)**
- **Google OAuth 2.0**
- **OTP Email Verification (Nodemailer)**
- **Redis (caching)**

---

## 📧 Author

**Mahmoud Sayed**  
📩 `mahmoudsayed3576@gmail.com`
