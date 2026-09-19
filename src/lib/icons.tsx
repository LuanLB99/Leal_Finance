import {
  Utensils, Car, Home, HeartPulse, GraduationCap, PartyPopper, ShoppingBag,
  Receipt, ShoppingCart, Wallet, TrendingUp, Gift, CircleEllipsis, Plane,
  Dumbbell, Dog, Baby, Fuel, Wifi, Phone, Shirt, Coffee, Film, Music,
  Briefcase, PiggyBank, CreditCard, Landmark, Circle, type LucideIcon,
} from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  home: Home,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'party-popper': PartyPopper,
  'shopping-bag': ShoppingBag,
  receipt: Receipt,
  'shopping-cart': ShoppingCart,
  wallet: Wallet,
  'trending-up': TrendingUp,
  gift: Gift,
  'circle-ellipsis': CircleEllipsis,
  plane: Plane,
  dumbbell: Dumbbell,
  dog: Dog,
  baby: Baby,
  fuel: Fuel,
  wifi: Wifi,
  phone: Phone,
  shirt: Shirt,
  coffee: Coffee,
  film: Film,
  music: Music,
  briefcase: Briefcase,
  'piggy-bank': PiggyBank,
  'credit-card': CreditCard,
  landmark: Landmark,
  circle: Circle,
}

export const ICON_NAMES = Object.keys(ICONS)

export function CategoryIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Circle
  return <Icon size={size} />
}
