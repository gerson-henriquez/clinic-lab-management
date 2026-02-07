# Clinical Laboratory Management Application

A comprehensive web application for managing clinical laboratory operations including exam ordering, patient records, multi-branch management, billing, and financial reporting.

## 🚀 Features

- **Role-Based Access Control (RBAC)** - Granular permissions for doctors, technicians, finance users, and managers
- **Exam Order Management** - Create, track, and process exam orders
- **Patient Clinical Records** - Comprehensive patient data management
- **Multi-Branch Support** - Manage multiple lab locations with flexible access control
- **Billing & Invoicing** - Generate invoices and track payments
- **Financial Reports** - Dashboard with revenue analytics and metrics
- **Search & History** - Full-text search for orders, results, and invoices
- **PDF Reports** - Automated generation of lab reports
- **Audit Logging** - Complete audit trail for compliance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Make** (optional, for convenience commands)
- **Git** (for version control)

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│    Nginx    │ (Reverse Proxy)
└──────┬──────┘
       │
   ┌───┴────┬────────┐
   │        │        │
   ▼        ▼        ▼
┌────┐  ┌────┐  ┌────┐
│Next│  │DRF │  │PG  │
│.js │  │API │  │SQL │
└────┘  └────┘  └────┘
          │
          ▼
       ┌────┐
       │Redis│
       └────┘
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LabAppV2
```

### 2. Set Up Environment Variables

```bash
# Copy example environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### 3. Start the Application

**Option A: Using Make (Recommended)**

```bash
# Install dependencies and set up database
make setup

# Start all services
make start
```

**Option B: Using Docker Compose Directly**

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### 4. Access the Application

**Production-like mode (recommended - Nginx only):**
- **Main Application:** http://localhost

**Development mode (all ports exposed for debugging):**
- **Main App (Nginx):** http://localhost
- **Frontend Direct:** http://localhost:3000
- **Backend API Direct:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin

To enable development mode with all ports exposed:
```bash
make dev-start  # Instead of make start
```

> **Security Note:** By default, only Nginx (port 80) is exposed to your host machine. Backend and frontend are only accessible through Nginx, which is the recommended production setup. Use `make dev-start` only when you need direct access for debugging.

## 📚 Documentation

- [Project Plan](plan.md) - Comprehensive project documentation
- [API Documentation](docs/API_DOCUMENTATION.md) - API endpoints and usage (coming soon)
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Development guidelines (coming soon)
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions (coming soon)

## 🛠️ Development

### Available Commands

```bash
# Show all available commands
make help

# Start services (production-like, Nginx only)
make start

# Start services with all ports exposed (for debugging)
make dev-start

# View logs
make logs
make logs-backend    # Backend only
make logs-frontend   # Frontend only

# Database operations
make migrate         # Run migrations
make makemigrations  # Create migrations
make superuser       # Create admin user

# Testing
make test            # Run all tests
make test-backend    # Backend tests only

# Code quality
make lint            # Run linters
make format          # Auto-format code

# Cleanup
make stop            # Stop services
make clean           # Remove containers and volumes
```

### Project Structure

```
LabAppV2/
├── backend/                 # Django backend
│   ├── apps/               # Application modules
│   │   ├── auth/          # Authentication & RBAC
│   │   ├── patients/      # Patient management
│   │   ├── exams/         # Exam orders
│   │   ├── reports/       # Lab reports
│   │   ├── billing/       # Invoicing
│   │   ├── finance/       # Financial reports
│   │   ├── branches/      # Branch management
│   │   ├── search/        # Search functionality
│   │   └── common/        # Shared utilities
│   ├── clinical_lab/      # Django project settings
│   └── requirements.txt   # Python dependencies
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── pages/         # Next.js pages
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   └── package.json       # Node dependencies
│
├── nginx/                  # Nginx configuration
│   ├── nginx.conf         # Reverse proxy config
│   └── ssl/               # SSL certificates
│
├── docker-compose.yml      # Development orchestration
├── docker-compose.prod.yml # Production overrides
├── Makefile               # Development commands
└── README.md              # This file
```

## 🔧 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | Modern React framework with SSR |
| Backend | Django 4.2, Django REST Framework | Python web framework & API |
| Database | PostgreSQL 15 | Relational database |
| Cache | Redis 7 | Session storage & caching |
| Proxy | Nginx | Reverse proxy & load balancer |
| Container | Docker & Docker Compose | Containerization & orchestration |

## 👥 User Roles

The application supports five distinct user roles:

1. **SUPERADMIN** - Full system access, manages all branches and users
2. **DOCTOR** - Creates orders, manages patients and clinical records
3. **LAB_TECHNICIAN** - Processes orders, submits results, generates reports
4. **FINANCE_USER** - Views financial data and reports
5. **MANAGER** - Manages staff, branches, and has all technician permissions

See [plan.md](plan.md) for detailed permission matrix.

## 🔒 Security

- **Network Isolation** - Only Nginx exposed to host, all other services on internal Docker network
- Session-based authentication with HTTP-only cookies
- CSRF protection on all state-changing requests
- Role-based access control (RBAC) at API level
- SQL injection protection via Django ORM
- XSS protection with Content Security Policy
- HTTPS in production (TLS 1.3)
- Isolated Docker network (only Nginx accessible from host)

## 🧪 Testing

```bash
# Run all tests
make test

# Run backend tests with coverage
make test-backend

# Run specific test file
docker-compose exec backend pytest apps/auth/tests.py -v
```

## 📦 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build production images:**
   ```bash
   make prod-build
   ```
3. **Start production services:**
   ```bash
   make prod-up
   ```
4. **Configure SSL certificates** in `nginx/ssl/`
5. **Run migrations:**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
6. **Collect static files:**
   ```bash
   make collectstatic
   ```

See [plan.md](plan.md) for Google Cloud Platform deployment guide.

## 🐛 Troubleshooting

### Docker Issues

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs -f [service-name]

# Restart a specific service
docker-compose restart [service-name]

# Rebuild containers
make build
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
make db-reset

# Access PostgreSQL shell
make shell-db

# Create backup
make backup-db
```

### Common Issues

**Port already in use:**
- Check if ports 80, 3000, 8000, 5432, 6379 are available
- Stop conflicting services or change ports in docker-compose.yml

**Permission denied:**
- Ensure Docker daemon is running
- Add your user to docker group: `sudo usermod -aG docker $USER`

**Database connection refused:**
- Wait for PostgreSQL to fully start (check with `docker-compose logs db`)
- Verify environment variables in backend/.env

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Development Workflow

This project follows a structured development workflow:

- **Phase 1:** Project Setup (Current) ✅
- **Phase 2:** Authentication & RBAC
- **Phase 3:** Branch Management
- **Phase 4:** Patient Management
- **Phase 5:** Exam Management
- **Phase 6:** Search & History
- **Phase 7:** Technician Reporting
- **Phase 8:** Billing
- **Phase 9:** Financial Dashboard
- **Phase 10:** Testing & QA
- **Phase 11:** Deployment

See [plan.md](plan.md) for detailed implementation plan.

## 📄 License

This project is proprietary software. All rights reserved.

## 👨‍💻 Development Team

For development teams new to Django and Next.js:
- All code includes comprehensive comments explaining the "why" not just the "what"
- Follow naming conventions for clarity
- Refer to inline documentation for business logic explanations
- Check [plan.md](plan.md) for architectural decisions and best practices

## 📞 Support

For issues, questions, or contributions, please contact the development team.

---

**Status:** Phase 1 Complete ✅  
**Version:** 1.0.0  
**Last Updated:** February 2026
