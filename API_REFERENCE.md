# API Documentation - Clinical Lab Management System

## 📚 Interactive Documentation

We've set up **automatic API documentation** using industry-standard tools!

### Access Documentation:

#### 🎨 Swagger UI (Recommended)
**URL:** http://localhost:8000/api/docs/

Features:
- **Interactive testing** - Try API endpoints directly from the browser
- **Authentication** - Test with real JWT tokens
- **Request/Response examples** - See exactly what to send and expect
- **Schema validation** - Understand required fields
- **Organized by tags** - Easy to navigate

#### 📖 ReDoc (Alternative)
**URL:** http://localhost:8000/api/redoc/

Features:
- **Clean, professional design**
- **Three-panel layout**
- **Better for reading** documentation
- **Print-friendly**

#### 📄 OpenAPI Schema (JSON)
**URL:** http://localhost:8000/api/schema/

- Download the complete OpenAPI 3.0 specification
- Import into Postman, Insomnia, or other API clients
- Generate client SDKs in any language

---

## 🚀 How to Use

### 1. Start the Backend
```bash
cd backend && source venv/bin/activate
python manage.py runserver
```

### 2. Open Swagger UI
Visit: http://localhost:8000/api/docs/

### 3. Authenticate
1. Click **"Authorize"** button (top right)
2. Login first to get a token:
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@lab.com", "password": "yourpassword"}'
   ```
3. Copy the `access` token from response
4. In Swagger UI, enter: `Bearer YOUR_ACCESS_TOKEN`
5. Click "Authorize" and "Close"

### 4. Try Endpoints
- Click any endpoint to expand
- Click "Try it out"
- Fill in parameters
- Click "Execute"
- See real response!

---

## 📋 Current API Endpoints

### Authentication (`/api/auth/`)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | ❌ No | User login with email and password |
| `/api/auth/logout` | POST | ✅ Yes | Logout and blacklist refresh token |
| `/api/auth/refresh` | POST | ❌ No | Refresh access token using refresh token |
| `/api/auth/me` | GET | ✅ Yes | Get current authenticated user info |
| `/api/auth/change-password` | POST | ✅ Yes | Change user password |
| `/api/auth/permissions` | GET | ✅ Yes | Get user's permissions |

---

## 🎯 Quick Examples

### Example 1: Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@lab.com",
  "password": "yourpassword",
  "remember_me": false
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "admin@lab.com",
    "username": "admin",
    "first_name": "",
    "last_name": "",
    "is_active": true,
    "profile": {
      "role": "superadmin",
      "phone": "",
      "branch_name": "Main Branch",
      "branch_code": "MAIN"
    }
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "access_expiration": "2024-02-08T17:00:00Z",
  "refresh_expiration": "2024-02-15T16:00:00Z"
}
```

### Example 2: Get Current User
```bash
GET /api/auth/me
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@lab.com",
  "username": "admin",
  "first_name": "",
  "last_name": "",
  "is_active": true,
  "date_joined": "2024-02-08T16:00:00Z",
  "last_login": "2024-02-08T16:05:00Z",
  "profile": {
    "role": "superadmin",
    "phone": "",
    "avatar": "",
    "branch": 1,
    "branch_name": "Main Branch",
    "branch_code": "MAIN"
  }
}
```

### Example 3: Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
Content-Type: application/json

{
  "old_password": "currentpassword",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Contraseña cambiada exitosamente."
}
```

---

## 🔐 Authentication

All protected endpoints require a **JWT Bearer token** in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Token Lifecycle:
- **Access Token**: Expires in 15 minutes
- **Refresh Token**: Expires in 7 days
- **Refresh** access token before it expires to maintain session

### Refresh Token Flow:
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

---

## 📦 Exporting Documentation

### For Postman/Insomnia:
1. Download schema: `http://localhost:8000/api/schema/`
2. Save as `openapi-schema.json`
3. Import in Postman: **Import** → **File** → Select file

### For Client SDK Generation:
```bash
# Download schema
curl http://localhost:8000/api/schema/ > openapi-schema.json

# Generate TypeScript client
npx openapi-typescript-codegen -i openapi-schema.json -o ./src/api

# Generate Python client
openapi-generator-cli generate -i openapi-schema.json -g python -o ./python-client
```

---

## 🎨 Customization

The documentation is configured in `backend/clinical_lab/settings.py`:

```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'Clinical Lab Management API',
    'DESCRIPTION': 'RESTful API for Clinical Laboratory Management System',
    'VERSION': '1.0.0',
    # ... more settings
}
```

---

## 📝 Adding Documentation to New Endpoints

When creating new API views, add OpenAPI annotations:

```python
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample

@extend_schema(
    tags=['Patients'],
    summary='Create new patient',
    description='Register a new patient in the system',
    request=PatientSerializer,
    responses={
        201: PatientSerializer,
        400: OpenApiExample(
            'Validation Error',
            value={'email': ['Invalid email format']}
        )
    }
)
@api_view(['POST'])
def create_patient(request):
    # Your view code
    pass
```

---

