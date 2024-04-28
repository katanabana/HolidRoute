import React, { useEffect, useState } from "react";
import loaderIcon from "../icons/loader.png";

async function getPlaces(lon, lat, userDescription) {
  try {
    let url = "http://localhost:3001";
    url += `/places?lon=${lon}&lat=${lat}&user_description=${userDescription}`;
    const respnose = await fetch(url, { mode: "cors" });
    return await respnose.json();
  } catch (error) {
    return [];
  }
}

const MapWidget = ({ showRoute, routeType, userDescription }) => {
  const [places, setPlaces] = useState([]);
  const [position, setPosition] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      "geolocation" in navigator &&
      ["complete", "interactive"].includes(document.readyState)
    ) {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (position.coords) {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      });
    }
    if (!userDescription) {
      setPlaces([]);
      return;
    }
    setLoading(true);
    getPlaces(position.longitude, position.latitude, userDescription).then(
      (data) => {
        setPlaces(data.slice(0, 10));
        setLoading(false);
      }
    );
  }, [userDescription]);

  useEffect(() => {
    window.ymaps.ready(() => {
      if (["complete", "interactive"].includes(document.readyState)) {
        if (document.getElementsByClassName("ymaps-2-1-79-map").length) {
          document.getElementsByClassName("ymaps-2-1-79-map")[0].remove();
        }

        const map = new window.ymaps.Map("map", {
          center: [position.latitude, position.longitude],
          zoom: 13,
        });

        const routeCoordinates = [];

        for (const point of places) {
          routeCoordinates.push(point.coordinates);
        }

        routeCoordinates.push(map.getCenter());

        if (showRoute) {
          // Create a route
          var route = new window.ymaps.multiRouter.MultiRoute(
            {
              // Описание опорных точек мультимаршрута.
              referencePoints: routeCoordinates,
              // Параметры маршрутизации.
              params: {
                // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                results: 1,
                routingMode: routeType,
              },
            },
            {
              boundsAutoApply: true,
              wayPointVisible: false,
              hideIconOnBaloonOpen: false,
            }
          );

          map.geoObjects.add(route);
        }

        for (const place of places) {
          const marker = new window.ymaps.Placemark(place.coordinates, {
            hintContent:
              (place.name ? place.name + " " : "") +
              (place.categories ? `(${place.categories.join()})` : ""),
          });

          map.geoObjects.add(marker);
        }

        const current = new window.ymaps.Placemark(
          map.getCenter(),
          {
            hintContent: "Вы здесь",
          },
          {
            preset: "islands#governmentCircleIcon",
            iconColor: "#3b5998",
          }
        );

        map.geoObjects.add(current);
      }
    });
  }, [position, places, showRoute, routeType]);

  return (
    <>
      <div id="map" className={loading ? " blur" : ""}>
        {" "}
        <img
          className={"loader hiddable" + (loading ? "" : " hidden")}
          src={loaderIcon}
        ></img>
      </div>{" "}
    </>
  );
};

export default MapWidget;
