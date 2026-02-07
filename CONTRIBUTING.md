# Contributing to Clinical Lab Management Application

Thank you for your interest in contributing to this project! This document provides guidelines for contributing.

## 🎯 Project Goals

This application is designed for small to medium clinical laboratories with:
- Clear, well-documented code for teams new to Django/Next.js
- Security-first approach with healthcare-grade standards
- Scalable architecture for growing organizations
- Comprehensive RBAC for multi-role access

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd LabAppV2
   ```

2. **Set Up Environment**
   ```bash
   ./start.sh
   # or
   make setup
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Standards

### Python/Django

- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for all functions/classes
- Add comments explaining business logic
- Run `make lint` and `make format` before committing

Example:
```python
def create_exam_order(patient_id: int, exam_types: list[int]) -> ExamOrder:
    """
    Creates a new exam order for a patient.
    
    Args:
        patient_id: ID of the patient
        exam_types: List of exam type IDs to include
        
    Returns:
        Created ExamOrder instance
        
    Raises:
        ValidationError: If patient doesn't exist or exam types invalid
    """
    # Implementation here
```

### TypeScript/React

- Use TypeScript for type safety
- Follow React hooks best practices
- Create reusable components
- Add JSDoc comments for complex logic
- Run `npm run lint` before committing

Example:
```typescript
/**
 * Custom hook for managing exam orders
 * 
 * @returns Object with orders data and CRUD functions
 */
export function useOrders() {
  // Implementation here
}
```

## 🧪 Testing

- Write tests for all new features
- Maintain >80% code coverage
- Test both happy paths and error cases

```bash
# Run tests
make test

# Run with coverage
make test-backend
```

## 📋 Commit Guidelines

Use conventional commit format:

```
type(scope): brief description

Longer description if needed

Fixes #123
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build/config changes

Example:
```
feat(auth): add password reset functionality

Implemented password reset via email with secure token
generation and expiration handling.

Fixes #45
```

## 🔄 Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add/update docstrings
   - Update API_DOCUMENTATION.md for API changes

2. **Run Tests**
   ```bash
   make test
   make lint
   ```

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe changes and rationale
   - Include screenshots for UI changes

4. **Code Review**
   - Address reviewer comments
   - Keep discussions focused and professional
   - Update PR based on feedback

## 🏗️ Architecture Guidelines

### Backend (Django)

- Keep business logic in `services.py`
- Use serializers for validation
- Implement permissions in `permissions.py`
- Follow the existing app structure

### Frontend (Next.js)

- Place API calls in `services/`
- Create reusable components in `components/`
- Use custom hooks for complex logic
- Define types in `types/`

## 🔒 Security

- Never commit secrets or credentials
- Validate all user input
- Use parameterized queries (ORM handles this)
- Follow OWASP security best practices
- Report security issues privately

## 📖 Documentation

When adding new features:

1. **Code Comments** - Explain WHY, not just WHAT
2. **README Updates** - Keep README current
3. **API Documentation** - Document new endpoints
4. **Type Definitions** - Add TypeScript types

## ❓ Questions?

- Check [plan.md](plan.md) for architecture details
- Review existing code for patterns
- Ask questions in pull request discussions
- Contact maintainers for guidance

## 📜 Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Help others learn and grow
- Celebrate successes

Thank you for contributing! 🎉
