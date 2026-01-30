'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap, Marker as MapboxMarker } from 'mapbox-gl'
import ProfileCard from './ProfileCard'

const DEFAULT_CENTER: [number, number] = [-73.0498, -36.8201] // Concepción, Chile
const DEFAULT_ZOOM = 12
const MOCK_MODELS = [
  {
    id: 'm1',
    name: 'Catalina',
    lat: -36.8219,
    lng: -73.0507,
    active: true,
    description: 'Modelo disponible para sesiones privadas y eventos.'
  },
  {
    id: 'm2',
    name: 'Valentina',
    lat: -36.8126,
    lng: -73.0119,
    active: false,
    description: 'En pausa temporal, vuelve pronto con nuevas fotos.'
  },
  {
    id: 'm3',
    name: 'Fernanda',
    lat: -36.8294,
    lng: -73.0401,
    active: true,
    description: 'Acompañante con estilo relajado y trato cercano.'
  },
  {
    id: 'm4',
    name: 'Isidora',
    lat: -36.8327,
    lng: -73.0664,
    active: false,
    description: 'Disponibilidad limitada durante la semana.'
  },
  {
    id: 'm5',
    name: 'Martina',
    lat: -36.8172,
    lng: -73.0288,
    active: true,
    description: 'Atención personalizada con ambiente premium.'
  }
]

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const markersRef = useRef<MapboxMarker[]>([])
  const [selectedModel, setSelectedModel] = useState<(typeof MOCK_MODELS)[number] | null>(null)

  useEffect(() => {
    let isCancelled = false
    let resizeObserver: ResizeObserver | null = null

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return

      const mapboxgl = await import('mapbox-gl')
      if (isCancelled || !mapContainerRef.current) return

      mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

      mapRef.current = new mapboxgl.default.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM
      })

      // Ensure the map fits its container after mount.
      mapRef.current.once('load', () => {
        mapRef.current?.resize()
      })
      requestAnimationFrame(() => mapRef.current?.resize())

      resizeObserver = new ResizeObserver(() => {
        mapRef.current?.resize()
      })
      resizeObserver.observe(mapContainerRef.current)

      // Add mock model pins (active and inactive for visual testing).
      markersRef.current = MOCK_MODELS.map((model) => {
        const el = document.createElement('div')
        el.className = `model-marker ${model.active ? 'is-active' : 'is-inactive'}`
        el.title = model.name
        // Select model on click (no Mapbox popup).
        el.addEventListener('click', () => {
          setSelectedModel(model)
        })

        return new mapboxgl.default.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([model.lng, model.lat])
          .addTo(mapRef.current!)
      })
    }

    initMap()

    return () => {
      isCancelled = true
      resizeObserver?.disconnect()
      resizeObserver = null
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-neutral-50">
      <header className="flex flex-none basis-[10%] items-center justify-between px-4">
        <div className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
            P
          </div>
          <nav className="flex items-center gap-4 text-sm text-neutral-800">
            <a
              href="#"
              className="transition hover:text-neutral-950"
              onClick={(event) => event.preventDefault()}
            >
              Home
            </a>
            <a
              href="#"
              className="transition hover:text-neutral-950"
              onClick={(event) => event.preventDefault()}
            >
              Explorar
            </a>
            <a
              href="#"
              className="transition hover:text-neutral-950"
              onClick={(event) => event.preventDefault()}
            >
              Info
            </a>
          </nav>
        </div>
        <div className="hidden rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm backdrop-blur sm:block">
          Concepción · En vivo
        </div>
      </header>

      <div className="relative flex-none basis-[70%] w-full min-h-0">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>

      {/* Marker styles are injected here to keep changes local to this component. */}
      <style>{`
        .model-marker {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #16a34a;
          border: 2px solid #ffffff;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          position: relative;
          transform: translateZ(0);
        }
        .model-marker.is-inactive {
          background: #ef4444;
        }
        .model-marker::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%, 2px);
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 10px solid #16a34a;
        }
        .model-marker.is-inactive::after {
          border-top-color: #ef4444;
        }
        .model-marker.is-active::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border: 2px solid rgba(22, 163, 74, 0.6);
          animation: model-pulse 1.8s ease-out infinite;
        }
        @keyframes model-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative flex-none basis-[20%] min-h-0 w-full px-4 pb-3">
        {selectedModel ? (
          <div className="h-full w-full">
            <ProfileCard
              name={selectedModel.name}
              active={selectedModel.active}
              description={selectedModel.description}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white/70 text-sm text-neutral-500">
            Selecciona un pin para ver el perfil
          </div>
        )}
      </div>
    </div>
  )
}
