export const products = [
  { 
    id: 1, 
    name: 'Pearl Drop Necklace', 
    price: 4500, 
    category: 'necklace', 
    img: '/images/placeholder.jpg',
    description: 'Elegant freshwater pearl drop necklace with 14k gold-plated chain.'
  },
  { 
    id: 2, 
    name: 'Gold Chain Necklace', 
    price: 3800, 
    category: 'necklace', 
    img: '/images/placeholder.jpg',
    description: 'Classic gold chain necklace with secure clasp.'
  },
  { 
    id: 3, 
    name: 'Gold Chain Bracelet', 
    price: 3200, 
    category: 'bracelet', 
    img: '/images/placeholder.jpg',
    description: 'Classic gold chain bracelet with secure lobster clasp.'
  },
  { 
    id: 4, 
    name: 'Beaded Stretch Bracelet', 
    price: 2100, 
    category: 'bracelet', 
    img: '/images/placeholder.jpg',
    description: 'Colorful beaded bracelet with stretch fit.'
  },
  { 
    id: 5, 
    name: 'Pearl Drop Earrings', 
    price: 2800, 
    category: 'earrings', 
    img: '/images/placeholder.jpg',
    description: 'Elegant pearl drop earrings with 14k gold-plated hooks.'
  },
  { 
    id: 6, 
    name: 'Gold Hoop Earrings', 
    price: 2200, 
    category: 'earrings', 
    img: '/images/placeholder.jpg',
    description: 'Classic gold hoop earrings with a secure clasp.'
  },
  { 
    id: 7, 
    name: 'Crystal Stud Earrings', 
    price: 1800, 
    category: 'earrings', 
    img: '/images/placeholder.jpg',
    description: 'Beautiful crystal stud earrings that catch the light perfectly.'
  },
  { 
    id: 8, 
    name: 'Rose Gold Ring', 
    price: 2800, 
    category: 'ring', 
    img: '/images/placeholder.jpg',
    description: 'Elegant rose gold ring with a delicate design.'
  },
  { 
    id: 9, 
    name: 'Diamond Halo Ring', 
    price: 7500, 
    category: 'ring', 
    img: '/images/placeholder.jpg',
    description: 'Stunning halo design with simulated diamonds.'
  },
  { 
    id: 10, 
    name: 'Gold Arm Cuff', 
    price: 4200, 
    category: 'armcuff', 
    img: '/images/placeholder.jpg',
    description: 'Stylish gold arm cuff with an open design.'
  },
  { 
    id: 11, 
    name: 'Beaded Arm Cuff', 
    price: 3500, 
    category: 'armcuff', 
    img: '/images/placeholder.jpg',
    description: 'Beautiful beaded arm cuff with intricate patterns.'
  },
  { 
    id: 12, 
    name: 'Heart Charm', 
    price: 950, 
    category: 'charm', 
    img: '/images/placeholder.jpg',
    description: 'Romantic heart charm with sparkling crystal accents.'
  },
  { 
    id: 13, 
    name: 'Butterfly Charm', 
    price: 850, 
    category: 'charm', 
    img: '/images/placeholder.jpg',
    description: 'Delicate butterfly charm with enamel finish.'
  },
]

// These are needed for category pages
export const necklaceProducts = products.filter(p => p.category === 'necklace')
export const braceletProducts = products.filter(p => p.category === 'bracelet')
export const earringsProducts = products.filter(p => p.category === 'earrings')
export const ringsProducts = products.filter(p => p.category === 'ring')
export const armCuffsProducts = products.filter(p => p.category === 'armcuff')
export const charmsProducts = products.filter(p => p.category === 'charm')