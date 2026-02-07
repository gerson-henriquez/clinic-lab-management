import { useState } from 'react'
import { useRouter } from 'next/router'
import Input from '../Common/Input'
import Button from '../Common/Button'

/**
 * LoginForm Component
 * 
 * Handles user authentication with email/username and password
 * 
 * Features:
 * - Form validation
 * - Loading states
 * - Error handling
 * - Remember me checkbox
 * - Forgot password link
 * 
 * Note: UI text in Spanish, code/comments in English
 * For Phase 2: Will integrate with backend authentication API
 */

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<{username?: string; password?: string}>({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const validateForm = () => {
    const newErrors: {username?: string; password?: string} = {}
    
    if (!formData.username) {
      newErrors.username = 'El usuario o correo es requerido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    // TODO Phase 2: Replace with actual API call
    // Simulating API call
    setTimeout(() => {
      // For now, just redirect to dashboard
      router.push('/dashboard')
    }, 1500)
    
    // Example of what Phase 2 will look like:
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   })
    //   if (response.ok) {
    //     router.push('/dashboard')
    //   } else {
    //     setLoginError('Credenciales inválidas')
    //   }
    // } catch (error) {
    //   setLoginError('Error de red. Por favor intente nuevamente.')
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Input
          label="Usuario o Correo"
          type="text"
          placeholder="Ingrese su usuario o correo"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          error={errors.username}
          required
          autoComplete="username"
        />
      </div>

      <div>
        <Input
          label="Contraseña"
          type="password"
          placeholder="Ingrese su contraseña"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700">Recordarme</span>
        </label>

        <a
          href="#"
          className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          onClick={(e) => {
            e.preventDefault()
            // TODO Phase 2: Implement forgot password flow
            alert('Funcionalidad de recuperación de contraseña disponible en Fase 2')
          }}
        >
          ¿Olvidó su contraseña?
        </a>
      </div>

      {loginError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{loginError}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Primera vez aquí? Contacte a su administrador para configurar su cuenta.
      </p>
    </form>
  )
}
