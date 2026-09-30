import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { slug: 'chaises', name: 'Chaises', icon: '🪑' },
  { slug: 'tables', name: 'Tables', icon: '🪵' },
  { slug: 'lits', name: 'Lits', icon: '🛏️' },
  { slug: 'canapes', name: 'Canapés', icon: '🛋️' },
  { slug: 'armoires', name: 'Armoires', icon: '🚪' },
  { slug: 'decoration', name: 'Décoration', icon: '🪴' },
]

const products = [
  {
    name: 'Chaise Scandinave Oak',
    slug: 'chaise-scandinave-oak',
    categorySlug: 'chaises',
    price: 89.9,
    oldPrice: 119.9,
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop',
    ],
    colors: ['Chêne naturel', 'Noir', 'Blanc'],
    materials: ['Bois de chêne', 'Tissu'],
    description: 'Chaise élégante au design scandinave. Assise confortable et dossier légèrement inclinable. Parfaite pour la salle à manger ou le bureau.',
    features: ["Hauteur d'assise 45 cm", 'Poids max 120 kg', 'Montage simple'],
    stock: 15,
    isNew: true,
    isPromo: true,
  },
  {
    name: 'Chaise Velours Emerald',
    slug: 'chaise-velours-emerald',
    categorySlug: 'chaises',
    price: 129.0,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop'],
    colors: ['Vert émeraude', 'Gris anthracite', 'Bordeaux'],
    materials: ['Velours', 'Métal'],
    description: 'Chaise en velours doux avec pieds métalliques dorés. Un touché de luxe pour votre intérieur.',
    features: ['Assise large', 'Pieds anti-rayures', 'Disponible en 3 coloris'],
    stock: 8,
    isNew: false,
    isPromo: false,
  },
  {
    name: 'Table à manger Extensible Nordik',
    slug: 'table-extensible-nordik',
    categorySlug: 'tables',
    price: 449.0,
    oldPrice: 549.0,
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&h=600&fit=crop',
    ],
    colors: ['Chêne clair', 'Noyer'],
    materials: ['Bois massif', 'Métal'],
    description: 'Table extensible de 160 à 220 cm. Design épuré et robuste, idéale pour les repas en famille ou entre amis.',
    features: ['Extension centrale', '6 à 10 personnes', 'Finition mate'],
    stock: 5,
    isNew: false,
    isPromo: true,
  },
  {
    name: 'Table basse Marbre & Bois',
    slug: 'table-basse-marbre-bois',
    categorySlug: 'tables',
    price: 279.0,
    images: ['https://images.unsplash.com/photo-1532372320572-cda256256de2?w=600&h=600&fit=crop'],
    colors: ['Marbre blanc', 'Marbre noir'],
    materials: ['Marbre', 'Bois de noyer'],
    description: 'Table basse au plateau en marbre véritable et pieds en bois massif. Pièce statement pour votre salon.',
    features: ['Plateau 110x60 cm', 'Hauteur 40 cm', 'Pieds réglables'],
    stock: 7,
    isNew: true,
    isPromo: false,
  },
  {
    name: 'Lit King Size Cloud',
    slug: 'lit-king-size-cloud',
    categorySlug: 'lits',
    price: 899.0,
    oldPrice: 1099.0,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac8da4933a1a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop',
    ],
    colors: ['Gris clair', 'Beige', 'Anthracite'],
    materials: ['Tissu bouclé', 'Bois'],
    description: 'Lit king size 180x200 cm avec tête de lit capitonnée. Confort exceptionnel et design contemporain.',
    features: ['Sommier inclus', 'Rangement sous le lit', 'Tissu anti-tâche'],
    stock: 4,
    isNew: false,
    isPromo: true,
  },
  {
    name: 'Lit Simple Minimal',
    slug: 'lit-simple-minimal',
    categorySlug: 'lits',
    price: 399.0,
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop'],
    colors: ['Blanc', 'Chêne'],
    materials: ['Bois de pin', 'Métal'],
    description: "Lit simple 90x200 cm au design minimaliste. Parfait pour chambre d'enfant ou studio.",
    features: ['Structure solide', 'Montage rapide', 'Compatible matelas standard'],
    stock: 12,
    isNew: true,
    isPromo: false,
  },
  {
    name: 'Canapé 3 places SoftLine',
    slug: 'canape-3-places-softline',
    categorySlug: 'canapes',
    price: 1299.0,
    oldPrice: 1599.0,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop',
    ],
    colors: ['Gris clair', 'Bleu nuit', 'Beige'],
    materials: ['Tissu', 'Mousse haute densité'],
    description: 'Canapé 3 places ultra-confortable avec accoudoirs larges et assise profonde. Le compagnon idéal de vos soirées.',
    features: ['Assise 220 cm', 'Coussins amovibles', 'Pieds en bois'],
    stock: 3,
    isNew: false,
    isPromo: true,
  },
  {
    name: 'Fauteuil Lounge Velvet',
    slug: 'fauteuil-lounge-velvet',
    categorySlug: 'canapes',
    price: 459.0,
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop'],
    colors: ['Vert forêt', 'Camel', 'Rose poudré'],
    materials: ['Velours', 'Bois'],
    description: 'Fauteuil lounge en velours doux. Forme arrondie et confort enveloppant pour un moment de détente.',
    features: ['Assise large', 'Dossier haut', 'Pieds en bois massif'],
    stock: 9,
    isNew: true,
    isPromo: false,
  },
  {
    name: 'Armoire Portes Coulissantes',
    slug: 'armoire-portes-coulissantes',
    categorySlug: 'armoires',
    price: 799.0,
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop'],
    colors: ['Blanc', 'Chêne', 'Gris'],
    materials: ['Mélaminé', 'Métal'],
    description: 'Grande armoire 200 cm avec portes coulissantes et miroir intégré. Optimisez votre espace de rangement.',
    features: ['3 portes', 'Étagères réglables', 'Penderie + tiroirs'],
    stock: 6,
    isNew: false,
    isPromo: false,
  },
  {
    name: 'Commode 6 tiroirs Nordic',
    slug: 'commode-6-tiroirs-nordic',
    categorySlug: 'armoires',
    price: 349.0,
    oldPrice: 429.0,
    images: ['https://images.unsplash.com/photo-1505693416388-ac8da4933a1a?w=600&h=600&fit=crop'],
    colors: ['Blanc', 'Chêne naturel'],
    materials: ['Bois de pin', 'MDF'],
    description: "Commode spacieuse à 6 tiroirs. Design scandinave épuré, idéale pour la chambre ou l'entrée.",
    features: ['Tiroirs à fermeture douce', 'Poignées intégrées', 'Pieds réglables'],
    stock: 11,
    isNew: false,
    isPromo: true,
  },
  {
    name: 'Vase Céramique Artisan',
    slug: 'vase-ceramique-artisan',
    categorySlug: 'decoration',
    price: 49.9,
    images: ['https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=600&fit=crop'],
    colors: ['Terre cuite', 'Blanc cassé', 'Noir'],
    materials: ['Céramique'],
    description: 'Vase en céramique artisanal. Forme organique et texture unique. Parfait pour fleurs séchées ou branches.',
    features: ['Hauteur 35 cm', 'Fait main', 'Étanche'],
    stock: 20,
    isNew: true,
    isPromo: false,
  },
  {
    name: 'Lampe de table Globe',
    slug: 'lampe-table-globe',
    categorySlug: 'decoration',
    price: 79.0,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'],
    colors: ['Laiton', 'Noir mat'],
    materials: ['Métal', 'Verre'],
    description: 'Lampe de table au design contemporain. Abat-jour globe en verre opalin et base en métal.',
    features: ['Ampoule LED incluse', 'Interrupteur tactile', 'Hauteur 42 cm'],
    stock: 14,
    isNew: false,
    isPromo: false,
  },
  {
    name: 'Chaise de bureau Ergonomique',
    slug: 'chaise-bureau-ergonomique',
    categorySlug: 'chaises',
    price: 249.0,
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop'],
    colors: ['Noir', 'Gris'],
    materials: ['Mesh', 'Plastique'],
    description: 'Chaise de bureau ergonomique avec support lombaire réglable et accoudoirs ajustables.',
    features: ['Réglage hauteur', 'Inclinaison 120°', 'Roulettes silencieuses'],
    stock: 18,
    isNew: true,
    isPromo: false,
  },
  {
    name: 'Table console Entrée',
    slug: 'table-console-entree',
    categorySlug: 'tables',
    price: 189.0,
    images: ['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&h=600&fit=crop'],
    colors: ['Chêne', 'Noir'],
    materials: ['Bois massif', 'Métal'],
    description: "Console fine et élégante pour l'entrée ou le salon. Plateau en bois massif et pieds en métal noir.",
    features: ['Dimensions 120x35x80 cm', 'Charge max 30 kg', 'Finition huilée'],
    stock: 10,
    isNew: false,
    isPromo: false,
  },
  {
    name: "Canapé d'angle Modulaire",
    slug: 'canape-angle-modulaire',
    categorySlug: 'canapes',
    price: 1899.0,
    oldPrice: 2299.0,
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop'],
    colors: ['Gris clair', 'Beige'],
    materials: ['Tissu', 'Mousse'],
    description: "Canapé d'angle modulable. Composez votre salon selon vos envies. Confort premium et design contemporain.",
    features: ['Modules indépendants', 'Tissu déhoussable', 'Assise profonde'],
    stock: 2,
    isNew: true,
    isPromo: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const categoryMap = {}
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat })
    categoryMap[cat.slug] = created.id
    console.log(`  ✓ Category: ${cat.name}`)
  }

  // Create products
  for (const p of products) {
    const { categorySlug, ...data } = p
    await prisma.product.create({
      data: {
        ...data,
        categoryId: categoryMap[categorySlug],
      },
    })
    console.log(`  ✓ Product: ${p.name}`)
  }

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
