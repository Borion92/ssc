import Link from 'next/link'

interface NavigationCardProps {
  title: string
  description: string
  href: string
  icon?: string
}

export default function NavigationCard({ title, description, href, icon }: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
    >
      <div className="flex items-center mb-4">
        {icon && (
          <div className="text-3xl mr-3">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}