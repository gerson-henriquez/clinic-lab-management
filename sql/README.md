# Clinical Laboratory Management System - Database Schema Documentation

## Overview
Complete PostgreSQL database schema for the DiagnosticLab Clinical Laboratory Management System.

**Database:** PostgreSQL 15+  
**Total Tables:** 23  
**Views:** 2  
**Functions:** 2  

---

## Table Categories

### 1. Authentication & Users (5 tables)
- `users` - Core user authentication
- `user_profiles` - Extended user info with roles
- `permissions` - Granular permission codes
- `role_permissions` - Role-to-permission mapping
- `audit_logs` - Security audit trail

### 2. Branches & Locations (1 table)
- `branches` - Laboratory branches/locations

### 3. Patients & Clinical Records (2 tables)
- `patients` - Patient demographics
- `patient_records` - Clinical history and records

### 4. Exams & Test Types (1 table)
- `exam_types` - Available laboratory tests

### 5. Orders & Results (6 tables)
- `exam_orders` - Lab exam orders
- `order_items` - Individual exams in order
- `order_transfers` - Transfer history between branches
- `exam_results` - Test results
- `reports` - Generated PDF reports

### 6. Billing & Invoicing (2 tables)
- `invoices` - Financial invoices
- `payments` - Payment records

### 7. Financial & Analytics (1 table)
- `daily_financial_summary` - Daily aggregated metrics

### 8. System & Notifications (2 tables)
- `notifications` - User notifications
- `system_settings` - App configuration

---

## Entity Relationship Diagram (Text)

```
users (1) ──── (1) user_profiles
                       │
                       │ (N)
                       ▼
                   branches (1) ──── (N) patients
                       │                    │
                       │                    │ (1)
                       │                    ▼
                       │              patient_records
                       │
                       │ (N)
                       ▼
                  exam_orders (1) ──── (N) order_items ──── (1) exam_types
                       │                    │
                       │ (1)                │ (1)
                       ▼                    ▼
                 order_transfers      exam_results
                       
exam_orders (1) ──── (1) invoices (1) ──── (N) payments
     │                    
     │ (1)                 
     ▼                     
  reports                  
```

---

## Key Relationships

### Users & Authentication
- **User** has one **UserProfile** (one-to-one)
- **UserProfile** belongs to one **Branch** (many-to-one, nullable)
- **Role** has many **Permissions** through **RolePermission** (many-to-many)

### Patients & Orders
- **Patient** is created by one **User** (many-to-one)
- **Patient** belongs to one **Branch** (many-to-one)
- **Patient** has many **PatientRecords** (one-to-many)
- **Patient** has many **ExamOrders** (one-to-many)

### Orders & Exams
- **ExamOrder** has many **OrderItems** (one-to-many)
- **ExamOrder** has one **root_branch** and one **current_branch** (many-to-one)
- **ExamOrder** can have many **OrderTransfers** (one-to-many)
- **OrderItem** belongs to one **ExamType** (many-to-one)
- **OrderItem** has one **ExamResult** (one-to-one)

### Billing & Payments
- **ExamOrder** has one **Invoice** (one-to-one)
- **Invoice** has many **Payments** (one-to-many)

---

## Important Fields by Table

### users
- `email` - Primary login (unique)
- `failed_login_attempts` - Security tracking
- `locked_until` - Account lockout
- `last_login_ip` - IP tracking

### user_profiles
- `role` - ENUM: superadmin, doctor, lab_technician, finance_user, manager
- `branch_id` - Nullable (superadmin has no branch)

### exam_orders
- `order_number` - Unique identifier
- `root_branch_id` - **Immutable** - where order originated
- `current_branch_id` - **Mutable** - where order is being processed
- `status` - ENUM: pending, in_progress, completed, cancelled

### invoices
- `payment_status` - ENUM: pending, partial, paid, cancelled
- `amount_due` - Auto-calculated: total_amount - amount_paid

---

## Indexes

### Performance Indexes
- All foreign keys have indexes
- Date fields (created_at, order_date) indexed DESC for recent data queries
- Composite indexes for common queries (e.g., user + date)

### Full-Text Search Indexes
- `patients.name` - GIN index for name search
- `exam_types.name` - GIN index for test search

---

## Security Features

### Audit Logging
- All authentication events logged in `audit_logs`
- IP address and user agent tracked
- 365-day retention by default

### Account Security
- Failed login attempt tracking
- Automatic lockout after 5 attempts
- 30-minute lockout duration

### Data Protection
- Foreign key constraints prevent orphaned data
- ON DELETE RESTRICT for critical relationships
- ON DELETE CASCADE for dependent data

---

## Automatic Behaviors

### Triggers
1. **update_updated_at_column** - Auto-updates `updated_at` timestamp
2. **calculate_invoice_amounts** - Auto-calculates `amount_due` and `payment_status`

### Constraints
- Email validation regex
- ENUM checks for status fields
- Unique constraints on identification numbers
- Check constraints for valid data ranges

---

## Views

### v_active_orders_by_branch
Returns daily order counts by branch and status.

### v_pending_invoices_by_branch
Returns pending invoice summary by branch.

---

## Multi-Branch Architecture

### Branch Isolation
- Users assigned to specific branch (except superadmin)
- Orders track both origin and current location
- Transfer history preserved

### Order Flow
```
1. Order created in Branch A (root_branch = A, current_branch = A)
2. Order transferred to Branch B (root_branch = A, current_branch = B)
3. Results submitted in Branch B
4. Financial records show for both Branch A and B
```

---

## Migration Notes

### Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Execution Order
1. Create all tables
2. Add foreign keys
3. Create indexes
4. Create views
5. Create functions and triggers
6. Insert seed data

---

## File Location
**Schema File:** `/sql/schema.sql`

This file contains:
- ✅ All table definitions
- ✅ All indexes and constraints
- ✅ All foreign keys
- ✅ All views
- ✅ All functions and triggers
- ✅ Initial seed data
- ✅ Comprehensive comments

---

## Usage

### Apply Schema
```bash
psql -U postgres -d clinical_lab_db -f sql/schema.sql
```

### Verify Schema
```bash
psql -U postgres -d clinical_lab_db -c "\dt"  # List tables
psql -U postgres -d clinical_lab_db -c "\di"  # List indexes
psql -U postgres -d clinical_lab_db -c "\df"  # List functions
```

---

## Statistics

**Tables:** 23  
**Indexes:** 60+  
**Foreign Keys:** 35+  
**Triggers:** 11  
**Views:** 2  
**Functions:** 2  

**Estimated Size (empty):** ~5 MB  
**Estimated Size (100K records):** ~500 MB - 1 GB
