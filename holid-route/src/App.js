import "./App.css";
import map from "./icons/route.png";
import profile from "./icons/params.png";
import noRouteIcon from "./icons/close.png";
import pedestrianIcon from "./icons/walk.png";
import carIcon from "./icons/car.png";
import busIcon from "./icons/bus.png";
import bicycleIcon from "./icons/bicycle.png";
import MapWidget from "./components/MapWidget.js";
import { useState } from "react";

function App() {
  const [showRoute, setShowRoute] = useState(false);
  const [routeType, setRouteType] = useState("pedestrian");

  const [showMain, setShowMain] = useState(true);
  const [showParams, setShowParams] = useState(false);

  let footer = <div></div>;
  if (showMain) {
    footer = (
      <div className="routes">
        <div
          className="bg-rect"
          onClick={() => {
            setRouteType("pedestrian");
            setShowRoute(true);
          }}
        >
          <img className="button" src={pedestrianIcon}></img>
        </div>
        <div
          className="bg-rect"
          onClick={() => {
            setRouteType("auto");
            setShowRoute(true);
          }}
        >
          <img className="button" src={carIcon}></img>
        </div>
        <div
          className="bg-rect"
          onClick={() => {
            setRouteType("masstransit");
            setShowRoute(true);
          }}
        >
          <img className="button" src={busIcon}></img>
        </div>
        <div
          className="bg-rect"
          onClick={() => {
            setRouteType("bicycle");
            setShowRoute(true);
          }}
        >
          <img className="button" src={bicycleIcon}></img>
        </div>
        <div className="bg-rect" onClick={() => setShowRoute(false)}>
          <img className="button" src={noRouteIcon}></img>
        </div>
      </div>
    );
  } else if (showParams) {
    footer = (
      <div className="bg-rect params">
        <textarea placeholder="Введите ваши пожелания к прогулке"></textarea>
      </div>
    );
  }

  return (
    <>
      <div className="header">
        <h1>HolidRoute</h1>
        <div className="bg-rect main-header">
          <img
            className="button"
            src={map}
            onClick={() => {
              setShowMain(true);
              setShowParams(false);
            }}
          ></img>

          <img
            className="button"
            src={profile}
            onClick={() => {
              setShowMain(false);
              setShowParams(true);
            }}
          ></img>
        </div>
      </div>

      <MapWidget showRoute={showRoute} routeType={routeType}></MapWidget>

      {footer}
    </>
  );
}

export default App;
