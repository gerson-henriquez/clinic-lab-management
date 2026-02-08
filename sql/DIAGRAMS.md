# Database Schema - Visual Diagrams

## Complete ERD (Mermaid Format)

```mermaid
erDiagram
    %% Authentication & Users
    users ||--|| user_profiles : has
    users ||--o{ audit_logs : generates
    user_profiles }o--|| branches : "assigned to"
    user_profiles }o--o{ permissions : "has through role_permissions"
    
    %% Branches
    branches ||--o{ patients : contains
    branches ||--o{ exam_orders : "root branch"
    branches ||--o{ exam_orders : "current branch"
    branches ||--o{ invoices : "belongs to"
    
    %% Patients
    patients ||--o{ patient_records : has
    patients ||--o{ exam_orders : "orders for"
    patients ||--o{ invoices : "billed to"
    users ||--o{ patients : creates
    
    %% Orders & Exams
    exam_orders ||--o{ order_items : contains
    exam_orders ||--o{ order_transfers : "transferred via"
    exam_orders ||--|| invoices : "billed as"
    exam_orders ||--|| reports : "generates"
    
    order_items }o--|| exam_types : "type of"
    order_items ||--|| exam_results : "results in"
    
    %% Billing
    invoices ||--o{ payments : "paid via"
    
    %% System
    users ||--o{ notifications : receives

    %% Table Definitions
    users {
        bigint id PK
        varchar email UK "Primary login"
        varchar username UK
        varchar password "Argon2 hashed"
        boolean is_active
        int failed_login_attempts
        timestamp locked_until
        inet last_login_ip
        timestamp created_at
    }
    
    user_profiles {
        bigint id PK
        bigint user_id FK,UK
        varchar role "5 roles"
        bigint branch_id FK,NULL
        varchar phone
        varchar avatar
    }
    
    permissions {
        bigint id PK
        varchar code UK "module.action"
        varchar name
        varchar module
    }
    
    role_permissions {
        bigint id PK
        varchar role
        bigint permission_id FK
    }
    
    audit_logs {
        bigint id PK
        bigint user_id FK,NULL
        varchar action
        inet ip_address
        text user_agent
        jsonb details
        timestamp created_at
    }
    
    branches {
        bigint id PK
        varchar name
        varchar code UK
        text address
        varchar phone
        varchar email
        boolean is_active
    }
    
    patients {
        bigint id PK
        varchar first_name
        varchar last_name
        date date_of_birth
        varchar gender
        varchar identification_number UK
        varchar phone
        bigint branch_id FK
        bigint created_by_id FK
    }
    
    patient_records {
        bigint id PK
        bigint patient_id FK
        date record_date
        text chief_complaint
        text diagnosis
        bigint created_by_id FK
    }
    
    exam_types {
        bigint id PK
        varchar code UK
        varchar name
        varchar category
        decimal price
        varchar sample_type
        boolean is_active
    }
    
    exam_orders {
        bigint id PK
        varchar order_number UK
        bigint patient_id FK
        bigint root_branch_id FK "Immutable"
        bigint current_branch_id FK "Mutable"
        varchar status
        decimal total_price
        bigint created_by_id FK
        timestamp order_date
    }
    
    order_items {
        bigint id PK
        bigint order_id FK
        bigint exam_type_id FK
        decimal price
        varchar status
    }
    
    order_transfers {
        bigint id PK
        bigint order_id FK
        bigint from_branch_id FK
        bigint to_branch_id FK
        bigint transferred_by_id FK
        timestamp transferred_at
    }
    
    exam_results {
        bigint id PK
        bigint order_item_id FK,UK
        varchar result_value
        boolean is_abnormal
        jsonb detailed_results
        bigint performed_by_id FK
        timestamp performed_at
    }
    
    reports {
        bigint id PK
        bigint order_id FK,UK
        varchar report_number UK
        varchar pdf_file_path
        boolean is_finalized
        bigint generated_by_id FK
    }
    
    invoices {
        bigint id PK
        varchar invoice_number UK
        bigint order_id FK,UK
        bigint patient_id FK
        bigint branch_id FK
        decimal total_amount
        decimal amount_paid
        decimal amount_due "Auto-calculated"
        varchar payment_status
        date invoice_date
    }
    
    payments {
        bigint id PK
        bigint invoice_id FK
        varchar payment_number UK
        decimal amount
        varchar payment_method
        date payment_date
        bigint recorded_by_id FK
    }
    
    notifications {
        bigint id PK
        bigint user_id FK
        varchar title
        text message
        varchar notification_type
        boolean is_read
        timestamp created_at
    }
```

## Simplified Core Flow Diagram