## 🔗 Useful Links

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/
- **Admin Panel**: http://localhost:8000/admin/
- **drf-spectacular docs**: https://drf-spectacular.readthedocs.io/

---

## 💡 Tips

1. **Use Swagger UI** for testing endpoints interactively
2. **Use ReDoc** for reading documentation and sharing with team
3. **Export schema** to generate client SDKs automatically
4. **Authorize once** in Swagger UI, all endpoints will use the token
5. **Check Examples** tab in Swagger for request/response samples

---

## 🚀 Next Steps

As we add more endpoints (patients, orders, billing, etc.), they will **automatically appear** in the documentation!

The API documentation:
- ✅ Updates automatically when you add new endpoints
- ✅ Includes request/response schemas
- ✅ Shows required vs optional fields
- ✅ Displays validation rules
- ✅ Provides interactive testing
- ✅ Exports to standard formats

---

**Happy API Testing! 🎉**


# API Endpoints Reference

Complete reference guide for all Clinical Lab Management API endpoints.

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Request/Response Formats](#requestresponse-formats)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Security](#security)

---

## Authentication Endpoints

Base URL: `/api/auth/`

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user and receive JWT tokens

**Authentication Required:** ❌ No

**Rate Limit:** 5 requests per minute per IP

**Request Body:**
```json
{
  "email": "user@example.com",      // Required - User's email address
  "password": "password123",         // Required - User's password  
  "remember_me": false               // Optional - Extend refresh token lifetime
}
```

**Success Response** (`200 OK`):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "date_joined": "2024-02-08T16:00:00Z",
    "last_login": "2024-02-08T16:05:00Z",
    "profile": {
      "role": "doctor",               // superadmin | doctor | lab_technician | finance_user | manager
      "phone": "+1234567890",
      "avatar": "",
      "branch": 1,
      "branch_name": "Main Branch",
      "branch_code": "MAIN"
    }
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",     // Access token (15 min)
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",    // Refresh token (7 days or 30 days with remember_me)
  "access_expiration": "2024-02-08T16:20:00Z",
  "refresh_expiration": "2024-02-15T16:05:00Z"
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 400 | Invalid credentials | `{"error": "Email o contraseña incorrectos."}` |
| 400 | Account locked | `{"error": "Cuenta bloqueada temporalmente..."}` |
| 400 | Account disabled | `{"error": "Esta cuenta ha sido desactivada..."}` |
| 429 | Rate limit exceeded | `{"error": "Too many requests"}` |

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@lab.com",
    "password": "securepass123",
    "remember_me": false
  }'
```

**Notes:**
- Failed login attempts are tracked
- Account locks after 5 failed attempts (15 minutes)
- `remember_me: true` extends refresh token to 30 days
- CSRF token required (cookie automatically sent)

---

### 2. Logout

**Endpoint:** `POST /api/auth/logout`

**Purpose:** Invalidate refresh token and logout user

**Authentication Required:** ✅ Yes (Bearer token)

**Rate Limit:** No limit

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."  // Required - Refresh token to blacklist
}
```

**Success Response** (`200 OK`):
```json
{
  "message": "Logout exitoso."
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 400 | Missing refresh token | `{"error": "Se requiere el token de actualización."}` |
| 400 | Invalid token | `{"error": "Token inválido o ya expirado."}` |
| 401 | Not authenticated | `{"detail": "Authentication credentials were not provided."}` |

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Notes:**
- Refresh token is added to blacklist
- Access token remains valid until expiration
- Audit log entry created

---

### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Purpose:** Get new access token using refresh token

**Authentication Required:** ❌ No (uses refresh token)

**Rate Limit:** 10 requests per minute per IP

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."  // Required - Valid refresh token
}
```

**Success Response** (`200 OK`):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",  // New access token
  "access_expiration": "2024-02-08T17:00:00Z"
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 400 | Missing refresh token | `{"error": "Se requiere el token de actualización."}` |
| 401 | Invalid/expired token | `{"error": "Token de actualización inválido o expirado."}` |
| 429 | Rate limit exceeded | `{"error": "Too many requests"}` |

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

**Notes:**
- Use before access token expires (recommended: 1 min before)
- Refresh token is rotated (new one issued)
- Old refresh token is blacklisted
- Audit log entry created

---

### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Purpose:** Retrieve authenticated user's information

**Authentication Required:** ✅ Yes (Bearer token)

**Rate Limit:** No limit

**Request Body:** None

**Success Response** (`200 OK`):
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "date_joined": "2024-02-08T16:00:00Z",
  "last_login": "2024-02-08T16:05:00Z",
  "profile": {
    "role": "doctor",
    "phone": "+1234567890",
    "avatar": "https://example.com/avatar.jpg",
    "branch": 1,
    "branch_name": "Main Branch",
    "branch_code": "MAIN"
  }
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 401 | Not authenticated | `{"detail": "Authentication credentials were not provided."}` |
| 401 | Invalid token | `{"detail": "Given token not valid for any token type"}` |

**Example:**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Notes:**
- Returns full user profile including role and branch
- Use to check if user is still authenticated
- No rate limit

