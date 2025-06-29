import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 