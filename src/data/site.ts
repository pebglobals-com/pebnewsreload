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

export const exploreLinks: NavItem[] = [
  { label: 'Latest News', to: '/latest' },
  { label: 'Categories', to: '/categories' },
  { label: 'Topics', to: '/topics' },
  { label: 'Labels', to: '/labels' },
  { label: 'Reporters', to: '/reporters' },
  { label: 'Search', to: '/search' },
]
