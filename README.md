# 📦 E-Commerce API

An **AI-powered e-commerce REST API** built with **Node.js, Express, TypeScript, and MongoDB**.  
It provides a **complete backend solution** for modern online stores with **user authentication, product & category management, cart, orders, discounts, payments, and analytics**.

The system integrates **AI tools** for generating **product descriptions, SEO metadata, and marketing strategies**, helping merchants optimize their store and reach their audience more effectively.

It also supports **online payments via Stripe**, **Google OAuth login**, **OTP-based email verification**, and **advanced analytics** for sales and products.

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

### 📩 Messages (`/message`)

| #   | Endpoint                       | Method     | Body                                                                                                                        | Description                                                      |
| --- | ------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | `/message/send`                | **POST**   | `{ "name": "John Doe", "email": "john@example.com", "subject": "Support needed", "message": "I need help with my order." }` | Send a new message (public)                                      |
| 2   | `/message/response/:messageId` | **POST**   | `{ "response": "Thanks for reaching out, we’ll help you shortly." }`                                                        | Send a response to a message (**admin only**)                    |
| 3   | `/message/delete/:messageId`   | **DELETE** | -                                                                                                                           | Delete a message by ID (**admin only**)                          |
| 4   | `/message/all`                 | **GET**    | -                                                                                                                           | Get all messages (**admin only**, supports pagination & filters) |
| 5   | `/message/info/:messageId`     | **GET**    | -                                                                                                                           | Get single message details by ID (**admin only**)                |

---

#### 📌 Notes

- `status` field is used internally (`unread`, `read`, `responded`).
- Users **cannot send another message** if they already have an `unread` one.
- Pagination params for `/message/all`:
  - `page` (default: 1)
  - `limit` (default: 10)

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

#### 📌 Notes

- **Image** must be uploaded as `multipart/form-data` when adding products.

### Pagination params for `/product/all`

- `page` (default: `1`)
- `limit` (default: `10`)

### Filters supported

- `name`, `categoryId`, `minPrice`, `maxPrice`, `minStock`, `maxStock`, `isActive`, `tags`, `search`

### Sorting supported

- `sortBy` (e.g., `price`, `stock`, `createdAt`)
- `sortOrder` (`asc` or `desc`)

---

### 🛍️ Cart (`/cart`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`
> Each user can only have **one cart**.

| #   | Endpoint                | Method     | Body                                    | Description                              |
| --- | ----------------------- | ---------- | --------------------------------------- | ---------------------------------------- |
| 1   | `/cart/add`             | **POST**   | `{ "productId": "PID", "quantity": 2 }` | Add product to cart (or update quantity) |
| 2   | `/cart/get`             | **GET**    | -                                       | Get user’s cart with all items           |
| 3   | `/cart/update`          | **PUT**    | `{ "productId": "PID", "quantity": 5 }` | Update quantity of a cart item           |
| 4   | `/cart/remove/:id`      | **DELETE** | -                                       | Remove a single product from cart        |
| 5   | `/cart/clear`           | **DELETE** | -                                       | Clear all items from the cart            |
| 6   | `/cart/apply-discount`  | **POST**   | `{ "code": "SALE20" }`                  | Apply discount code to the cart          |
| 7   | `/cart/remove-discount` | **DELETE** | -                                       | Remove applied discount from the cart    |

#### 📌 Notes

- `totalPrice` and `totalPriceAfterDiscount` are automatically recalculated.
- Adding the same product again will **update its quantity**.
- Cart data is **cached in Redis** for faster retrieval.
- Only one discount code can be active at a time.

---

### 🎟️ Discounts (`/discount`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`
> Only **admins** can manage discounts.
> Users can only **apply discount codes** through `/cart/apply-discount`.

| #   | Endpoint               | Method     | Body                                                                                                                      | Description                            |
| --- | ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | `/discount/add`        | **POST**   | `{ "code": "SALE20", "discountType": "percentage", "discountValue": 20, "minCartValue": 100, "expiresAt": "2025-12-31" }` | Add a new discount (**admin only**)    |
| 2   | `/discount/all`        | **GET**    | -                                                                                                                         | Get all discounts (**admin only**)     |
| 3   | `/discount/:id`        | **GET**    | -                                                                                                                         | Get single discount by ID              |
| 4   | `/discount/edit/:id`   | **PATCH**  | `{ "discountValue": 50, "isActive": true }`                                                                               | Update discount by ID (**admin only**) |
| 5   | `/discount/delete/:id` | **DELETE** | -                                                                                                                         | Delete discount by ID (**admin only**) |

#### 📌 Notes

- `discountType`: `"percentage"` or `"fixed"`.
- `discountValue`:

  - If `"percentage"` → must be between **1–100**.
  - If `"fixed"` → is a numeric discount amount.

- `minCartValue`: Minimum cart total required to apply discount.
- `expiresAt`: Expiration date of the discount code.
- `isActive`: Toggle to enable/disable the discount.

---

### 📦 Orders (`/order`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Users can create orders, Admins can view all orders.

