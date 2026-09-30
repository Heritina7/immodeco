import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent transition'

  return (
    <div className="py-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-primary mb-8">Contactez-nous</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
          <div>
            <h2 className="text-lg font-semibold mb-6">Nos coordonnées</h2>
            {[
              { icon: '📍', title: 'Adresse', text: '12 rue du Design\n75011 Paris, France' },
              { icon: '📞', title: 'Téléphone', text: '01 23 45 67 89' },
              { icon: '✉️', title: 'Email', text: 'contact@maison-elegance.fr' },
              { icon: '🕐', title: 'Horaires', text: 'Lun – Ven : 9h – 18h\nSam : 10h – 17h' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 mb-6">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <strong className="block mb-0.5">{item.title}</strong>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-success text-xl rounded-full mb-4">
                  ✓
                </span>
                <p className="text-gray-500">Message envoyé ! Nous vous répondrons sous 24h.</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1.5">Nom complet *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1.5">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-500 mb-1.5">Sujet *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-gray-500 mb-1.5">Message *</label>
                  <textarea name="message" rows="5" value={form.message} onChange={handleChange} required className={`${inputClass} resize-y`} />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#1e2b1f] transition"
                >
                  Envoyer le message
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
