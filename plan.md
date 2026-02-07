# Clinical Laboratory Management Application
## Comprehensive Project Plan & Implementation Guide

**Version:** 1.1  
**Last Updated:** February 2026  
**Project Owner:** Clinical Lab Management Team  
**Status:** Planning & Initial Development

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Key Technologies](#key-technologies)
4. [Application Structure](#application-structure)
5. [First Release Features](#first-release-features)
6. [RBAC System Design (Updated)](#rbac-system-design-updated)
7. [Workflow & Development Context](#workflow--development-context)
8. [Multi-Branch Business Logic](#multi-branch-business-logic)
9. [Implementation Plan](#implementation-plan)
10. [Developer Guidance & Code Workflow](#developer-guidance--code-workflow)
11. [API Endpoint Specifications](#api-endpoint-specifications)
12. [Database Schema Overview](#database-schema-overview)
13. [Frontend Components & Pages](#frontend-components--pages)
14. [Search & History Module](#search--history-module)
15. [Google Cloud Platform Infrastructure](#google-cloud-platform-infrastructure)
16. [Software Development Best Practices](#software-development-best-practices)
17. [Security Best Practices](#security-best-practices)
18. [Future Enhancements](#future-enhancements)
19. [Deployment & Operations](#deployment--operations)

---

## Overview

A web application for managing all tasks related to a clinical laboratory: Exam ordering, exam reporting, PDF result generation, billing, financial reporting, and patient clinical records.

**Key Characteristics:**
- **Target Users:** Small to medium clinical laboratories (under 50 users)
- **Mobile-Friendly UI** Web app has to be Mobile friendly 
- **Multi-Branch Support:** Full support for managing multiple lab branches with flexible role-based access
- **Comprehensive RBAC:** Granular permissions for doctors, technicians, finance users, and managers
- **Search & History:** Full search capabilities for orders, results, and invoices with historical data retrieval
- **Security First:** Healthcare-grade security with comprehensive RBAC and audit logging
- **Cost-Efficient:** Optimized for Google Cloud Platform with minimal infrastructure costs
- **Developer-Friendly:** Comprehensive documentation and code explanations for teams new to Next.js and Django

---

## Architecture Diagram

```
                          Client Browser (HTTPS)
                                 │
                                 ▼
                           ┌──────────────┐
                           │   Nginx      │  ◄── Only exposed to internet
                           │   Proxy      │
                           └──────┬───────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
         ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
         │  Next.js     │  │   Django    │  │  PostgreSQL  │
         │  Frontend    │  │   REST API  │  │   Database   │
         │  (Port 3000) │  │ (Port 8000) │  │ (Port 5432)  │
         └──────┬───────┘  └─────┬───────┘  └──────────────┘
                │                │
                └────────────────┼──────────────────┐
                                 │                  │
                                 ▼                  ▼
                          ┌─────────────┐   ┌─────────────┐
                          │   Redis     │   │  Cloud      │
                          │  Sessions   │   │  Storage    │
                          └─────────────┘   │  (PDFs)     │
                                            └─────────────┘

**Networking:**
- Only Nginx (80/443) exposed to internet
- All internal services isolated on private Docker network
- Database, Redis, Django API NOT accessible externally
```

---

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Web Proxy** | Nginx | Reverse proxy, SSL/TLS termination, routing |
| **Frontend** | Next.js 14+ | React framework, SSR, TypeScript support |
| **Frontend Language** | TypeScript | Type safety, better DX for teams |
| **Backend** | Django 4.2+ | Python web framework, ORM, built-in admin |
| **Backend API** | Django REST Framework | RESTful API, serialization, permissions |
| **Database** | PostgreSQL 15+ | Relational DB, ACID compliance, JSON support |
| **Cache/Sessions** | Redis 7+ | High-performance session storage, caching |
| **Containerization** | Docker & Docker Compose | Consistent dev/prod environments |
| **Cloud Platform** | Google Cloud Platform | Managed services, storage, backups |
| **PDF Generation** | ReportLab / Puppeteer | Server-side PDF creation |
| **File Storage** | Google Cloud Storage | Media files, PDFs, invoices |
| **Search** | PostgreSQL Full-Text Search | Efficient order/result searching |

---

## Application Structure

```
clinical-lab-management/
│
├── nginx/
│   ├── nginx.conf                    # Production-ready Nginx configuration
│   └── ssl/                          # SSL certificates (production)
│
├── backend/                          # Django project
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Backend container definition
│   ├── manage.py                     # Django CLI
│   ├── .env.example                  # Environment variables template
│   ├── .dockerignore
│   ├── clinical_lab/                 # Main Django project folder
│   │   ├── settings.py               # Django configuration
│   │   ├── urls.py                   # URL routing
│   │   ├── wsgi.py                   # WSGI for production
│   │   └── asgi.py                   # ASGI for async
│   │
│   ├── apps/
│   │   ├── auth/                     # User management, RBAC, permissions
│   │   │   ├── models.py             # User, UserRole, Permission models
│   │   │   ├── views.py              # Login, logout, profile endpoints
│   │   │   ├── serializers.py        # Serialization for API
│   │   │   ├── permissions.py        # Custom permission classes
│   │   │   ├── urls.py               # Auth endpoints
│   │   │   └── tests.py              # Unit tests
│   │   │
│   │   ├── patients/                 # Patient clinical records
│   │   │   ├── models.py             # Patient, PatientRecord models
│   │   │   ├── views.py              # Patient CRUD, records
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   │
│   │   ├── exams/                    # Exam management, orders
│   │   │   ├── models.py             # ExamType, ExamOrder, OrderStatus
│   │   │   ├── views.py              # Order creation, listing, filtering
│   │   │   ├── serializers.py        # API serialization
│   │   │   ├── urls.py               # Exam endpoints
│   │   │   ├── services.py           # Business logic (order creation, transfer)
│   │   │   └── tests.py
│   │   │
│   │   ├── reports/                  # Exam reporting, results
│   │   │   ├── models.py             # ExamResult, Report models
│   │   │   ├── views.py              # Result submission, report generation
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── services.py           # Result validation, report logic
│   │   │   └── tests.py
│   │   │
│   │   ├── search/                   # Search & history module
│   │   │   ├── models.py             # SearchIndex model
│   │   │   ├── views.py              # Search endpoints
│   │   │   ├── services.py           # Search logic, indexing
│   │   │   ├── filters.py            # Advanced filtering
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   │
│   │   ├── pdf_generator/            # PDF creation
│   │   │   ├── models.py
│   │   │   ├── views.py              # PDF download endpoint
│   │   │   ├── services.py           # PDF generation logic
│   │   │   └── tests.py
│   │   │
│   │   ├── billing/                  # Invoices, payments
│   │   │   ├── models.py             # Invoice, Payment models
│   │   │   ├── views.py              # Invoice creation, listing
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── services.py           # Invoice generation, payment logic
│   │   │   └── tests.py
│   │   │
│   │   ├── finance/                  # Financial reports, dashboard data
│   │   │   ├── models.py             # Analytics, reporting models
│   │   │   ├── views.py              # Financial dashboard endpoints
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   ├── services.py           # Financial calculations
│   │   │   └── tests.py
│   │   │
│   │   ├── branches/                 # Branch management
│   │   │   ├── models.py             # Branch model
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   │
│   │   └── common/                   # Shared utilities
│   │       ├── middleware.py         # Custom middleware (audit logging)
│   │       ├── exceptions.py         # Custom exceptions
│   │       ├── utils.py              # Helper functions
│   │       ├── decorators.py         # Custom decorators
│   │       ├── models.py             # AuditLog, base models
│   │       └── constants.py          # Enum, constants
│   │
│   └── tests/                        # Integration tests
│       └── test_api_workflows.py
│
├── frontend/                         # Next.js project
│   ├── package.json                  # Node.js dependencies
│   ├── Dockerfile                    # Frontend container definition
│   ├── .env.local.example            # Environment variables template
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── next.config.js                # Next.js configuration
│   ├── .dockerignore
│   │
│   ├── src/
│   │   ├── pages/                    # Next.js pages (route-based)
│   │   │   ├── _app.tsx              # App wrapper, providers
│   │   │   ├── _document.tsx         # HTML structure
│   │   │   ├── index.tsx             # Home/login page
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── index.tsx         # Dashboard home
│   │   │   │
│   │   │   ├── exams/
│   │   │   │   ├── index.tsx         # Exam list/new order
│   │   │   │   ├── [id].tsx          # Exam order detail
│   │   │   │   └── pending/
│   │   │   │       └── index.tsx     # Pending orders (technician)
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── index.tsx         # Reports list
│   │   │   │   └── [id]/
│   │   │   │       └── create.tsx    # Report results entry
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── orders.tsx        # Search orders
│   │   │   │   └── results.tsx       # Search results
│   │   │   │
│   │   │   ├── patients/
│   │   │   │   ├── index.tsx         # Patient list
│   │   │   │   ├── [id].tsx          # Patient detail/records
│   │   │   │   └── create.tsx        # Create patient
│   │   │   │
│   │   │   ├── billing/
│   │   │   │   ├── index.tsx         # Invoices list
│   │   │   │   └── [id].tsx          # Invoice detail
│   │   │   │
│   │   │   ├── finance/
│   │   │   │   └── dashboard.tsx     # Financial reports
│   │   │   │
│   │   │   ├── branches/
│   │   │   │   └── index.tsx         # Branch management (admin)
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── users.tsx         # Manage users
│   │   │       ├── roles.tsx         # Manage roles
│   │   │       └── audit-logs.tsx    # View audit logs
│   │   │
│   │   ├── components/               # Reusable React components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx        # Top navigation bar
│   │   │   │   ├── Sidebar.tsx       # Left sidebar navigation
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── Forms/
│   │   │   │   ├── ExamOrderForm.tsx # Create new exam order
│   │   │   │   ├── ReportForm.tsx    # Submit exam results
│   │   │   │   ├── PatientForm.tsx   # Create/edit patient
│   │   │   │   └── FormInput.tsx     # Reusable input field
│   │   │   │
│   │   │   ├── Tables/
│   │   │   │   ├── OrdersTable.tsx   # List orders with filtering
│   │   │   │   ├── ResultsTable.tsx  # List results
│   │   │   │   ├── InvoicesTable.tsx
│   │   │   │   └── PatientsTable.tsx
│   │   │   │
│   │   │   ├── Search/
│   │   │   │   ├── OrderSearch.tsx   # Search orders console
│   │   │   │   ├── ResultSearch.tsx  # Search results console
│   │   │   │   └── AdvancedFilters.tsx
│   │   │   │
│   │   │   ├── Cards/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── FinancialCard.tsx
│   │   │   │
│   │   │   ├── Modals/
│   │   │   │   ├── ConfirmModal.tsx
│   │   │   │   ├── TransferOrderModal.tsx
│   │   │   │   └── PreviewPDFModal.tsx
│   │   │   │
│   │   │   └── Common/
│   │   │       ├── Loading.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── Notification.tsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts            # Authentication logic
│   │   │   ├── useExams.ts           # Fetch/manage exams
│   │   │   ├── useOrders.ts          # Fetch/manage orders
│   │   │   ├── useSearch.ts          # Search functionality
│   │   │   ├── useBranch.ts          # Current branch logic
│   │   │   └── useFetch.ts           # Generic data fetching
│   │   │
│   │   ├── context/                  # React Context for state
│   │   │   ├── AuthContext.tsx       # User, role, branch context
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── services/                 # API client functions
│   │   │   ├── api.ts                # Axios instance & config
│   │   │   ├── auth.ts               # Auth API calls
│   │   │   ├── exams.ts              # Exam API calls
│   │   │   ├── reports.ts            # Report API calls
│   │   │   ├── search.ts             # Search API calls
│   │   │   ├── patients.ts           # Patient API calls
│   │   │   ├── billing.ts            # Billing API calls
│   │   │   ├── finance.ts            # Finance API calls
│   │   │   └── branches.ts           # Branch API calls
│   │   │
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── auth.ts               # User, Role, Permission types
│   │   │   ├── exam.ts               # ExamType, ExamOrder types
│   │   │   ├── report.ts             # Report, ExamResult types
│   │   │   ├── patient.ts            # Patient, PatientRecord types
│   │   │   ├── billing.ts            # Invoice, Payment types
│   │   │   ├── finance.ts            # Financial data types
│   │   │   ├── search.ts             # Search query/result types
│   │   │   ├── branch.ts             # Branch types
│   │   │   └── api.ts                # API response, pagination types
│   │   │
│   │   ├── constants/                # App-wide constants
│   │   │   ├── roles.ts              # Role definitions
│   │   │   ├── permissions.ts        # Permission definitions
│   │   │   ├── orderStatus.ts        # Order status options
│   │   │   └── routes.ts             # Route paths
│   │   │
│   │   ├── utils/                    # Helper functions
│   │   │   ├── formatters.ts         # Date, currency formatting
│   │   │   ├── validators.ts         # Form validation
│   │   │   ├── errors.ts             # Error handling
│   │   │   └── storage.ts            # LocalStorage helpers
│   │   │
│   │   └── styles/                   # CSS modules & global styles
│   │       ├── globals.css
│   │       ├── variables.css
│   │       └── components/
│   │
│   └── tests/                        # Frontend tests
│       ├── __mocks__/                # Mock data
│       ├── components/               # Component tests
│       ├── hooks/                    # Hook tests
│       └── services/                 # Service/API tests
│
├── docker-compose.yml                # Local dev orchestration
├── docker-compose.prod.yml           # Production overrides
├── .env.example                      # Environment template
├── .gitignore
├── PROJECT_PLAN.md                   # This file
├── CONTRIBUTING.md                   # Contribution guidelines
├── SECURITY.md                       # Security policy
├── API_DOCUMENTATION.md              # API specs
├── DEVELOPER_GUIDE.md                # Developer onboarding
└── README.md                         # Quick start guide
```

---

## First Release Features

### 1. Role-Based Access Control (RBAC) System ⭐ CRITICAL

The RBAC system is the foundation of the application. Every feature must respect user roles and permissions.

#### User Roles & Permissions

**SUPERADMIN** - Full System Access
```
├── Can do EVERYTHING
├── View/manage all orders across ALL branches
├── View all financial reports
├── Manage users (create, edit, delete - except other superadmins)
├── Manage branches
├── Manage roles and permissions
├── View audit logs
├── Access to all features
└── No branch restriction
```

**DOCTOR** - Patient & Clinical Focus
```
├── Create exam orders (for own/assigned branches)
├── Create and modify patient clinical records
├── View exam results
├── Create invoices (from completed exams)
├── Create patient profiles
├── View branch-specific data
├── Cannot view financial reports
├── Cannot manage users or branches
└── Cannot access technician reporting interface
```

**LAB_TECHNICIAN** - Exam Processing & Reporting
```
├── Create exam orders (for own branch)
├── View pending orders (own branch only)
├── Submit exam results
├── Mark orders as completed
├── Generate PDF reports
├── Transfer orders to another branch
├── Create invoices
├── Search and view historical invoice data
├── View branch-specific data
├── Cannot access financial reports
├── Cannot manage users or patients
└── Cannot modify financial/billing settings
```

**FINANCE_USER** - Financial Data Access
```
├── View financial reports and dashboards
├── View and manage invoices
├── View payment records
├── Export financial data
├── View-only access to orders and results (cannot create/modify)
├── View-only access to patients (cannot modify)
├── Branch-specific financial access
├── Cannot create or modify orders
├── Cannot submit exam results
└── Cannot manage system settings
```

**MANAGER** - Branch & Staff Management
```
├── All permissions of LAB_TECHNICIAN role
├── Create and modify users (cannot create superadmins)
├── Create and manage branches
├── Assign users to branches
├── View financial data for own/assigned branches
├── Generate reports
├── Transfer orders between branches
├── Manage roles (limited - cannot create superadmin role)
└── Cannot access system-wide financial reports (superadmin only)
```

#### Permission Structure Matrix

| Permission | SuperAdmin | Doctor | Lab Tech | Finance | Manager |
|-----------|:--:|:--:|:--:|:--:|:--:|
| Create Orders | ✅ | ✅ | ✅ | ❌ | ✅ |
| Submit Results | ✅ | ❌ | ✅ | ❌ | ✅ |
| Transfer Orders | ✅ | ❌ | ✅ | ❌ | ✅ |
| View All Orders | ✅ | ❌ | ❌ | ✅ | ✅ |
| Create Patients | ✅ | ✅ | ❌ | ❌ | ❌ |
| Modify Patient Records | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Invoices | ✅ | ✅ | ✅ | ❌ | ✅ |
| View Financials | ✅ | ❌ | ❌ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Branches | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Roles | ✅ | ❌ | ❌ | ❌ | Limited |
| View Audit Logs | ✅ | ❌ | ❌ | ❌ | Limited |

**CRITICAL RULE:** Permission validation MUST be done in the backend. Frontend can show/hide UI elements but never trust frontend-only security.

---

### 2. Exam Order Generation Module

Users with appropriate roles (Doctor, Lab Technician, Manager) can create exam orders.

**Features:**
- Display list of available exams
- Show price for each exam
- Total price calculation
- Select multiple exams
- Patient association
- Branch assignment
- Order submission

---

### 3. Patient Clinical Records

Doctors can create and manage patient profiles with clinical information.

**Features:**
- Create patient profiles
- Store clinical history
- Manage medical conditions
- Track medications
- Associate exam orders with patients

---

### 4. Multi-Branch Order Management

Orders can be transferred between branches while maintaining origin information.

```
Order Created in Branch A (root_branch = A)
         │
         ▼
Can be transferred to Branch B by Lab Tech/Manager
         │
         ├─ root_branch = A (NEVER changes)
         └─ current_branch = B
         │
         ▼
When technician in Branch B submits results:
         │
         ├─ Results stored with current_branch = B
         ├─ Order marked as COMPLETED
         └─ Visible to both Branch A and B users
```

---

### 5. Technician Reporting Interface

Technicians see ONLY orders for their assigned branch, filtered by status = PENDING.

**Features:**
- View pending orders
- Select order to process
- Dynamically show ONLY requested exams
- Enter results with validation
- Mark order as completed
- Generate PDF report

---

### 6. Search & History Console 
Two separate search consoles for easy data retrieval.

#### Orders Search Console
- Search by order number
- Filter by patient name/ID
- Filter by date range
- Filter by status (pending, in_progress, completed)
- Filter by branch
- Filter by exam type
- Display full order history
- Allow order re-download/re-print

#### Results Search Console
- Search by patient name/ID
- Filter by date range
- Filter by exam type
- Filter by abnormal flag
- Filter by branch
- Display result history
- Allow PDF re-download
- View original order info

---

### 7. Billing Module

Generate invoices linked to exam orders.

**Features:**
- Create invoice from completed orders
- Track payment status (paid, unpaid, partial)
- Generate invoice PDF
- Record payment transactions
- Apply discounts
- Search historical invoice data
- View payment history

---

### 8. Financial Report Dashboard

Authorized users (Finance, Manager, Superadmin) view financial metrics.

**Features:**
- Total revenue (filtered by date range, branch)
- Outstanding payments
- Completed orders count
- Revenue per exam type
- Branch comparisons (superadmin only)
- Trend analysis
- Export capability

---

### 9. PDF Report Generation

Generate lab reports with:
- Branch details (where results entered)
- Patient information
- Exam results with reference ranges
- Technician signature/name
- Original branch indicator (if transferred)
- Date/time

---

## Workflow & Development Context

### For Developers New to Next.js and Django

**This team is new to both Next.js and Django.** Therefore:

1. **Every code module must include clear explanations:**
   - What the code does
   - Why it's structured that way
   - How it relates to business logic
   - How to extend/modify it

2. **Use descriptive naming:**
   ```
   ✅ GOOD:
   - handleExamOrderSubmission()
   - fetchPendingOrdersByBranch()
   - validateExamResultInput()
   - transferOrderToAnotherBranch()
   - calculateTotalInvoiceAmount()
   
   ❌ BAD:
   - handleSubmit()
   - fetchData()
   - validate()
   - transfer()
   - calculate()
   ```

3. **Add inline comments for complex logic:**
   ```python
   # Backend example
   def create_exam_order(request):
       """
       Creates a new exam order for the current user's branch.
       
       IMPORTANT: Permission check ensures user can only create orders
       for their assigned branch (or superadmin can create for any).
       
       Request expects:
       - patient_id: int (reference to Patient)
       - patient_name: str
       - exam_types: list of exam IDs
       - branch_id: int (optional, defaults to user's branch)
       
       Returns: ExamOrder object with status=PENDING
       
       Permissions Required:
       - create_order (Doctor, Lab Tech, Manager)
       """
       # Check permission
       if not has_permission(request.user, 'create_order'):
           raise PermissionDenied()
       
       # Auto-assign user's branch if not provided
       if not request.data.get('branch_id'):
           request.data['branch_id'] = request.user.userprofile.branch_id
       
       # ... rest of logic
   ```

4. **Frontend example with explanations:**
   ```typescript
   // Frontend example
   const handleOrderSubmission = async (formData: ExamOrderFormData) => {
     /**
      * Workflow:
      * Step 1: Validate form data client-side (quick feedback to user)
      * Step 2: Call backend API to create order
      * Step 3: Backend validates permissions and persists to DB
      * Step 4: Show success notification with order number
      * Step 5: Redirect to orders list or detail page
      * 
      * Error handling:
      * - Network errors: Show retry button
      * - Validation errors: Show field-specific errors
      * - Permission errors: Show message and redirect to dashboard
      */
     
     // Step 1: Validate before sending (quick client-side check)
     const validationError = validateOrderForm(formData);
     if (validationError) {
       showError(validationError.message);
       return;
     }
     
     setLoading(true);
     try {
       // Step 2-3: Call backend
       const response = await api.post('/api/exams/orders/', formData);
       
       // Step 4: Show success
       showSuccess(`Order created successfully: ${response.data.order_number}`);
       
       // Step 5: Redirect
       router.push(`/exams/${response.data.id}`);
     } catch (error) {
       // Handle different error types
       if (error.response?.status === 403) {
         showError('You do not have permission to create orders');
       } else if (error.response?.status === 400) {
         showError(`Invalid data: ${error.response.data.message}`);
       } else {
         showError(`Failed to create order: ${error.message}`);
       }
     } finally {
       setLoading(false);
     }
   };
   ```

### Project Evolution Considerations

The app will grow. Design for extensibility:

- **Modular folder structure:** Easy to add new features without modifying existing code
- **Scalable API design:** Use proper serializers, pagination, filtering in Django
- **Component reusability:** Create generic components that work across features
- **Clear separation of concerns:** Business logic in services, not in views/pages
- **Database schema:** Design for future expansions (patient records, advanced analytics, etc.)

---

## RBAC System Design

### Role & Permission Architecture

```
User
├── has one: UserProfile
│   ├── role (choices: superadmin, doctor, lab_technician, finance_user, manager)
│   ├── branch (foreign key to Branch, null for superadmin)
│   └── permissions (M2M to Permission via RolePermission)
│
└── has many: Permissions (via UserProfile.role)

Role
├── name (choices above)
├── description
└── permissions (M2M to Permission)

Permission
├── code_name (unique): 'view_orders', 'create_order', 'submit_results'
├── name: "Can view orders"
├── description: "User can view exam orders"
├── category: "exams" or "reports" or "billing" or "admin"
└── requires_branch_check: boolean (some permissions are branch-scoped)
```

### Permission Codes by Category

```
# Exam/Order Permissions
exams.create_order              → Can create new exam orders
exams.view_orders               → Can see orders (filtered by role)
exams.view_all_orders           → Can see all orders (superadmin, manager)
exams.edit_order                → Can edit pending orders
exams.delete_order              → Can delete orders
exams.transfer_order            → Can transfer to another branch
exams.list_pending              → Can see pending order list

# Patient Permissions
patients.create_patient         → Can create patient profiles
patients.view_patients          → Can view patient data
patients.edit_patient           → Can modify patient records
patients.view_clinical_records  → Can view medical history
patients.create_clinical_record → Can add clinical notes

# Report Permissions
reports.submit_results          → Can submit exam results
reports.view_reports            → Can see reports (filtered by role)
reports.view_all_reports        → Can see all reports (superadmin)
reports.download_pdf            → Can download PDF reports
reports.edit_results            → Can edit submitted results

# Billing Permissions
billing.create_invoice          → Can create invoices
billing.view_invoices           → Can view invoices (filtered)
billing.view_all_invoices       → Can see all invoices (superadmin)
billing.edit_invoice            → Can edit unpaid invoices
billing.record_payment          → Can record payments
billing.search_invoice_history  → Can search historical invoices

# Finance Permissions
finance.view_dashboard          → Can view financial dashboard
finance.view_all_finance        → Can see all branches (superadmin)
finance.export_reports          → Can export financial data

# Search Permissions
search.orders                   → Can search orders
search.results                  → Can search results
search.historical_data          → Can access historical records

# Admin Permissions
admin.manage_users              → Can create/edit/delete users
admin.manage_branches           → Can manage branch configuration
admin.manage_roles              → Can assign roles (limited)
admin.view_audit_logs           → Can view audit logs
```

### Implementation Example

```python
# Django: Define roles and permissions
from django.contrib.auth.models import Group, Permission
from apps.auth.models import Role

def setup_rbac():
    """Setup RBAC on first database migration"""
    
    # Create roles
    superadmin_role, _ = Role.objects.get_or_create(
        name='superadmin',
        defaults={'description': 'Full system access'}
    )
    doctor_role, _ = Role.objects.get_or_create(
        name='doctor',
        defaults={'description': 'Can create patients and orders, view results'}
    )
    technician_role, _ = Role.objects.get_or_create(
        name='lab_technician',
        defaults={'description': 'Can process orders and submit results'}
    )
    finance_role, _ = Role.objects.get_or_create(
        name='finance_user',
        defaults={'description': 'View financial data'}
    )
    manager_role, _ = Role.objects.get_or_create(
        name='manager',
        defaults={'description': 'Manage staff and view financials'}
    )
    
    # Define permissions for each role
    superadmin_perms = Permission.objects.all()
    
    doctor_perms = Permission.objects.filter(
        codename__in=[
            'create_order',
            'view_orders',
            'create_patient',
            'edit_patient_record',
            'view_clinical_records',
            'create_invoice',
            'view_invoices',
        ]
    )
    
    technician_perms = Permission.objects.filter(
        codename__in=[
            'create_order',
            'view_orders',
            'view_pending_orders',
            'submit_results',
            'transfer_order',
            'download_pdf',
            'create_invoice',
            'view_invoices',
            'search_invoices',
        ]
    )
    
    finance_perms = Permission.objects.filter(
        codename__in=[
            'view_financial_dashboard',
            'view_invoices',
            'view_orders_readonly',
            'view_results_readonly',
            'export_financial_data',
        ]
    )
    
    manager_perms = Permission.objects.filter(
        codename__in=[
            # All technician permissions
            'create_order',
            'view_orders',
            'submit_results',
            'transfer_order',
            'create_invoice',
            'view_invoices',
            # Plus management permissions
            'manage_users',
            'manage_branches',
            'assign_users_to_branch',
            'view_financial_dashboard',
        ]
    )
    
    # Assign permissions to roles
    superadmin_role.permissions.set(superadmin_perms)
    doctor_role.permissions.set(doctor_perms)
    technician_role.permissions.set(technician_perms)
    finance_role.permissions.set(finance_perms)
    manager_role.permissions.set(manager_perms)
```

---

## Multi-Branch Business Logic (SUGGESTION BUT CAN MAKE IMPROVEMENTS IF NEEDED)

### Database Model Design

```python
class Branch(models.Model):
    """Represents a physical lab location"""
    name = models.CharField(max_length=255)  # e.g., "Downtown Lab"
    code = models.CharField(max_length=10, unique=True)  # e.g., "DT001"
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ExamOrder(models.Model):
    """Exam order with branch tracking"""
    order_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey('patients.Patient', on_delete=models.PROTECT)
    
    # Branch tracking
    root_branch = models.ForeignKey(
        Branch, 
        on_delete=models.PROTECT,
        related_name='orders_created'
    )  # Original branch (never changes)
    
    current_branch = models.ForeignKey(
        Branch,
        on_delete=models.PROTECT,
        related_name='orders_in_progress'
    )  # Can change if transferred
    
    # Status and metadata
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('in_progress', 'In Progress'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
        ],
        default='pending'
    )
    
    created_by = models.ForeignKey(User, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['root_branch', 'status']),
            models.Index(fields=['current_branch', 'status']),
            models.Index(fields=['patient', 'created_at']),
        ]
```

### Access Control Logic

```python
class OrderAccessFilter:
    """
    Determines which orders a user can access based on role and branch
    """
    
    @staticmethod
    def get_accessible_orders(user):
        """
        Returns queryset of orders user can access.
        
        Rules:
        - Superadmin: all orders
        - Doctor: orders from their branches
        - Lab Tech: pending + assigned branch orders
        - Manager: all orders from assigned branches
        - Finance: all orders (view-only)
        """
        
        if user.is_superuser or user.userprofile.role == 'superadmin':
            # Superadmin sees everything
            return ExamOrder.objects.all()
        
        user_branch = user.userprofile.branch
        user_role = user.userprofile.role
        
        if user_role == 'lab_technician':
            # Technicians only see pending orders from their branch
            return ExamOrder.objects.filter(
                current_branch=user_branch,
                status='pending'
            )
        
        elif user_role == 'doctor':
            # Doctors see orders from their branch
            return ExamOrder.objects.filter(
                root_branch=user_branch
            )
        
        elif user_role in ['manager', 'finance_user']:
            # Managers see all branch orders
            return ExamOrder.objects.filter(
                models.Q(root_branch=user_branch) | 
                models.Q(current_branch=user_branch)
            )
        
        # Default: no access
        return ExamOrder.objects.none()
```

---

## Implementation Plan

### Phase 1: Project Setup (Week 1)
- [ ] Initialize Git repository
- [ ] Create Django project structure
- [ ] Create Next.js project with TypeScript
- [ ] Set up Docker containers for local development (dev)
- [ ] Docker Files and Docker Compose set up.
- [ ] Makefile with commands to speed up processes
- [ ] Login page design (UI) and Main menu/Welcome Screen of app

**Deliverables:** Working docker-compose up, frontend/backend running, Nginx routing correctly

### Phase 2: Authentication & RBAC (Week 2-3)
- [ ] Create User and UserProfile models
- [ ] Implement role definitions with updated roles
- [ ] Create Permission system with all permission codes
- [ ] Implement login/logout endpoints
- [ ] Create custom permission classes
- [ ] Write authentication tests

**Deliverables:** Users login/logout, roles assigned, permissions enforced

### Phase 3: Branch Management (Week 3-4)
- [ ] Create Branch model
- [ ] Build branch management endpoints
- [ ] Link users to branches
- [ ] Implement branch filtering in views

**Deliverables:** Branches created/managed, users assigned, UI shows current branch

### Phase 4: Patient Management (Week 4-5)
- [ ] Create Patient model
- [ ] Create PatientRecord model (clinical records)
- [ ] Build patient CRUD endpoints
- [ ] Build patient profile page
- [ ] Implement doctor permission checks

**Deliverables:** Doctors can create/manage patients and clinical records

### Phase 5: Exam Management (Week 5-6)
- [ ] Create ExamType, ExamOrder models
- [ ] Build order creation endpoint
- [ ] Build order list endpoint with filtering
- [ ] Implement order transfer logic
- [ ] Build order detail page
- [ ] Write comprehensive tests

**Deliverables:** Orders created, listed, transferred, data persisted

### Phase 6: Search & History Module (Week 6-7) ⭐ NEW
- [ ] Create search indexes
- [ ] Build search endpoints for orders
- [ ] Build search endpoints for results
- [ ] Implement advanced filtering
- [ ] Build search UI components
- [ ] Historical data retrieval
- [ ] Write search tests

**Deliverables:** Search consoles working, historical data accessible, filters functional

### Phase 7: Technician Reporting (Week 7-8)
- [ ] Create ExamResult model
- [ ] Create Report model
- [ ] Build submit results endpoint
- [ ] Build pending orders dashboard
- [ ] Build report form component
- [ ] Create PDF generation service
- [ ] Write tests

**Deliverables:** Technicians submit results, PDFs generated, orders marked completed

### Phase 8: Billing Module (Week 8-9)
- [ ] Create Invoice, Payment models
- [ ] Build invoice creation endpoint
- [ ] Build invoice search endpoint
- [ ] Implement payment tracking
- [ ] Build invoices list page
- [ ] Add payment recording UI
- [ ] Write tests

**Deliverables:** Invoices created/managed, payments tracked, history searchable

### Phase 9: Financial Dashboard (Week 9-10)
- [ ] Create financial aggregation service
- [ ] Build dashboard endpoints
- [ ] Implement role-based filtering
- [ ] Build dashboard page with charts
- [ ] Add export capability
- [ ] Write tests

**Deliverables:** Dashboard displays metrics, role-based filtering, exports work

### Phase 10: Testing & QA (Week 10-11)
- [ ] Write unit tests (>80% coverage)
- [ ] Write integration tests
- [ ] Write E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing
- [ ] Load testing

**Deliverables:** >80% code coverage, all flows tested, no vulnerabilities

### Phase 11: Documentation & Deployment (Week 11-12)
- [ ] Complete API documentation
- [ ] Create developer guide
- [ ] Create user guides per role
- [ ] Deploy to GCP
- [ ] Set up monitoring
- [ ] Create deployment runbook

**Deliverables:** Complete docs, live system, monitoring active

---

## Developer Guidance & Code Workflow

[Previous Next.js and Django sections remain the same...]

---

## Search & History Module

### Search Features

#### Orders Search Console

**Query Parameters:**
```
GET /api/search/orders/
  ?q=ORD-2026-001          # Order number
  &patient_name=John        # Patient name
  &patient_id=P123          # Patient ID
  &date_from=2026-01-01     # Date range
  &date_to=2026-02-07
  &status=completed         # Order status
  &branch_id=1              # Branch filter
  &exam_type=blood          # Exam type
  &page=1
  &limit=25
```

**Response:**
```json
{
  "count": 150,
  "next": "?page=2",
  "results": [
    {
      "id": 1,
      "order_number": "ORD-2026-001234",
      "patient_name": "John Doe",
      "patient_id": "P123",
      "status": "completed",
      "root_branch": "Downtown Lab",
      "current_branch": "Downtown Lab",
      "exam_types": ["Blood Test", "Glucose"],
      "created_at": "2026-02-07T10:00:00Z",
      "completed_at": "2026-02-07T14:00:00Z"
    }
  ]
}
```

#### Results Search Console

**Query Parameters:**
```
GET /api/search/results/
  ?q=blood test             # Search by exam type
  &patient_name=John        # Patient name
  &patient_id=P123          # Patient ID
  &date_from=2026-01-01     # Date range
  &date_to=2026-02-07
  &exam_type=blood          # Specific exam
  &is_abnormal=true         # Filter abnormal
  &branch_id=1              # Branch filter
  &order_number=ORD-001     # Linked order
  &page=1
  &limit=25
```

**Response:**
```json
{
  "count": 45,
  "next": "?page=2",
  "results": [
    {
      "id": 1,
      "order_number": "ORD-2026-001234",
      "patient_name": "John Doe",
      "patient_id": "P123",
      "exam_type": "Blood Test",
      "result_value": "12.5",
      "unit": "mg/dL",
      "reference_range": "10-15",
      "is_abnormal": false,
      "created_at": "2026-02-07T14:00:00Z",
      "pdf_available": true,
      "pdf_url": "/api/reports/1/pdf/"
    }
  ]
}
```

### Frontend Search Components

```typescript
// Search/OrderSearch.tsx
export function OrderSearch() {
  /**
   * Orders Search Console
   * 
   * Features:
   * - Quick search by order number
   * - Advanced filters (patient, date, status, branch, exam type)
   * - Display results in table
   * - Pagination
   * - Actions: view detail, re-download PDF, view results
   */
  const [filters, setFilters] = useState({
    q: '',
    patient_name: '',
    patient_id: '',
    status: '',
    branch_id: '',
    exam_type: '',
    date_from: '',
    date_to: '',
  });
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/search/orders/', { params: filters });
      setResults(data.results);
    } catch (error) {
      showError('Search failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Search Orders</h1>
      {/* Filter inputs */}
      <OrderSearch Filters filters={filters} setFilters={setFilters} />
      <button onClick={handleSearch}>Search</button>
      
      {/* Results */}
      {loading && <Loading />}
      {results.length > 0 && <OrdersTable orders={results} />}
    </div>
  );
}

// Search/ResultSearch.tsx
export function ResultSearch() {
  /**
   * Results Search Console
   * 
   * Features:
   * - Search by patient or exam type
   * - Advanced filters (date, abnormal flag, branch)
   * - Display results in table
   * - Link to original order
   * - Re-download PDF capability
   */
  // Similar implementation
}
```

---

## Google Cloud Platform Infrastructure/(OPTIONAL NOT IMPLEMENT YET)

### Cost-Efficient Architecture

```
┌─────────────────────────────────────────────────────────┐
│          Google Cloud Platform Setup                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Compute:                                               │
│  ├─ VM Instance (e2-micro): ~$8-12/month               │
│  │  └─ Ubuntu 22.04, 1 vCPU, 1GB RAM                   │
│  │  └─ Runs all Docker containers                      │
│  │                                                       │
│  Database:                                              │
│  ├─ Cloud SQL (PostgreSQL): ~$12-20/month              │
│  │  └─ db-f1-micro instance                            ��
│  │  └─ 10GB SSD storage                                │
│  │  └─ Automated backups                               │
│  │                                                       │
│  Cache/Sessions:                                        │
│  ├─ Memorystore Redis: ~$15-25/month                   │
│  │  └─ 1GB basic tier                                  │
│  │  └─ Persistent storage enabled                      │
│  │                                                       │
│  Storage:                                               │
│  ├─ Cloud Storage: ~$1-5/month                          │
│  │  └─ PDFs, invoices, documents                        │
│  │  └─ 10GB limit                                       │
│  │                                                       │
│  Networking:                                            │
│  ├─ Cloud Load Balancer: ~$15-20/month                 │
│  ├─ Cloud Armor: Free tier                             │
│  ├─ Cloud DNS: ~$0.40/month                            │
│  │                                                       │
│  Monitoring:                                            │
│  ├─ Cloud Monitoring: ~$5-10/month                      │
│  ├─ Cloud Logging: ~$0.50-5/month                       │
│  └─ Error Reporting: Free                              │
│                                                          │
│  TOTAL MONTHLY: ~$70-100/month (~$840-1200/year)        │
│                                                          │
│  Scaling Options:                                       │
│  - Start: e2-micro VM                                   │
│  - Growth: e2-small or e2-medium                        │
│  - High scale: Cloud Run + Cloud Firestore              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Deployment Steps

```bash
# 1. Create GCP project
gcloud projects create clinical-lab-mgmt

# 2. Create Compute Engine VM
gcloud compute instances create clinical-lab-vm \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-micro \
  --zone=us-central1-a \
  --scopes=cloud-platform

# 3. Create Cloud SQL PostgreSQL
gcloud sql instances create clinical-lab-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --backup-start-time=03:00 \
  --enable-bin-log

# 4. Create Cloud Storage bucket
gsutil mb -l us-central1 gs://clinical-lab-storage/

# 5. Create Redis instance
gcloud redis instances create clinical-lab-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=7.0 \
  --enable-auth

# 6. Set up firewall rules
gcloud compute firewall-rules create allow-http-https \
  --allow=tcp:80,tcp:443 \
  --source-ranges=0.0.0.0/0

gcloud compute firewall-rules create allow-internal \
  --allow=tcp:3000,tcp:8000,tcp:5432,tcp:6379 \
  --source-ranges=10.0.0.0/8

# 7. Reserve static IP
gcloud compute addresses create clinical-lab-ip \
  --region=us-central1

# 8. Deploy application (pull Docker images, run containers)
# SSH into VM and run: docker-compose -f docker-compose.prod.yml up -d
```

---

## Software Development Best Practices

- **Version Control:** Git with feature branching, code reviews, small atomic commits
- **Documentation:** Specs, API docs, inline comments, developer guides
- **Testing:** Unit, integration, and E2E tests with >80% coverage
- **CI/CD:** GitHub Actions with linting, formatting, type checks, tests
- **Code Style:** Black/isort (Python), ESLint/Prettier (JavaScript)
- **Modularity:** Logical modules/components with minimal duplication
- **Environment Parity:** Docker for consistent dev/prod
- **Error Monitoring:** Sentry for production errors
- **Code Comments:** REQUIRED for teams new to tech stack

---

## Security Best Practices

- **Session Security:** Secure HTTP-only cookies with CSRF protection
- **Isolation:** Only expose Nginx, internal Docker network for other services
- **Database:** Strong passwords via env vars, no external exposure
- **HTTPS:** TLS 1.3 everywhere
- **Input Validation:** Server-side and client-side validation
- **Dependencies:** Regular audits via pip-audit, npm audit, Dependabot
- **Least Privilege:** RBAC for users and containers, non-root users
- **Secrets:** Never store in code, use env vars or GCP Secret Manager
- **Regular Updates:** Patch frameworks, libraries, base images monthly
- **Audit Logging:** All sensitive actions logged with user/timestamp
- **Backups:** Automated PostgreSQL snapshots with restore tests

---

## Future Enhancements

- Email/WhatsApp integration for invoices and results
- Advanced analytics and reporting
- Machine learning for anomaly detection
- Mobile app
- API for third-party integrations
- Advanced patient clinical records
- Telemedicine features
- Integration with hospital management systems

---

## Deployment & Operations

### Deployment Checklist

- [ ] GCP infrastructure created
- [ ] SSL certificates configured
- [ ] Database backups automated
- [ ] Monitoring/alerting set up
- [ ] Log aggregation configured
- [ ] Team access provisioned
- [ ] Documentation complete
- [ ] Incident response plan documented

### Monitoring

- Application health checks
- Database performance
- API response times
- Error rates and types
- User activity metrics
- Infrastructure utilization

### Maintenance

- Weekly dependency updates
- Monthly security audits
- Quarterly penetration testing
- Regular backup verification
- Performance optimization reviews

---

**End of Project Plan**

> This comprehensive plan provides a production-quality foundation for a clinical lab management system. Follow the structure, practice good documentation, and implement security best practices at every step. The system is designed for scalability, maintainability, and excellent developer experience.