| #   | Endpoint                  | Method   | Body                                                             | Description                           |
| --- | ------------------------- | -------- | ---------------------------------------------------------------- | ------------------------------------- |
| 1   | `/order/cash/:cartId`     | **POST** | `{ "shippingAddress": "Cairo, Egypt", "phone": "+20123456789" }` | Create a new **cash order**           |
| 2   | `/order/checkout/:cartId` | **POST** | `{ "shippingAddress": "Cairo, Egypt", "phone": "+20123456789" }` | Create a **Stripe checkout session**  |
| 3   | `/order/confirm`          | **GET**  | -                                                                | Confirm order after Stripe payment    |
| 4   | `/order/all`              | **GET**  | -                                                                | Get all orders (**admin only**)       |
| 5   | `/user/orders`            | **GET**  | -                                                                | Get all orders for the logged-in user |

---

### 💳 Payments (`/payment`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can refund payments.

| #   | Endpoint                     | Method   | Body | Description                       |
| --- | ---------------------------- | -------- | ---- | --------------------------------- |
| 1   | `/payment/user/:userId`      | **GET**  | -    | Get all payments for a user       |
| 2   | `/payment/:paymentId`        | **GET**  | -    | Get payment details by ID         |
| 3   | `/payment/refund/:paymentId` | **POST** | -    | Refund a payment (**admin only**) |

---

#### 📌 Notes

- **Cash Orders** → Created instantly and marked as “paid on delivery”.
- **Checkout Orders** → Redirects to Stripe Checkout, and after successful payment the user is redirected to `/order/confirm`.
- **Payments** → Stored in the database and linked to orders.
- Users can view their own payments, and Admins can issue refunds.

---

### 🤖 AI Tools (`/ai`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can use these endpoints.  
> These routes leverage **AI** to automatically generate product descriptions, SEO metadata, and marketing strategies.

| #   | Endpoint                              | Method   | Body                                                                                                                                | Description                                                                                                                |
| --- | ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | `/ai/generate-description/:productId` | **POST** | -                                                                                                                                   | Generate a persuasive **product description** (100–150 words, professional marketing tone) for a given product.            |
| 2   | `/ai/generate-seo/:productId`         | **POST** | -                                                                                                                                   | Generate **SEO metadata** including `keywords`, `metaTitle`, and `metaDescription` tailored for the product.               |
| 3   | `/ai/generate-marketing-plan`         | **POST** | `{ "productName": "Smartwatch", "audience": "Young professionals", "tone": "Friendly", "platform": "Instagram", "gender": "male" }` | Create a **marketing strategy plan** (not ads). Suggests target audience, tone, content ideas, posting schedule, and tips. |

#### 🧾 Notes

- **`/ai/generate-description/:productId`** → Quickly creates **engaging product descriptions** in a professional marketing tone (100–150 words).
- **`/ai/generate-seo/:productId`** → Generates **SEO-friendly metadata** (keywords, meta title, meta description) to improve product visibility.
- **`/ai/generate-marketing-plan`** → Builds a **step-by-step marketing strategy** (target audience, tone, posting schedule, and tips), but **does not generate the actual ads**.

---

### 📊 Analysis (`/analysis`)

> Requires **Authentication** via `accessToken: Bearer_<accessToken>`  
> Only **admins** can access these routes.  
> These endpoints provide **analytics** for orders, products, payments, and revenue.

| #   | Endpoint                  | Method  | Query / Params     | Description                                                                 |
| --- | ------------------------- | ------- | ------------------ | --------------------------------------------------------------------------- |
| 1   | `/analysis/overview`      | **GET** | -                  | Get overall stats: total products, orders, revenue, and customers.          |
| 2   | `/analysis/sales/monthly` | **GET** | `?year=2025`       | Get monthly sales revenue & order count for a given year.                   |
| 3   | `/analysis/top-products`  | **GET** | `?limit=5`         | Get top-selling products sorted by sales (default limit = 5).               |
| 6   | `/analysis/product/:id`   | **GET** | `:id` = Product ID | Get detailed analytics for a product (sales, revenue, avg rating, reviews). |

---

#### 📌 Notes

- `overview` includes:
  - `totalProducts`, `totalOrders`, `totalRevenue`, `totalCustomers`.
- `sales/monthly` groups results by **month**.
- `top-products` sorts products by `sold` field.
- `product/:id` also returns **reviews count & average rating**.
- All data excludes cancelled orders when calculating revenue.

---

## 🛠️ Tech Stack

- **Backend Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**:
  - JWT (Access + Refresh Tokens)
  - Google OAuth 2.0
  - OTP Email Verification (via Nodemailer)
- **Payments**: Stripe API
- **AI Integration**: Google Generative AI (`@google/generative-ai`) for product descriptions, SEO, and marketing plans
- **Media Storage**: Cloudinary (Image upload & optimization) + Sharp (Image processing)
- **Caching**: Redis (via ioredis) for sessions & cart performance
- **File Uploads**: Multer
- **Utilities**:
  - bcrypt (password hashing)
  - slugify (SEO-friendly URLs)
  - nanoid (unique IDs)
- **Logging & Security**: Morgan + CORS + Cookie-parser
- **Validation**: Zod (schema validation)
- **Dev Tools**: ts-node, nodemon, TypeScript

---

## 🚀 Key Features

- Full **User System** (Auth, Roles, Profiles)
- **Products & Categories** management with SEO support
- **Shopping Cart** with discount handling
- **Order & Payment Management** (Cash + Stripe Checkout)
- **AI Tools** for marketing & SEO
- **Analytics Dashboard** (sales, top products, revenue)
- **Messaging System** for customer support

---

## 📧 Author

**Mahmoud Sayed**  
📩 `mahmoudsayed3576@gmail.com`
