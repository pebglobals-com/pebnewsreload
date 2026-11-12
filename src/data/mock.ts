import type {
  BreakingItem,
  CategoryTile,
  LeadStory,
  PhotoStory,
  Story,
  TrendingItem,
  TrendingTopic,
  VideoStory,
} from '../types'

export const siteMeta = {
  date: 'Sunday, 27 April 2025',
  location: 'Port Harcourt, Nigeria',
  temperature: '28°C',
  weather: 'Light Rain',
}

export const breakingNews: BreakingItem[] = [
  {
    id: 'b1',
    text: 'FG announces new measures to curb coastal erosion in Niger Delta communities',
    time: '12 minutes ago',
  },
  {
    id: 'b2',
    text: 'National Assembly passes bill to strengthen oil spill clean-up fund',
    time: '28 minutes ago',
  },
  {
    id: 'b3',
    text: 'Port Harcourt refinery begins test run of new production line',
    time: '45 minutes ago',
  },
]

export const heroStories: LeadStory[] = [
  {
    id: 'hero-1',
    category: 'NIGER DELTA',
    tag: 'NIGER DELTA',
    title: 'Renewed hope on the waterways',
    deck: 'Communities in the Niger Delta see fresh investment in clean energy, transport and flood protection as FG unveils new development plan.',
    image: '/images/hero-ganvie.jpg',
    author: 'Tunde Alabi',
    authorAvatar: '/images/avatar-author.jpg',
    date: '27 Apr 2025',
    exclusive: true,
  },
  {
    id: 'hero-2',
    category: 'NIGER DELTA',
    tag: 'NIGER DELTA',
    title: 'A new lifeline for riverine markets',
    deck: 'Floating markets are being connected to finance, transport and digital payments, opening a new chapter for traders across the creeks.',
    image: '/images/story-market.jpg',
    author: 'Ngozi Eze',
    authorAvatar: '/images/avatar-amaka.jpg',
    date: '27 Apr 2025',
  },
  {
    id: 'hero-3',
    category: 'ENERGY',
    tag: 'ENERGY',
    title: 'Powering the next decade',
    deck: 'How local engineers are turning the region’s clean-energy ambition into jobs, infrastructure and a more resilient grid.',
    image: '/images/story-wind.jpg',
    author: 'Ibrahim Musa',
    authorAvatar: '/images/avatar-author.jpg',
    date: '26 Apr 2025',
  },
]

export const topStories: Story[] = [
  {
    id: 'top-1',
    category: 'NIGERIA',
    title:
      'Tinubu reiterates commitment to economic reforms, cites growth in key sectors',
    image: '/images/story-politics.jpg',
    time: '12 minutes ago',
  },
  {
    id: 'top-2',
    category: 'AFRICA',
    title:
      'AU backs regional security push as Sahel instability threatens wider stability',
    image: '/images/story-government.jpg',
    time: '45 minutes ago',
  },
  {
    id: 'top-3',
    category: 'WORLD',
    title:
      'Global leaders seek de-escalation as Middle East tensions rise',
    image: '/images/story-city.jpg',
    time: '1 hour ago',
  },
  {
    id: 'top-4',
    category: 'BUSINESS',
    title:
      'Oil prices steady as markets weigh Middle East risks and global demand',
    image: '/images/story-oil.jpg',
    time: '2 hours ago',
  },
]

export const latestNews: Story[] = [
  {
    id: 'latest-1',
    category: 'NIGER DELTA',
    title:
      'Bayelsa launches mangrove restoration drive to protect coastal communities',
    image: '/images/story-mangrove.jpg',
    time: '28 minutes ago',
  },
  {
    id: 'latest-2',
    category: 'NIGERIA',
    title:
      'INEC begins consultations ahead of off-cycle governorship elections',
    image: '/images/story-ballot.jpg',
    time: '1 hour ago',
  },
  {
    id: 'latest-3',
    category: 'AFRICA',
    title: 'Kenya leads push for greener cities at African climate summit',
    image: '/images/story-climate.jpg',
    time: '2 hours ago',
  },
  {
    id: 'latest-4',
    category: 'CULTURE',
    title:
      'Rivers of heritage: How the Niger Delta keeps its stories alive',
    image: '/images/story-culture.jpg',
    time: '3 hours ago',
  },
]

export const trendingStories: TrendingItem[] = [
  { id: 't1', title: "Why the Niger Delta matters in Nigeria's energy transition" },
  { id: 't2', title: '10 young Nigerians driving change in their communities' },
  { id: 't3', title: 'The real cost of coastal erosion in the Niger Delta' },
  { id: 't4', title: "What Africa's youth want from the next decade" },
  { id: 't5', title: 'Global food prices steady, but risks remain, says UN' },
]

