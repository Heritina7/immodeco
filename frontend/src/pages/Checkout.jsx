import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/client'  // si tu as déjà branché l'API, sinon commente cette ligne

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'France',
  })

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Votre panier est vide</h2>
        <Link
          to="/catalogue"
          className="inline-flex px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition"
        >
          Voir le catalogue
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-md">
          <span className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-700 text-2xl rounded-full mb-5">
            ✓
          </span>
          <h1 className="text-2xl font-semibold mb-3">Commande confirmée !</h1>
          <p className="text-gray-500 mb-2">
            Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
          </p>
          <p className="text-sm text-gray-400 mb-7">
            (Ceci est une démo – aucun paiement réel n'a été effectué)
          </p>
          <Link
            to="/"
            className="inline-flex px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const shipping = totalPrice >= 150 ? 0 : 9.9
  const total = totalPrice + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Si l'API n'est pas encore prête, commente le bloc createOrder
      // et garde seulement clearCart() + setSubmitted(true)
      await createOrder({
        ...form,
        items: items.map((item) => ({
          productId: item.id,
          selectedColor: item.selectedColor,
          quantity: item.quantity,
        })),
      })
      clearCart()
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent transition'

  return (
    <div className="py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-primary mb-8">Finaliser la commande</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-5">Coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Prénom *</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Nom *</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Téléphone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-5 mt-2">Adresse de livraison</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1.5">Adresse *</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Ville *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1.5">Code postal *</label>
                <input type="text" name="zip" value={form.zip} onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-500 mb-1.5">Pays</label>
              <select name="country" value={form.country} onChange={handleChange} className={inputClass}>
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Luxembourg</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : `Confirmer la commande — ${total.toFixed(2)} €`}
            </button>
          </form>

          <aside className="bg-white p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold mb-5">Votre commande</h2>
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor}`}
                className="grid grid-cols-[55px_1fr_auto] gap-3 items-center mb-4 pb-4 border-b border-border"
              >
                <img src={item.image} alt="" className="w-[55px] h-[55px] object-cover rounded" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.selectedColor} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm">{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-3 mt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}