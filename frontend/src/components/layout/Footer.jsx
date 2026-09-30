import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white text-xl font-semibold mb-3">IMMO | DECO</h3>
          <p className="text-sm leading-relaxed opacity-85">
            Mobilier de qualité pour un intérieur élégant et chaleureux. Design scandinave et contemporain.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Navigation</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Accueil</Link>
            <Link to="/catalogue" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Catalogue</Link>
            <Link to="/a-propos" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">À propos</Link>
            <Link to="/contact" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Catégories</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/catalogue/chaises" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Chaises</Link>
            <Link to="/catalogue/tables" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Tables</Link>
            <Link to="/catalogue/lits" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Lits</Link>
            <Link to="/catalogue/canapes" className="opacity-80 hover:opacity-100 hover:text-accent-light transition">Canapés</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
          <div className="text-sm space-y-1.5 opacity-85">
            <p>📍</p>
            <p>📞 034 77 917 58</p>
            <p>✉️ rthheritina@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm opacity-70">
        <p>© {new Date().getFullYear()} IMMO | DECO. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
