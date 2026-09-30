export default function About() {
  return (
    <div className="py-10 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-primary mb-8">À propos de Maison Élégance</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-4">Notre histoire</h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            Fondée en 2018, Maison Élégance est née d'une passion pour le design scandinave
            et le mobilier de qualité. Nous sélectionnons avec soin des pièces intemporelles
            qui allient esthétique, confort et durabilité.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Chaque meuble de notre catalogue est choisi pour sa qualité de fabrication,
            ses matériaux nobles et son design soigné. Nous croyons qu'un intérieur bien pensé
            améliore le quotidien.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-5">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🌿', title: 'Durabilité', desc: 'Matériaux responsables et fabrication éthique.' },
              { icon: '✨', title: 'Qualité', desc: 'Des meubles conçus pour durer dans le temps.' },
              { icon: '🎨', title: 'Design', desc: 'Esthétique scandinave et contemporaine.' },
              { icon: '💛', title: 'Service', desc: 'Accompagnement personnalisé et satisfaction client.' },
            ].map((v) => (
              <div key={v.title} className="bg-white p-5 rounded-lg shadow-sm text-center">
                <span className="text-3xl block mb-3">{v.icon}</span>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-4">Livraison & Retours</h2>
          <ul className="list-disc pl-5 text-gray-500 space-y-2">
            <li>Livraison gratuite en France métropolitaine dès 150 €</li>
            <li>Délai de livraison : 5 à 12 jours ouvrés selon le produit</li>
            <li>Retours gratuits sous 30 jours</li>
            <li>Service client disponible du lundi au vendredi</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
