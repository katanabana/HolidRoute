import React, { useEffect, useState } from "react";
import loaderIcon from "../icons/loader.png";
import process from "process"; // Node.js process module imported

async function getPlaces(lon, lat, userDescription) {
  try {
    let url = process.env.REACT_APP_API_URL;
    url += `/places?lon=${lon}&lat=${lat}&user_description=${userDescription}`;
    const respnose = await fetch(url, { mode: "cors" });
    return await respnose.json();
  } catch (error) {
    return [];
  }
}

const MapWidget = ({ showRoute, routeType, userDescription }) => {
  const [places, setPlaces] = useState([]);
  const [latitude, setLatitude] = useState(55.7558);
  const [longitude, setLongitude] = useState(37.6173);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      "geolocation" in navigator &&
      ["complete", "interactive"].includes(document.readyState)
    ) {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (position.coords) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        }
      });
    }
    if (!userDescription) {
      setPlaces([]);
      return;
    }
    setLoading(true);
    getPlaces(longitude, latitude, userDescription).then((data) => {
      setPlaces(data.slice(0, 10));
      setLoading(false);
    });
  }, [userDescription, latitude, longitude]);

  useEffect(() => {
    window.ymaps.ready(() => {
      if (["complete", "interactive"].includes(document.readyState)) {
        if (document.getElementsByClassName("ymaps-2-1-79-map").length) {
          document.getElementsByClassName("ymaps-2-1-79-map")[0].remove();
        }

        const map = new window.ymaps.Map("map", {
          center: [latitude, longitude],
          zoom: 12,
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

        // Define a custom balloon layout
        const CustomBalloonLayout =
          window.ymaps.templateLayoutFactory.createClass(
            // HTML structure of the balloon
            `<div class="custom-balloon">
    <div class="balloon-title">{{ properties.balloonContentHeader }}</div>
    <div class="balloon-description">{{ properties.balloonContentBody }}</div>
  </div>`,
            {
              // You can add functions for interactivity if needed, e.g., onAdd, onRemove
            }
          );

        const CustomHintLayout = CustomBalloonLayout;

        // Adding placemarks with the custom balloon
        for (const place of places) {
          const marker = new window.ymaps.Placemark(
            place.coordinates,
            {
              // Define properties to be used in the custom balloon
              balloonContentHeader: place.name ? place.name : "",
              balloonContentBody: place.description ? place.description : "", // Add a description or any other custom property
            },
            {
              balloonLayout: CustomBalloonLayout, // Use the custom balloon layout
              hideIconOnBalloonOpen: false, // Keeps the icon visible when balloon is open
              openBalloonOnClick: true, // Ensures the balloon opens on click
              openBalloonOnHover: true,
              hintLayout: CustomHintLayout,
            }
          );

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
  }, [places, showRoute, routeType, latitude, longitude]);

  return (
    <>
      <div id="map" className={loading ? " blur" : ""}>
        {" "}
        <img
          alt="img"
          className={"loader hiddable" + (loading ? "" : " hidden")}
          src={loaderIcon}
        ></img>
      </div>{" "}
    </>
  );
};

export default MapWidget;
