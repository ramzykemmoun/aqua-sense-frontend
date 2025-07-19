import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
  className?: string;
}

export function LocationPicker({
  onLocationSelect,
  selectedLocation,
  className = "",
}: LocationPickerProps) {
  const [coordinates, setCoordinates] = useState(
    selectedLocation || { lat: 36.7538, lng: 3.0588 }
  );
  const [hasPin, setHasPin] = useState(!!selectedLocation);
  const [mapKey, setMapKey] = useState(0);

  const handleCoordinateChange = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCoords = { ...coordinates, [field]: numValue };
    setCoordinates(newCoords);
    setHasPin(true);
    onLocationSelect(newCoords.lat, newCoords.lng);
    setMapKey((prev) => prev + 1);
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const mapWidth = rect.width;
    const mapHeight = rect.height;

    const latRange = 0.02;
    const lngRange = 0.02;

    const clickLat = coordinates.lat + latRange * (0.5 - y / mapHeight);
    const clickLng = coordinates.lng + lngRange * (x / mapWidth - 0.5);

    const newCoords = { lat: clickLat, lng: clickLng };
    setCoordinates(newCoords);
    setHasPin(true);
    onLocationSelect(newCoords.lat, newCoords.lng);
    setMapKey((prev) => prev + 1);
  };

  const handleRemovePin = () => {
    setHasPin(false);
    onLocationSelect(0, 0);
    setMapKey((prev) => prev + 1);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          setHasPin(true);
          onLocationSelect(lat, lng);
          setMapKey((prev) => prev + 1);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Pond Location</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <MapPin className="h-3 w-3" />
            Use current location
          </button>
          {hasPin && (
            <button
              type="button"
              onClick={handleRemovePin}
              className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Remove pin
            </button>
          )}
        </div>
      </div>

      <div
        className="relative w-full h-48 border border-border rounded-lg overflow-hidden cursor-crosshair"
        onClick={handleMapClick}
        title="Click anywhere on the map to place a pin"
      >
        <iframe
          key={mapKey}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
            coordinates.lng - 0.01
          },${coordinates.lat - 0.01},${coordinates.lng + 0.01},${
            coordinates.lat + 0.01
          }&layer=mapnik${
            hasPin ? `&marker=${coordinates.lat},${coordinates.lng}` : ""
          }`}
          width="100%"
          height="100%"
          style={{ border: 0, pointerEvents: "none" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />

        {hasPin && (
          <div className="absolute top-2 left-2 text-xs text-white bg-black/70 px-2 py-1 rounded z-10">
            📍 Lat: {coordinates.lat.toFixed(4)}, Lng:{" "}
            {coordinates.lng.toFixed(4)}
          </div>
        )}

        {!hasPin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Click to place pin</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Latitude</label>
          <input
            type="number"
            step="0.000001"
            value={hasPin ? coordinates.lat : ""}
            onChange={(e) => handleCoordinateChange("lat", e.target.value)}
            className="w-full px-2 py-1 text-sm border border-border rounded"
            placeholder="36.7538"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Longitude</label>
          <input
            type="number"
            step="0.000001"
            value={hasPin ? coordinates.lng : ""}
            onChange={(e) => handleCoordinateChange("lng", e.target.value)}
            className="w-full px-2 py-1 text-sm border border-border rounded"
            placeholder="3.0588"
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded text-center">
        <MapPin className="h-3 w-3 inline mr-1" />
        {hasPin
          ? "Pin placed! Click elsewhere to move it or remove it using the button above"
          : "Click on map, use current location, or enter coordinates manually"}
      </div>
    </div>
  );
}
