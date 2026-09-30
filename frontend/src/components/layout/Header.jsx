import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Header() {
  const { totalItems } = useCart()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors relative py-1 ${
      isActive
        ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded'
        : 'text-gray-500 hover:text-primary'
    }`

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[70px] gap-8">
        <Link to="/" className="flex items-center gap-2 text-primary text-xl">
          <span className="text-2xl">🏠</span>
          <span>
            IMMO | <strong className="font-bold">DECO</strong>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={linkClass}>
            Accueil
          </NavLink>
          <NavLink to="/catalogue" className={linkClass}>
            Catalogue
          </NavLink>
          <NavLink to="/a-propos" className={linkClass}>
            À propos
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        <Link
          to="/panier"
          className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-bg transition"
        >
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 bg-accent text-white text-[11px] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        <NavLink to="/admin/products" className={linkClass}>
  Admin
</NavLink>
      </div>
    </header>
  )
}
