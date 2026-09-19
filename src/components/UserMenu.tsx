import { useEffect, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getFirstName } from '../lib/greeting'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initial = getFirstName(user).charAt(0).toUpperCase() || '?'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="user-menu" ref={ref}>
      <button className="avatar" onClick={() => setOpen((v) => !v)} type="button" title={user?.email}>
        {initial}
      </button>
      {open && (
        <div className="user-menu-dropdown">
          <span className="user-menu-email">{user?.email}</span>
          <button className="user-menu-item" onClick={signOut} type="button">
            <LogOut size={16} /> Sair
          </button>
        </div>
      )}
    </div>
  )
}
