"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { cn } from "@/lib/utils"

// Initialize mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

export type MapMarker = {
  id: string
  lat: number
  lng: number
  title?: string
  description?: string
  color?: string
}

interface MapProps {
  className?: string
  markers?: MapMarker[]
  center?: [number, number] // [lng, lat]
  zoom?: number
  interactive?: boolean
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (lngLat: { lng: number; lat: number }) => void
  style?: React.CSSProperties
}

export function Map({
  className,
  markers = [],
  center = [-74.5, 40], // Default to US
  zoom = 9,
  interactive = true,
  onMarkerClick,
  onMapClick,
  style,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom,
      interactive,
    })

    map.current.on("load", () => {
      setMapLoaded(true)
    })

    if (onMapClick && interactive) {
      map.current.on("click", (e) => {
        onMapClick({ lng: e.lngLat.lng, lat: e.lngLat.lat })
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update center and zoom if they change
  useEffect(() => {
    if (map.current) {
      map.current.setCenter(center)
      map.current.setZoom(zoom)
    }
  }, [center, zoom])

  // Handle markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Remove old markers
    Object.values(markerRefs.current).forEach((marker) => marker.remove())
    markerRefs.current = {}

    // Add new markers
    markers.forEach((marker) => {
      const el = document.createElement("div")
      el.className = "marker"
      el.style.backgroundColor = marker.color || "#F5A623"
      el.style.width = "20px"
      el.style.height = "20px"
      el.style.borderRadius = "50%"
      el.style.border = "2px solid white"
      el.style.cursor = "pointer"

      const mapMarker = new mapboxgl.Marker(el).setLngLat([marker.lng, marker.lat]).addTo(map.current!)

      if (marker.title || marker.description) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3 style="margin: 0; font-weight: bold;">${marker.title || ""}</h3>
           <p style="margin: 5px 0 0 0;">${marker.description || ""}</p>`,
        )
        mapMarker.setPopup(popup)
      }

      if (onMarkerClick) {
        el.addEventListener("click", () => {
          onMarkerClick(marker)
        })
      }

      markerRefs.current[marker.id] = mapMarker
    })
  }, [markers, mapLoaded, onMarkerClick])

  return <div ref={mapContainer} className={cn("h-[400px] rounded-lg overflow-hidden", className)} style={style} />
}
