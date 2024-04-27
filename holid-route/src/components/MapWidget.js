import React, { useEffect, useState } from "react";

const MapWidget = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        if (document.getElementsByClassName("ymaps-2-1-79-map").length) {
          document.getElementsByClassName("ymaps-2-1-79-map")[0].remove();
        }

        const map = new window.ymaps.Map("map", {
          center: [position.latitude, position.longitude],
          zoom: 10,
        });

        const route = [];
        for (const point in route) {
          const marker = new window.ymaps.Placemark(point.coords, {
            hintContent: point.name, // Tooltip text
          });

          map.geoObjects.add(marker);
        }

        window.ymaps
          .route([
            [55.751574, 37.573856],
            [55.755773, 37.617761],
            [position.latitude, position.longitude],
          ])
          .then(
            function (route) {
              // Add route to the map
              map.geoObjects.add(route);
            },
            function (error) {
              console.error("Failed to build route:", error.message);
            }
          );

        const marker = new window.ymaps.Placemark(map.getCenter(), {
          hintContent: "Вы здесь", // Tooltip text
        });

        map.geoObjects.add(marker);
      });
    }
  }, [position]);

  return <div id="map"></div>;
};

export default MapWidget;
