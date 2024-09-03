import "./App.css";
import mapIcon from "./icons/map.png";
import routeIcon from "./icons/route.png";
import noRouteIcon from "./icons/close.png";
import pedestrianIcon from "./icons/walk.png";
import carIcon from "./icons/car.png";
import busIcon from "./icons/bus.png";
import bicycleIcon from "./icons/bicycle.png";
import sendIcon from "./icons/send.png";
import MapWidget from "./MapWidget.js";
import { useState } from "react";

function App() {
  const [showRoute, setShowRoute] = useState(false);
  const [routeType, setRouteType] = useState("pedestrian");
  const [currentUserDescription, setCurrentUserDescription] = useState("");
  const [userDescription, setUserDescription] = useState(
    currentUserDescription
  );

  const [showMain, setShowMain] = useState(false);
  const [showParams, setShowParams] = useState(true);

  let footer = <div></div>;
  if (showMain) {
    footer = (
      <div className="routes">
        <div
          className={
            "bg-rect" +
            (routeType === "pedestrian" && showRoute ? " -opacity-50" : "")
          }
          onClick={() => {
            setRouteType("pedestrian");
            setShowRoute(true);
          }}
        >
          <img alt="img" className="button" src={pedestrianIcon}></img>
        </div>
        <div
          className={
            "bg-rect" +
            (routeType === "auto" && showRoute ? " -opacity-50" : "")
          }
          onClick={() => {
            setRouteType("auto");
            setShowRoute(true);
          }}
        >
          <img alt="img" className="button" src={carIcon}></img>
        </div>
        <div
          className={
            "bg-rect" +
            (routeType === "masstransit" && showRoute ? " -opacity-50" : "")
          }
          onClick={() => {
            setRouteType("masstransit");
            setShowRoute(true);
          }}
        >
          <img alt="img" className="button" src={busIcon}></img>
        </div>
        <div
          className={
            "bg-rect" +
            (routeType === "bicycle" && showRoute ? " -opacity-50" : "")
          }
          onClick={() => {
            setRouteType("bicycle");
            setShowRoute(true);
          }}
        >
          <img alt="img" className="button" src={bicycleIcon}></img>
        </div>
        <div
          className={"bg-rect" + (!showRoute ? " -opacity-50" : "")}
          onClick={() => setShowRoute(false)}
        >
          <img alt="img" className="button" src={noRouteIcon}></img>
        </div>
      </div>
    );
  } else if (showParams) {
    footer = (
      <div className="-footer-div">
        <div className="bg-rect -text-area-div">
          <textarea
            defaultValue={currentUserDescription}
            placeholder="Enter your wishes for the route"
            onChange={(event) => setCurrentUserDescription(event.target.value)}
          ></textarea>
        </div>
        <div
          className="bg-rect"
          onClick={() => setUserDescription(currentUserDescription)}
        >
          <img alt="img" className="button" src={sendIcon}></img>
        </div>
      </div>
    );
  }

  let c1 = "";
  if (showMain) {
    c1 = "-opacity-50";
  } else {
    c1 = "";
  }

  let c2 = "";
  if (showParams) {
    c2 = "-opacity-50";
  } else {
    c2 = "";
  }

  return (
    <>
      <div className="header">
        <div className="bg-rect main-header">
          <img
            alt="img"
            className={"button " + c2}
            src={mapIcon}
            onClick={() => {
              setShowMain(false);
              setShowParams(true);
            }}
          ></img>
          <img
            alt="img"
            className={"button " + c1}
            src={routeIcon}
            onClick={() => {
              setShowMain(true);
              setShowParams(false);
            }}
          ></img>
        </div>
        <h1>HolidRoute</h1>
      </div>

      <MapWidget
        showRoute={showRoute}
        routeType={routeType}
        userDescription={userDescription}
      ></MapWidget>

      {footer}
    </>
  );
}

export default App;
