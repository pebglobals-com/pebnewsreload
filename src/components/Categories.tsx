import { Link } from 'react-router-dom'
import type { CategoryTile } from '../types'
import { NigeriaFlag, SectionHeader } from './ui'

interface CategoriesProps {
  categories: CategoryTile[]
  className?: string
}

export function Categories({ categories, className = '' }: CategoriesProps) {
  return (
    <section aria-labelledby="categories-heading" className={className}>
      <SectionHeader
        title={<span id="categories-heading">Featured Categories</span>}
        action="View all categories"
        href="/categories"
      />

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.slug ?? category.name}
            to={category.slug ? `/categories/${category.slug}` : '/categories'}
            className="group relative h-[88px] overflow-hidden rounded-[3px] bg-surface-2 sm:h-[96px] lg:h-[104px]"
          >
            <img
              src={category.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#001018]/90 via-[#001018]/20 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2.5 text-[13.5px] font-semibold text-white">
              {category.flag && <NigeriaFlag />}
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
