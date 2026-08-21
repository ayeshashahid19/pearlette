export const CATEGORIES = {
  necklace: {
    label: 'Necklaces',
    subtitle: 'Elegant Handcrafted Pieces for Every Style',
  },
  bracelet: {
    label: 'Bracelets',
    subtitle: 'Delicate Wrist Adornments Crafted with Care',
  },
  earrings: {
    label: 'Earrings',
    subtitle: 'Beautiful Earrings to Complete Your Look',
  },
  ring: {
    label: 'Rings',
    subtitle: 'Handcrafted Rings for Every Occasion',
  },
  armcuff: {
    label: 'Arm Cuffs',
    subtitle: 'Bold Statement Pieces for Your Wrist',
  },
  charm: {
    label: 'Charms',
    subtitle: 'Charming Accents for Bracelets and Necklaces',
  },
}

export const CATEGORY_SLUGS = Object.keys(CATEGORIES)

export const ADMIN_CATEGORY_OPTIONS = [
  { value: 'necklace', label: 'Necklace' },
  { value: 'bracelet', label: 'Bracelet' },
  { value: 'earrings', label: 'Earrings' },
  { value: 'ring', label: 'Ring' },
  { value: 'armcuff', label: 'Arm Cuff' },
  { value: 'charm', label: 'Charm' },
]

export function getCategoryMeta(category) {
  return CATEGORIES[category] || { label: category, subtitle: '' }
}

export function getCategoryPath(category) {
  const paths = {
    necklace: '/necklace',
    bracelet: '/bracelets',
    earrings: '/earrings',
    ring: '/rings',
    armcuff: '/armcuffs',
    charm: '/charms',
  }
  return paths[category] || '/'
}
