'use client';

import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default Leaflet icon not showing correctly in Next.js
const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854866.png', // Fallback icon
  iconSize: [32, 32],
});

interface Farmer {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profile: {
    location: string;
    home_church: string;
    latitude: number;
    longitude: number;
    avatar: string;
  };
}

export default function FarmersMap({ farmers }: { farmers: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
      <MapContainer 
        center={[5.6037, -0.1870]} // Center on Ghana or a sensible default
        zoom={12} 
        scrollWheelZoom={false}
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {farmers.map((farmer) => (
          (farmer.profile?.latitude && farmer.profile?.longitude) && (
            <Marker 
              key={farmer.id} 
              position={[farmer.profile.latitude, farmer.profile.longitude]}
              icon={customIcon}
            >
              <Popup className="premium-popup">
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                      {farmer.profile?.avatar ? (
                        <img src={farmer.profile.avatar} alt="" className="size-full object-cover" />
                      ) : <User size={20} className="m-auto text-muted-foreground" />}
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{farmer.first_name} {farmer.last_name}</h4>
                      <p className="text-[10px] uppercase font-bold text-primary">{farmer.profile.home_church || 'Harvest Member'}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 border-t border-border/50 pt-3">
                    <p className="text-xs flex items-center gap-2 font-medium text-muted-foreground">
                      <MapPin size={12} className="text-primary" /> {farmer.profile.location}
                    </p>
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2 hover:scale-[1.02] transition-all">
                      View Farm Shop
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}
