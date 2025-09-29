# 📦 E-Commerce API

An **e-commerce REST API** built with **Node.js, Express, TypeScript, and MongoDB**.  
Supports **user authentication, authorization, Google OAuth, email verification, password reset, and user profile management**.

---

## 🚀 Base URL

```
http://localhost:3000
```

---

## 📂 Routes

### 🔑 Authentication (`/auth`)

| # | Endpoint | Method | Body | Description |
|---|----------|--------|------|-------------|
| 1 | `/auth/signup` | **POST** | `{ "name": "Mahmoud", "email": "mah@example.com", "password": "12345678" }` | Register new user |
| 2 | `/auth/signin` | **POST** | `{ "email": "mah@example.com", "password": "12345678" }` | Sign in with email & password |
| 3 | `/auth/google` | **POST** | `{ "credential": "GOOGLE_ID_TOKEN" }` | Google OAuth sign in / sign up |
| 4 | `/auth/refresh-token` | **POST** | - | Refresh access token using **HttpOnly cookie** |
| 5 | `/auth/logout` | **POST** | - | Logout and clear refresh token |
| 6 | `/auth/verify-email` | **POST** | `{ "email": "mah@example.com", "otp": "123456" }` | Verify email with OTP |
| 7 | `/auth/resend-verification-email` | **POST** | `{ "email": "mah@example.com" }` | Request new OTP |
| 8 | `/auth/forgot-password` | **POST** | `{ "email": "mah@example.com" }` | Request password reset link |
| 9 | `/auth/reset-password` | **POST** | `{ "email": "mah@example.com", "newPassword": "newPass123", "token": "RESET_PASSWORD_TOKEN" }` | Reset password using token |

---

### 👤 User (`/user`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`

| # | Endpoint | Method | Body | Description |
|---|----------|--------|------|-------------|
| 1 | `/user/getUser/:id` | **GET** | - | Get user info by ID |
| 2 | `/user/updateUser/:id` | **PUT** | `{ "name": "Mahmoud Updated", "email": "mah@example.com" }` | Update user profile |
| 3 | `/user/change-password` | **POST** | `{ "oldPassword": "12345678", "newPassword": "newPass123" }` | Change user password |

---

### ⭐ Reviews (`/reviews`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can access `getAllReviews`

| # | Endpoint | Method | Body | Description |
|---|----------|--------|------|-------------|
| 1 | `/reviews/add-review/:productId` | **POST** | `{ "rating": 5, "comment": "Great product!" }` | Add a review to a product (user only) |
| 2 | `/reviews/delete/:id` | **DELETE** | - | Delete a review by ID (review owner or admin) |
| 3 | `/reviews/all` | **GET** | - | Get all reviews (admin only, supports pagination & filters) |
| 4 | `/reviews/all?productId=PRODUCT_ID` | **GET** | - | Get reviews for a specific product (admin only, paginated) |
| 5 | `/reviews/all?rating=5&page=1&limit=10` | **GET** | - | Filter reviews by rating (admin only, paginated) |
| 6 | `/reviews/edit/:id` | **PATCH** | `{ "rating": 4, "comment": "Updated review" }` | Edit an existing review (review owner only) |

---

#### 📌 Notes
- `rating` must be between **1–5**.  
- Pagination params:  
  - `page` (default: 1)  
  - `limit` (default: 10)  
- Filters supported in `/reviews/all`:  
  - `productId` → get reviews of a specific product  
  - `rating` → filter reviews by rating  

---

### 🏷️ Categories (`/category`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can `add`, `edit`, or `delete` categories.  
> `getAll` and `getCategoryInfo` are public.  

| # | Endpoint | Method | Body | Description |
|---|----------|--------|------|-------------|
| 1 | `/category/add` | **POST** | `{ "name": "Electronics", "description": "Tech devices", "image": file }` | Add a new category (**admin only**) |
| 2 | `/category/all` | **GET** | - | Get all categories (public, supports pagination & search) |
| 3 | `/category/:id` | **GET** | - | Get single category by ID (public) |
| 4 | `/category/edit/:id` | **PATCH** | `{ "name": "Updated Name", "description": "Updated Desc", "image": file }` | Update category by ID (**admin only**) |
| 5 | `/category/delete/:id` | **DELETE** | - | Delete category by ID (**admin only**) |

---

#### 📌 Notes
- `image` must be uploaded as **multipart/form-data**.  
- Pagination params for `/category/all`:  
  - `page` (default: 1)  
  - `limit` (default: 10)  


## 🛠️ Tech Stack

- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication (Access + Refresh Tokens)**
- **Google OAuth 2.0**
- **OTP Email Verification (Nodemailer)**

---

## 📧 Author

**Mahmoud Sayed**  
📩 `mahmoudsayed3576@gmail.com`