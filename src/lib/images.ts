const CATEGORY_IMAGES: Record<string, string> = {
  agriculture: '/images/story-mangrove.jpg',
  business: '/images/story-business.jpg',
  crime: '/images/story-government.jpg',
  education: '/images/story-ballot.jpg',
  editorial: '/images/story-opinion.jpg',
  electricity: '/images/story-solar.jpg',
  entertainment: '/images/story-culture.jpg',
  health: '/images/story-coast.jpg',
  metro: '/images/story-city.jpg',
  news: '/images/story-ballot.jpg',
  'oil-gas': '/images/story-oil.jpg',
  politics: '/images/story-politics.jpg',
  religion: '/images/story-opinion.jpg',
  sports: '/images/story-sports.jpg',
  'the-nation': '/images/story-government.jpg',
}

const FALLBACK_IMAGES = [
  '/images/story-city.jpg',
  '/images/story-government.jpg',
  '/images/story-transit.jpg',
  '/images/story-climate.jpg',
  '/images/story-innovators.jpg',
  '/images/story-culture.jpg',
]

function fallbackIndex(value: string) {
  return [...value].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )
}

export function localImageForCategory(categorySlug?: string) {
  if (categorySlug && CATEGORY_IMAGES[categorySlug]) {
    return CATEGORY_IMAGES[categorySlug]
  }

  const seed = categorySlug || 'pebnews'
  return FALLBACK_IMAGES[fallbackIndex(seed) % FALLBACK_IMAGES.length]
}

export function localImageForSlug(slug: string) {
  return FALLBACK_IMAGES[fallbackIndex(slug) % FALLBACK_IMAGES.length]
}
