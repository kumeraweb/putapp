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

export default function ProfileCard({ name, active, description }: ProfileCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="h-full w-full overflow-hidden bg-white p-4 shadow-2xl sm:p-5">
      <div className="flex h-full items-center gap-4">
        <div className="relative h-full w-1/2 overflow-hidden rounded-2xl bg-neutral-100">
          <div
            className="h-full w-full transition-opacity duration-500"
            style={{ backgroundImage: GALLERY[activeIndex] }}
          />
          <div className="absolute bottom-2 left-2 flex gap-1.5">
            {GALLERY.map((_, index) => (
              <span
                key={`dot-${index}`}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex h-full w-1/2 flex-col justify-between">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-neutral-900">{name}</div>
            <div
              className={`text-xs font-semibold uppercase tracking-wide ${
                active ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {active ? 'Disponible' : 'No disponible'}
            </div>
          </div>
          <p className="max-h-8 overflow-hidden text-xs leading-snug text-neutral-600">
            {description}
          </p>
          <button
            type="button"
            className="self-start rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