export const popularStories: Story[] = [
  {
    id: 'popular-1',
    category: 'NIGER DELTA',
    title: 'Floating markets keep traditions alive on the Niger Delta',
    image: '/images/story-market.jpg',
  },
  {
    id: 'popular-2',
    category: 'NIGERIA',
    title: 'Lagos unveils new blue line rail stations ahead of 2026',
    image: '/images/story-transit.jpg',
  },
  {
    id: 'popular-3',
    category: 'BUSINESS',
    title: 'Nigeria attracts fresh $2bn in clean energy investments',
    image: '/images/story-solar.jpg',
  },
  {
    id: 'popular-4',
    category: 'TECHNOLOGY',
    title:
      'How local innovators are solving real problems in the Niger Delta',
    image: '/images/story-innovators.jpg',
  },
]

export const trendingTopics: TrendingTopic[] = [
  { label: '#Election2027', featured: true },
  { label: '#NigerDelta' },
  { label: '#FuelPrice' },
  { label: '#ClimateChange' },
  { label: '#Youth' },
  { label: '#EnergyTransition' },
  { label: '#Security' },
  { label: '#AFCTA' },
]

export const forYouStories: Story[] = [
  {
    id: 'foryou-1',
    category: 'BUSINESS',
    title:
      'How local businesses in the Niger Delta are turning waste to wealth',
    image: '/images/story-business.jpg',
  },
  {
    id: 'foryou-2',
    category: 'POLITICS',
    title:
      "Rising voices: Youth demand greater inclusion in Nigeria's democratic process",
    image: '/images/story-government.jpg',
  },
  {
    id: 'foryou-3',
    category: 'AFRICA',
    title:
      "West Africa's coastal cities ramp up climate resilience efforts",
    image: '/images/story-coast.jpg',
  },
  {
    id: 'foryou-4',
    category: 'TECHNOLOGY',
    title:
      'Clean energy innovations creating opportunities for Niger Delta youth',
    image: '/images/story-wind.jpg',
  },
]

export const categories: CategoryTile[] = [
  { name: 'Nigeria', image: '/images/story-government.jpg', flag: true },
  { name: 'Africa', image: '/images/story-city.jpg' },
  { name: 'Business', image: '/images/story-transit.jpg' },
  { name: 'Politics', image: '/images/story-politics.jpg' },
  { name: 'Technology', image: '/images/story-vr.jpg' },
  { name: 'Sports', image: '/images/story-sports.jpg' },
  { name: 'Culture', image: '/images/story-culture.jpg' },
  { name: 'Opinion', image: '/images/story-opinion.jpg' },
]

export const videoStories: VideoStory[] = [
  {
    id: 'video-1',
    category: 'NIGER DELTA',
    title: 'Inside the mangrove restoration project in Bayelsa',
    image: '/images/video-1.jpg',
    duration: '4:32',
    time: '27 Apr 2025',
  },
  {
    id: 'video-2',
    category: 'TECHNOLOGY',
    title: 'Young Nigerians building solutions for local challenges',
    image: '/images/video-2.jpg',
    duration: '3:18',
    time: '26 Apr 2025',
  },
]

export const photoStory: PhotoStory = {
  category: 'CULTURE',
  title: 'Life on the Niger Delta: A visual journey',
  date: '27 Apr 2025',
  count: 8,
  image: '/images/photo-main.jpg',
  gallery: [
    '/images/photo-1.jpg',
    '/images/photo-2.jpg',
    '/images/photo-3.jpg',
    '/images/photo-4.jpg',
  ],
}

export const searchIndex: Story[] = [
  ...heroStories,
  ...topStories,
  ...latestNews,
  ...popularStories,
  ...forYouStories,
].filter(
  (story, index, all) => all.findIndex((item) => item.id === story.id) === index,
)

export interface NavItem {
  label: string
  to: string
}

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'The Nation', to: '/categories/the-nation' },
  { label: 'Politics', to: '/categories/politics' },
  { label: 'Business', to: '/categories/business' },
  { label: 'Oil & Gas', to: '/categories/oil-gas' },
  { label: 'Sports', to: '/categories/sports' },
  { label: 'Education', to: '/categories/education' },
  { label: 'Entertainment', to: '/categories/entertainment' },
  { label: 'Health', to: '/categories/health' },
]

export const navLinks = navItems.map((item) => item.label)

export const utilityLinks = [
  'About Us',
  'Advertise',
  'Newsletter',
  'Careers',
  'Contact',
]

export const companyLinks = [
  'About Us',
  'Our Team',
  'Editorial Policy',
  'Privacy Policy',
  'Cookie Policy',
  'Terms of Use',
  'Advertise',
  'Careers',
  'Contact',
]
