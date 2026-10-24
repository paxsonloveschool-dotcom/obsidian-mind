import { useEffect, useState, useRef } from 'react';

interface ClientLocation {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  projects: number;
}

const clientLocations: ClientLocation[] = [
  // United States - Major concentration
  { id: 1, name: 'Seattle Tech Campus', city: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321, projects: 12 },
  { id: 2, name: 'Portland Corporate Plaza', city: 'Portland', country: 'USA', lat: 45.5152, lng: -122.6784, projects: 8 },
  { id: 3, name: 'San Francisco Bay Projects', city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, projects: 25 },
  { id: 4, name: 'Sacramento State Development', city: 'Sacramento', country: 'USA', lat: 38.5816, lng: -121.4944, projects: 6 },
  { id: 5, name: 'Los Angeles Commercial', city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, projects: 18 },
  { id: 6, name: 'San Diego Resort', city: 'San Diego', country: 'USA', lat: 32.7157, lng: -117.1611, projects: 7 },
  { id: 7, name: 'Phoenix Urban Plaza', city: 'Phoenix', country: 'USA', lat: 33.4484, lng: -112.0740, projects: 9 },
  { id: 8, name: 'Las Vegas Hotel District', city: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, projects: 14 },
  { id: 9, name: 'Denver Corporate Campus', city: 'Denver', country: 'USA', lat: 39.7392, lng: -104.9903, projects: 11 },
  { id: 10, name: 'Salt Lake City', city: 'Salt Lake City', country: 'USA', lat: 40.7608, lng: -111.8910, projects: 5 },
  { id: 11, name: 'Austin Tech District', city: 'Austin', country: 'USA', lat: 30.2672, lng: -97.7431, projects: 16 },
  { id: 12, name: 'Dallas Corporate', city: 'Dallas', country: 'USA', lat: 32.7767, lng: -96.7970, projects: 13 },
  { id: 13, name: 'Houston Medical District', city: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698, projects: 10 },
  { id: 14, name: 'Chicago Downtown', city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, projects: 22 },
  { id: 15, name: 'Minneapolis Corporate', city: 'Minneapolis', country: 'USA', lat: 44.9778, lng: -93.2650, projects: 8 },
  { id: 16, name: 'Nashville Development', city: 'Nashville', country: 'USA', lat: 36.1627, lng: -86.7816, projects: 7 },
  { id: 17, name: 'Atlanta Commercial Hub', city: 'Atlanta', country: 'USA', lat: 33.7490, lng: -84.3880, projects: 15 },
  { id: 18, name: 'Miami Waterfront', city: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, projects: 19 },
  { id: 19, name: 'Orlando Resort Complex', city: 'Orlando', country: 'USA', lat: 28.5383, lng: -81.3792, projects: 11 },
  { id: 20, name: 'Charlotte Corporate Park', city: 'Charlotte', country: 'USA', lat: 35.2271, lng: -80.8431, projects: 9 },
  { id: 21, name: 'Raleigh Research Triangle', city: 'Raleigh', country: 'USA', lat: 35.7796, lng: -78.6382, projects: 6 },
  { id: 22, name: 'Washington DC Federal', city: 'Washington', country: 'USA', lat: 38.9072, lng: -77.0369, projects: 17 },
  { id: 23, name: 'Baltimore Harbor', city: 'Baltimore', country: 'USA', lat: 39.2904, lng: -76.6122, projects: 8 },
  { id: 24, name: 'Philadelphia Urban', city: 'Philadelphia', country: 'USA', lat: 39.9526, lng: -75.1652, projects: 12 },
  { id: 25, name: 'New York Metropolitan', city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, projects: 35 },
  { id: 26, name: 'Boston Financial District', city: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589, projects: 20 },
  
  // Hawaii
  { id: 27, name: 'Honolulu Resort', city: 'Honolulu', country: 'USA', lat: 21.3099, lng: -157.8581, projects: 8 },
  
  // Canada
  { id: 28, name: 'Vancouver Waterfront', city: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, projects: 10 },
  { id: 29, name: 'Toronto Financial', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, projects: 14 },
  
  // Central America & Caribbean
  { id: 30, name: 'Costa Rica Resort', city: 'San José', country: 'Costa Rica', lat: 9.9281, lng: -84.0907, projects: 5 },
  { id: 31, name: 'Dominican Republic', city: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4861, lng: -69.9312, projects: 6 },
  
  // Europe
  { id: 32, name: 'London Financial District', city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, projects: 12 },
  { id: 33, name: 'Stockholm Tech Hub', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, projects: 7 },
];

export function ClientMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        
        // Create the map
        const map = L.map(mapRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        }).setView([35, -40], 3);

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Create custom icon
        const customIcon = L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMCA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDQyQzE1IDQyIDMwIDE4LjUgMzAgMTVDMzAgNi43MTU3MyAyMy4yODQzIDAgMTUgMEM2LjcxNTczIDAgMCA2LjcxNTczIDAgMTVDMCAxOC41IDE1IDQyIDE1IDQyWiIgZmlsbD0iI2RjMjYyNiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSI2IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -42],
        });

        // Add markers
        clientLocations.forEach((location) => {
          const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
          
          marker.bindPopup(`
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; color: #171717; margin-bottom: 4px;">${location.name}</h3>
              <p style="font-size: 14px; color: #525252; margin-bottom: 4px;">
                ${location.city}, ${location.country}
              </p>
              <p style="font-size: 14px; color: #525252;">
                ${location.projects} ${location.projects === 1 ? 'Project' : 'Projects'}
              </p>
            </div>
          `);
        });

        // Small delay to ensure everything is rendered
        setTimeout(() => {
          map.invalidateSize();
          setIsLoading(false);
        }, 100);
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="relative w-full h-[600px] bg-neutral-200 flex items-center justify-center">
        <p className="text-neutral-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center z-10">
          <p className="text-neutral-600">Loading map...</p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full z-0"
        style={{ background: '#a8c9e8' }}
      />
    </div>
  );
}