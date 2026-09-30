import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getFeaturedProducts } from '../api/client'
import ProductCard from '../components/product/ProductCard'
// garde ton import heroImage si tu l’as

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCategories(), getFeaturedProducts()])
      .then(([cats, prods]) => {
        setCategories(cats)
        setFeatured(prods)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Hero – garde ton code existant avec l’image de fond */}
      {/* ... */}

      {/* Categories */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-primary mb-6">Nos catégories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogue/${cat.id}`}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition flex flex-col items-center gap-3"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-medium text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-primary">Sélection du moment</h2>
            <Link to="/catalogue" className="text-accent font-medium hover:text-primary transition">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA – garde ton code existant */}
    </div>
  )
}