import React, { useEffect, useState } from "react";

async function getPlaces(lon, lat, n, categories) {
  let url = "http://192.168.1.62:3001";
  url += `/places?lon=${lon}&lat=${lat}&n=${n}&categories=${categories.join()}`;
  const respnose = await fetch(url, { mode: "cors" });
  return await respnose.json();
}

const MapWidget = () => {
  const [places, setPlaces] = useState([]);
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        getPlaces(position.coords.longitude, position.coords.latitude, 20, [
          "tourism",
        ]).then((data) => setPlaces(data));
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

        const routeCoordinates = [];
        for (const point of places) {
          routeCoordinates.push(point.coords);
        }

        // Create a route
        var route = new window.ymaps.multiRouter.MultiRoute(
          {
            // Описание опорных точек мультимаршрута.
            referencePoints: routeCoordinates,
            // Параметры маршрутизации.
            params: {
              // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
              results: 1,
            },
          },
          {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true,
          }
        );

        map.geoObjects.add(route);

        for (const place of places) {
          const marker = new window.ymaps.Placemark(place.coords, {
            hintContent: place.name,
          });

          map.geoObjects.add(marker);
        }

        const current = new window.ymaps.Placemark(
          map.getCenter(),
          {
            balloonContent: "Вы <strong>здесь</strong>",
          },
          {
            preset: "islands#governmentCircleIcon",
            iconColor: "#3b5998",
          }
        );

        map.geoObjects.add(current);
      });
    }
  }, [position, places]);

  return <div id="map"></div>;
};

export default MapWidget;
