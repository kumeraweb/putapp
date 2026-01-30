import { useEffect, useState } from 'react'

type ProfileCardProps = {
  name: string
  active: boolean
  description: string
}

const GALLERY = [
  'linear-gradient(135deg, #dbeafe, #93c5fd)',
  'linear-gradient(135deg, #fce7f3, #f9a8d4)',
  'linear-gradient(135deg, #dcfce7, #86efac)'
]

export default function ProfileCard({
  name,
  active,
  description
}: ProfileCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="w-full rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="space-y-4">
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-52">
          <div
            className="h-full w-full transition-opacity duration-500"
            style={{ backgroundImage: GALLERY[activeIndex] }}
          />
          <div className="absolute bottom-3 left-3 flex gap-2">
            {GALLERY.map((_, index) => (
              <span
                key={`dot-${index}`}
                className={`h-2 w-2 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-neutral-900">{name}</div>
            <div
              className={`text-sm font-medium ${
                active ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {active ? 'Disponible' : 'No disponible'}
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            WhatsApp
          </button>
        </div>

        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </div>
  )
}
