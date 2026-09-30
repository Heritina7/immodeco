import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getProducts, getCategories } from '../api/client'
import ProductCard from '../components/product/ProductCard'

export default function Catalog() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const promoOnly = searchParams.get('promo') === 'true'

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  // Budget client
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)

    getProducts({
      category: category || undefined,
      search: search.trim() || undefined,
      minPrice: minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
      promo: promoOnly || undefined,
      sort: sort !== 'default' ? sort : undefined,
      limit: 50,
    })
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, search, sort, minPrice, maxPrice, promoOnly])

  const currentCategory = categories.find((c) => c.id === category)

  const resetBudget = () => {
    setMinPrice('')
    setMaxPrice('')
  }

  // Raccourcis budget
  const applyBudget = (min, max) => {
    setMinPrice(min === null ? '' : String(min))
    setMaxPrice(max === null ? '' : String(max))
  }

  return (
    <div className="py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-baseline mb-8">
          <h1 className="text-2xl font-semibold text-primary">
            {currentCategory
              ? currentCategory.name
              : promoOnly
              ? 'Promotions'
              : 'Catalogue'}
          </h1>
          <p className="text-gray-500 text-sm">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ========== SIDEBAR FILTRES ========== */}
          <aside className="bg-white rounded-lg p-5 shadow-sm h-fit lg:sticky lg:top-24 space-y-6">
            {/* Recherche */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Recherche</h3>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
              />
            </div>

            {/* Catégories */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">Catégories</h3>
              <div className="flex flex-col gap-1">
                <Link
                  to="/catalogue"
                  className={`text-sm px-2 py-1.5 rounded ${
                    !category ? 'bg-bg text-primary' : 'text-gray-500 hover:bg-bg'
                  }`}
                >
                  Toutes
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalogue/${cat.id}`}
                    className={`text-sm px-2 py-1.5 rounded ${
                      category === cat.id
                        ? 'bg-bg text-primary'
                        : 'text-gray-500 hover:bg-bg'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ========== BUDGET / PRIX ========== */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">Budget</h3>

              {/* Raccourcis */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => applyBudget(0, 100)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-accent hover:text-accent transition"
                >
                  &lt; 100 €
                </button>
                <button
                  type="button"
                  onClick={() => applyBudget(100, 300)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-accent hover:text-accent transition"
                >
                  100 – 300 €
                </button>
                <button
                  type="button"
                  onClick={() => applyBudget(300, 800)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-accent hover:text-accent transition"
                >
                  300 – 800 €
                </button>
                <button
                  type="button"
                  onClick={() => applyBudget(800, null)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-accent hover:text-accent transition"
                >
                  &gt; 800 €
                </button>
              </div>

              {/* Min / Max */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {(minPrice !== '' || maxPrice !== '') && (
                <button
                  type="button"
                  onClick={resetBudget}
                  className="mt-2 text-xs text-accent hover:underline"
                >
                  Réinitialiser le budget
                </button>
              )}
            </div>
          </aside>

          {/* ========== LISTE PRODUITS ========== */}
          <div>
            <div className="flex justify-end mb-5">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border border-border rounded-md text-sm bg-white"
              >
                <option value="default">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
                <option value="new">Nouveautés</option>
              </select>
            </div>

            {loading ? (
              <p className="text-center py-16 text-gray-500">Chargement...</p>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p>Aucun produit dans ce budget.</p>
                <button
                  type="button"
                  onClick={resetBudget}
                  className="mt-3 text-accent hover:underline text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}