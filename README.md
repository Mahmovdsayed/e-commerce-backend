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