import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-semibold mb-3">Votre panier est vide</h1>
          <p className="text-gray-500 mb-6">Découvrez notre catalogue et trouvez le mobilier parfait.</p>
          <Link
            to="/catalogue"
            className="inline-flex px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition"
          >
            Voir le catalogue
          </Link>
        </div>
      </div>
    )
  }

  const shipping = totalPrice >= 150 ? 0 : 9.9
  const total = totalPrice + shipping

  return (
    <div className="py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-primary mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor}`}
                className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto_auto_auto] gap-4 items-center bg-white p-4 rounded-lg shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-[100px] sm:h-[100px] object-cover rounded-md"
                />
                <div>
                  <Link to={`/produit/${item.id}`} className="font-medium hover:text-accent transition block mb-0.5">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mb-0.5">Couleur : {item.selectedColor}</p>
                  <p className="text-sm text-gray-500">{item.price.toFixed(2)} €</p>
                </div>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                    className="w-8 h-8 hover:bg-bg transition"
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                    className="w-8 h-8 hover:bg-bg transition"
                  >
                    +
                  </button>
                </div>
                <div className="font-semibold text-right min-w-[70px]">
                  {(item.price * item.quantity).toFixed(2)} €
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.selectedColor)}
                  className="w-8 h-8 rounded-full text-gray-400 hover:bg-pink-50 hover:text-danger transition"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="self-start mt-2 px-4 py-2 border border-primary text-primary text-sm rounded-lg hover:bg-primary hover:text-white transition"
            >
              Vider le panier
            </button>
          </div>

          <aside className="bg-white rounded-lg p-6 shadow-sm h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold mb-5">Récapitulatif</h2>
            <div className="flex justify-between text-sm mb-3">
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span>Livraison</span>
              <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-accent mb-3">
                Plus que {(150 - totalPrice).toFixed(2)} € pour la livraison gratuite
              </p>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-border pt-4 mt-2 mb-6">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition mb-4"
            >
              Passer commande
            </Link>
            <Link to="/catalogue" className="block text-center text-sm text-gray-500 hover:text-accent transition">
              ← Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
