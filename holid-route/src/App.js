import "./App.css";
import map from "./icons/map.png";
import params from "./icons/params.png";
import profile from "./icons/profile.png";
import settings from "./icons/settings.png";
import route from "./icons/route.png";
import MapWidget from "./components/MapWidget.js";
import { useState } from "react";

const routeTypes = ["pedestrian", "auto", "masstransit", "bicycle", "taxi"];

function App() {
  const [showRoute, setShowRoute] = useState(false);
  const [routeType, setRouteType] = useState("pedestrian");
  const [categories, setCategories] = useState(["tourism"]);

  const [showMain, setShowMain] = useState(true);
  const [showParams, setShowParams] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  let footer = <div></div>;
  if (showMain) {
    footer = (
      <div className="routes">
        <div className="bg-rect" onClick={() => setShowRoute(!showRoute)}>
          <img className="button" src={route}></img>
        </div>
        {routeTypes.map((routeType) => (
          <div className="bg-rect" onClick={() => setRouteType(routeType)}>
            <img className="button" src={route}></img>
          </div>
        ))}
      </div>
    );
  } else if (showParams) {
    footer = <div></div>;
  } else if (showCategories) {
    footer = <div></div>;
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
              setShowCategories(false);
            }}
          ></img>

          <img
            className="button"
            src={params}
            onClick={() => {
              setShowMain(false);
              setShowParams(true);
              setShowCategories(false);
            }}
          ></img>

          <img
            className="button"
            src={profile}
            onClick={() => {
              setShowMain(false);
              setShowParams(false);
              setShowCategories(true);
            }}
          ></img>
        </div>

        <div className="bg-rect">
          <img className="button" src={settings}></img>
        </div>
      </div>

      <MapWidget
        showRoute={showRoute}
        routeType={routeType}
        categories={categories}
      ></MapWidget>

      {footer}
    </>
  );
}

export default App;
