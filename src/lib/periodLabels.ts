import type { Period } from '../types'

export const PERIOD_LABEL_SINGULAR: Record<Period, string> = { week: 'Semana', month: 'Mês', year: 'Ano' }
export const PERIOD_LABEL_PLURAL: Record<Period, string> = { week: 'semanas', month: 'meses', year: 'anos' }
export const PERIOD_LABEL_QUANTIFIER: Record<Period, string> = { week: 'Quantas', month: 'Quantos', year: 'Quantos' }
