import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../api/client'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getProducts({ limit: 100 })
      .then((data) => setProducts(data.products || data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer « ${name} » ?`)) return
    try {
      await deleteProduct(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary">Admin – Produits</h1>
        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition"
        >
          + Ajouter un produit
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Nom</th>
                <th className="text-left p-3">Catégorie</th>
                <th className="text-left p-3">Prix</th>
                <th className="text-left p-3">Stock</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={p.images?.[0]}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className="p-3">{p.price?.toFixed(2)} €</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}