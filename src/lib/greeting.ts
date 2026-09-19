import type { User } from '@supabase/supabase-js'

export function getFirstName(user: User | null): string {
  if (!user) return ''
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? (user.user_metadata?.name as string | undefined)
  if (fullName) return fullName.trim().split(' ')[0]
  const local = user.email?.split('@')[0] ?? ''
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}
