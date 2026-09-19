import { useAuth } from '../../contexts/AuthContext'
import { getFirstName, getTimeGreeting } from '../../lib/greeting'
import UserMenu from '../UserMenu'

export default function GreetingHeader() {
  const { user } = useAuth()

  return (
    <div className="greeting-row">
      <div>
        <p className="greeting-eyebrow">{getTimeGreeting()},</p>
        <p className="greeting-name">{getFirstName(user)} 👋</p>
      </div>
      <UserMenu />
    </div>
  )
}