---

### 5. Change Password

**Endpoint:** `POST /api/auth/change-password`

**Purpose:** Change authenticated user's password

**Authentication Required:** ✅ Yes (Bearer token)

**Rate Limit:** No limit

**Request Body:**
```json
{
  "old_password": "currentpassword",      // Required - Current password
  "new_password": "newpassword123",       // Required - New password
  "confirm_password": "newpassword123"    // Required - Confirm new password
}
```

**Password Requirements:**
- Minimum 8 characters
- Cannot be too similar to user information
- Cannot be a commonly used password
- Cannot be entirely numeric

**Success Response** (`200 OK`):
```json
{
  "message": "Contraseña cambiada exitosamente."
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 400 | Incorrect old password | `{"old_password": ["La contraseña actual es incorrecta."]}` |
| 400 | Passwords don't match | `{"confirm_password": ["Las contraseñas no coinciden."]}` |
| 400 | Same as old password | `{"new_password": ["La nueva contraseña debe ser diferente a la actual."]}` |
| 400 | Weak password | `{"new_password": ["This password is too short..."]}` |
| 401 | Not authenticated | `{"detail": "Authentication credentials were not provided."}` |

**Example:**
```bash
curl -X POST http://localhost:8000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "oldpass123",
    "new_password": "newpass123",
    "confirm_password": "newpass123"
  }'
```

**Notes:**
- Validates old password before allowing change
- New password must meet security requirements
- Password change timestamp recorded
- Audit log entry created
- User remains logged in (tokens still valid)

---

### 6. Get User Permissions

**Endpoint:** `GET /api/auth/permissions`

**Purpose:** Retrieve current user's role and permissions

**Authentication Required:** ✅ Yes (Bearer token)

**Rate Limit:** No limit

**Request Body:** None

**Success Response** (`200 OK`):
```json
{
  "role": "doctor",
  "permissions": [
    "orders.create",
    "orders.view",
    "orders.edit",
    "patients.create",
    "patients.view",
    "patients.edit",
    "patients.edit_clinical_records",
    "patients.view_clinical_records",
    "results.view",
    "results.download_pdf",
    "billing.create_invoice",
    "billing.view_invoices",
    "search.patients",
    "search.orders"
  ],
  "is_superadmin": false
}
```

**Error Responses:**

| Code | Reason | Response |
|------|--------|----------|
| 401 | Not authenticated | `{"detail": "Authentication credentials were not provided."}` |
| 500 | Error retrieving permissions | `{"error": "Error al obtener permisos del usuario."}` |

**Example:**
```bash
curl -X GET http://localhost:8000/api/auth/permissions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Notes:**
- Returns all permission codes for user's role
- Superadmins receive all permissions
- Use to show/hide UI elements based on permissions
- Permissions are checked on backend (don't rely on frontend only)

---

## Request/Response Formats

### Common Headers

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN  (for protected endpoints)
X-CSRFToken: CSRF_TOKEN  (for POST/PUT/PATCH/DELETE)
```

**Response Headers:**
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Date/Time Format
All timestamps use ISO 8601 format: `2024-02-08T16:00:00Z`

### Field Types

| Field Type | Example | Description |
|------------|---------|-------------|
| email | `"user@example.com"` | Valid email address |
| password | `"securepass123"` | Min 8 chars, various requirements |
| datetime | `"2024-02-08T16:00:00Z"` | ISO 8601 UTC timestamp |
| boolean | `true` or `false` | JSON boolean |
| integer | `123` | Whole number |
| string | `"text"` | Text value |

---

## Error Handling

### Error Response Format

All errors follow this format:
```json
{
  "error": "Human-readable error message",
  "detail": "Additional details",
  "field_name": ["Field-specific error"]
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid input |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Common Errors

**Invalid Token:**
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

**Validation Error:**
```json
{
  "email": ["Enter a valid email address."],
  "password": ["This field is required."]
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 requests | 1 minute |
| `/api/auth/refresh` | 10 requests | 1 minute |
| Other endpoints | No limit | - |

**Rate Limit Response:**
```json
{
  "error": "Too many requests"
}
```

**Headers:**
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1707408000
```

---

## Security

### CSRF Protection
- Required for: POST, PUT, PATCH, DELETE
- Automatically handled by Django
- Cookie: `csrftoken`
- Header: `X-CSRFToken`

### Token Security
- **Access tokens** expire in 15 minutes
- **Refresh tokens** expire in 7 days (30 with remember_me)
- Tokens use HS256 algorithm
- Refresh tokens are blacklisted on logout

### Account Security
- Passwords hashed with Argon2
- Failed login tracking
- Auto-lockout after 5 failures (15 minutes)
- IP address logging
- Audit trail for all auth events

### HTTPS
- Use HTTPS in production
- Secure cookies enabled in production
- HSTS headers sent

---

## Additional Resources

- **Interactive API Docs**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/
- **Admin Panel**: http://localhost:8000/admin/

---

**Last Updated:** February 8, 2024
**API Version:** 1.0.0
