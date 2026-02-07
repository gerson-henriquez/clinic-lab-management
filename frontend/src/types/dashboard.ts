/**
 * Dashboard Type Definitions
 * 
 * TypeScript types for dashboard components and data structures
 */

export interface StatCardData {
  id: string
  title: string
  value: string | number
  trend?: {
    value: number
    direction: 'up' | 'down'
    label: string
  }
  icon: React.ReactNode
  color: 'green' | 'blue' | 'purple' | 'orange'
  link?: string
}

export interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  description: string
  color: 'green' | 'blue' | 'purple' | 'orange'
  roles: string[]  // Which roles can see this action
}

export interface RecentActivity {
  id: string
  type: 'order' | 'result' | 'invoice' | 'patient'
  title: string
  description: string
  timestamp: string
  status: 'pending' | 'completed' | 'cancelled'
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'superadmin' | 'doctor' | 'lab_technician' | 'finance_user' | 'manager'
  branch?: string
  avatar?: string
}
