/**
 * Mock Data Constants
 * Centralized mock data for development/demo purposes.
 * TODO: Phase 2+ – Replace with real API calls.
 */
import { UserProfile } from '@/types/user'

// ── User ────────────────────────────────────────────────────

export const MOCK_USER: UserProfile = {
  name: 'Dra. Valencia',
  role: 'superadmin',
  email: 'admin@lab.com',
  branch: 'Sucursal Principal',
}

// ── Dashboard ───────────────────────────────────────────────

export interface SampleOrder {
  id: string
  patient: string
  exam: string
  progress: number
}

export interface SupplyItem {
  name: string
  stock: number
}

export const MOCK_ORDERS: SampleOrder[] = [
  { id: 'ORD-7721', patient: 'Ana María Prada', exam: 'Perfil Bioquímico', progress: 65 },
  { id: 'ORD-7722', patient: 'Carlos Mendoza', exam: 'Hemograma Completo', progress: 90 },
  { id: 'ORD-7723', patient: 'Laura Restrepo', exam: 'TSH + T4 Libre', progress: 30 },
  { id: 'ORD-7724', patient: 'Pedro Gómez', exam: 'Perfil Lipídico', progress: 100 },
]

export const MOCK_SUPPLIES: SupplyItem[] = [
  { name: 'Reactivos B-12', stock: 32 },
  { name: 'Placas PCR', stock: 85 },
  { name: 'Tubos EDTA', stock: 64 },
  { name: 'Agujas 21G', stock: 91 },
]

// ── Role Labels (shared between Header and other components) ─

export const ROLE_LABELS: Record<string, string> = {
  superadmin: 'ADMIN',
  doctor: 'DOCTOR',
  lab_technician: 'TÉC. LAB',
  finance_user: 'FINANZAS',
  manager: 'GERENTE',
}
