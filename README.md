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

#### 1. **Sign Up**

```http
POST /auth/signup
```

**Body:**

```json
{
  "name": "Mahmoud",
  "email": "mah@example.com",
  "password": "12345678"
}
```

---

#### 2. **Sign In**

```http
POST /auth/signin
```

**Body:**

```json
{
  "email": "mah@example.com",
  "password": "12345678"
}
```

---

#### 3. **Google Sign In / Sign Up**

```http
POST /auth/google
```

**Body:**

```json
{
  "credential": "GOOGLE_ID_TOKEN"
}
```

---

#### 4. **Refresh Access Token**

```http
POST /auth/refresh-token
```

- Uses **HttpOnly refreshToken cookie** to issue a new access token.

---

#### 5. **Logout**

```http
POST /auth/logout
```

- Clears `refreshToken` cookie and DB reference.

---

#### 6. **Verify Email (OTP)**

```http
POST /auth/verify-email
```

**Body:**

```json
{
  "email": "mah@example.com",
  "otp": "123456"
}
```

---

#### 7. **Request New OTP**

```http
POST /auth/resend-verification-email
```

**Body:**

```json
{
  "email": "mah@example.com"
}
```

---

#### 8. **Forgot Password**

```http
POST /auth/forgot-password
```

**Body:**

```json
{
  "email": "mah@example.com"
}
```

---

#### 9. **Reset Password**

```http
POST /auth/reset-password
```

**Body:**

```json
{
  "email": "mah@example.com",
  "newPassword": "newPass123",
  "token": "RESET_PASSWORD_TOKEN"
}
```

---

### 👤 User (`/user`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`

#### 1. **Get User Info**

```http
GET /user/getUser/:id
```

---

#### 2. **Update User Info**

```http
PUT /user/updateUser/:id
```

**Body:**

```json
{
  "name": "Mahmoud Updated",
  "avatar": "https://example.com/avatar.png"
}
```

---

#### 3. **Change Password**

```http
POST /user/change-password
```

**Body:**

```json
{
  "oldPassword": "12345678",
  "newPassword": "newPass123"
}
```

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
