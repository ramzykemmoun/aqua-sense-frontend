import React, { useEffect, useRef } from "react";
import { Map } from "ol";
import { Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { transform } from "ol/proj";
import { IPond } from "@/types/pond";
import { useNavigate } from "react-router-dom";

interface MapViewProps {
  ponds: IPond[];
}

export function MapView({ ponds }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: transform([3.0588, 36.7538], "EPSG:4326", "EPSG:3857"),
        zoom: 6,
      }),
    });

    const vectorSource = new VectorSource();

    ponds.forEach((pond) => {
      const { latitude, longitude } = pond;

      if (latitude && longitude) {
        const coordinates = transform(
          [longitude, latitude],
          "EPSG:4326",
          "EPSG:3857"
        );

        const marker = new Feature({
          geometry: new Point(coordinates),
        });

        mapContainer.current.addEventListener("click", (event) => {
          const pixel = map.getEventPixel(event);
          const feature = map.forEachFeatureAtPixel(
            pixel,
            (feature) => feature
          );
          if (feature && feature == marker) {
            const coordinates = feature.getGeometry();
            console.log(coordinates);
            navigate(`/dashboard/ponds/${pond.id}`);
          }
        });

        marker.setStyle(
          new Style({
            image: new Icon({
              src: "https://cdn-icons-png.flaticon.com/512/4251/4251881.png",
              scale: 0.075,
            }),
          })
        );

        vectorSource.addFeature(marker);
      }
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    return () => {
      map.setTarget(undefined);
    };
  }, [ponds]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
