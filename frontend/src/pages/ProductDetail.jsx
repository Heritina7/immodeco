import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError('')
    setProduct(null)

    const url = `${API_URL}/products/${id}`
    console.log('[ProductDetail] GET', url)

    fetch(url)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        console.log('[ProductDetail] status', res.status, data)
        if (!res.ok) {
          throw new Error(data.error || `Erreur HTTP ${res.status}`)
        }
        return data
      })
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        setSelectedColor(p.colors?.[0] || '')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[ProductDetail]', err)
        setError(err.message || 'Erreur inconnue')
        setProduct(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Chargement du produit...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Produit introuvable</h2>
        <p className="text-red-600 text-sm mb-2">{error || 'Aucune donnée reçue'}</p>
        <p className="text-gray-400 text-xs mb-1">ID URL : {id}</p>
        <p className="text-gray-400 text-xs mb-4">API : {API_URL}/products/{id}</p>
        <Link
          to="/catalogue"
          className="inline-flex px-5 py-2.5 bg-primary text-white rounded-lg font-medium"
        >
          Retour au catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/catalogue" className="hover:text-accent">Catalogue</Link>
        <span> / </span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Pas d’image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-3">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-4">
            {Number(product.price).toFixed(2)} €
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.colors?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Couleur : <strong>{selectedColor}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 border rounded text-sm ${
                      selectedColor === c
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 border rounded"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 border rounded"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              addToCart(product, selectedColor || product.colors?.[0] || '', quantity)
              setAdded(true)
              setTimeout(() => setAdded(false), 2000)
            }}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium"
          >
            {added ? '✓ Ajouté au panier' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </div>
  )
}