```mermaid
flowchart TD
    U[User] -->|creates| P[Patient]
    U -->|creates| O[Exam Order]
    P -->|has| O
    O -->|contains| OI[Order Items]
    OI -->|type| ET[Exam Type]
    
    O -->|transferred via| OT[Order Transfer]
    OT -->|from/to| B[Branches]
    
    OI -->|results in| ER[Exam Results]
    O -->|generates| R[Report PDF]
    O -->|billed as| I[Invoice]
    I -->|paid via| PM[Payments]
    
    style O fill:#00C853
    style I fill:#0891B2
    style R fill:#6366F1
```

## Multi-Branch Order Flow

```mermaid
sequenceDiagram
    participant Doctor
    participant BranchA as Branch A
    participant BranchB as Branch B
    participant Technician
    participant Invoice
    
    Doctor->>BranchA: Create Order
    Note over BranchA: root_branch = A<br/>current_branch = A
    
    BranchA->>BranchB: Transfer Order
    Note over BranchB: root_branch = A<br/>current_branch = B
    
    Technician->>BranchB: Submit Results
    Note over BranchB: Results stored<br/>Order completed
    
    BranchB->>Invoice: Generate Invoice
    Note over Invoice: Visible to both<br/>Branch A & B users
```

## RBAC Permission Flow

```mermaid
flowchart LR
    U[User] -->|has one| UP[UserProfile]
    UP -->|has role| R{Role}
    
    R -->|superadmin| P1[All Permissions]
    R -->|doctor| P2[Patient & Order<br/>Creation]
    R -->|lab_technician| P3[Result Submission<br/>& Processing]
    R -->|finance_user| P4[Financial<br/>Reporting]
    R -->|manager| P5[Branch & User<br/>Management]
    
    P1 & P2 & P3 & P4 & P5 -->|granted via| RP[RolePermission]
    RP -->|maps to| PERM[Permission Codes]
    
    style R fill:#00C853
    style PERM fill:#0891B2
```

## Table Size Estimates

```mermaid
pie title Estimated Record Distribution (First Year)
    "Patients" : 5000
    "Exam Orders" : 50000
    "Order Items" : 150000
    "Exam Results" : 150000
    "Invoices" : 50000
    "Payments" : 75000
    "Audit Logs" : 500000
```

## Data Access Patterns

```mermaid
graph TD
    subgraph Read Heavy
        A[Dashboard Stats]
        B[Search Orders]
        C[View Reports]
        D[Financial Reports]
    end
    
    subgraph Write Heavy
        E[Create Orders]
        F[Submit Results]
        G[Record Payments]
        H[Audit Logs]
    end
    
    subgraph Critical Paths
        I[Login/Auth]
        J[Order Creation]
        K[Result Entry]
        L[Invoice Generation]
    end
    
    style A fill:#E8F5E9
    style E fill:#FFF3E0
    style I fill:#FFEBEE
```

## Key Indexes Strategy

```mermaid
mindmap
  root((Indexes))
    Foreign Keys
      All FK columns
      Cascade performance
    Date Fields
      created_at DESC
      order_date DESC
      Recent data queries
    Status Fields
      Order status
      Payment status
      Quick filtering
    Search Fields
      Patient names GIN
      Exam types GIN
      Full-text search
    Composite
      user + date
      branch + status
      Multi-column queries
```

## Security Layers

```mermaid
flowchart TB
    subgraph Application Layer
        A1[Django RBAC]
        A2[Permission Checks]
        A3[JWT Tokens]
    end
    
    subgraph Database Layer
        D1[Row-Level Security]
        D2[Foreign Key Constraints]
        D3[Audit Triggers]
    end
    
    subgraph Network Layer
        N1[Nginx Proxy]
        N2[TLS 1.3]
        N3[Rate Limiting]
    end
    
    A1 & A2 & A3 --> D1 & D2 & D3
    D1 & D2 & D3 --> N1 & N2 & N3
    
    style A1 fill:#00C853
    style D1 fill:#0891B2
    style N1 fill:#6366F1
```

---

## How to View These Diagrams

### In VS Code
1. Install "Markdown Preview Mermaid Support" extension
2. Open this file
3. Click "Preview" button

### In GitHub
- Mermaid diagrams render automatically in GitHub Markdown

### Online
- Copy diagram code to: https://mermaid.live

---

## Schema Statistics

| Metric | Count |
|--------|-------|
| Total Tables | 23 |
| Total Indexes | 60+ |
| Foreign Keys | 35+ |
| Triggers | 11 |
| Views | 2 |
| Functions | 2 |

---

## Critical Relationships

### 🔴 Critical (Cannot Delete)
- User → UserProfile (one-to-one)
- Order → OrderItems (one-to-many)
- Order → Invoice (one-to-one)

### 🟡 Important (Soft Delete Recommended)
- Patient → Orders
- Branch → Users
- ExamType → OrderItems

### 🟢 Safe to Delete
- Notifications
- Audit Logs (after retention period)
- Order Transfers (historical data)
