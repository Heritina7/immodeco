import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-250">
      <Link to={`/produit/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f0ece6]">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-400 hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-green-50 text-success text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                Nouveau
              </span>
            )}
            {product.isPromo && (
              <span className="bg-pink-50 text-danger text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="bg-orange-50 text-orange-700 text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                Stock limité
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pb-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-base font-medium leading-snug mb-2.5 text-gray-900">{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary">{product.price.toFixed(2)} €</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">{product.oldPrice.toFixed(2)} €</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
