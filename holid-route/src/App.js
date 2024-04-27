import "./App.css";
import map from "./icons/map.png";
import pinIcon from "./icons/pin.png";
import profile from "./icons/profile.png";
import settings from "./icons/settings.png";
import noRouteIcon from "./icons/close.png";
import pedestrianIcon from "./icons/walk.png";
import carIcon from "./icons/car.png";
import busIcon from "./icons/bus.png";
import bicycleIcon from "./icons/bicycle.png";
import MapWidget from "./components/MapWidget.js";
import { useState } from "react";

const routeTypes = ["pedestrian", "auto", "masstransit", "bicycle"];

const allCategories = {
  accommodation: "размещение",
  activity: "деятельность",
  administrative: "административный",
  airport: "аэропорт",
  amenity: "удобства",
  beach: "пляж",
  building: "здание",
  camping: "кемпинг",
  catering: "общественное питание",
  childcare: "уход за детьми",
  commercial: "коммерческое",
  education: "образовательное",
  entertainment: "развлекательное",
  healthcare: "здравоохранение",
  highway: "шоссе",
  leisure: "досуг",
  low_emission_zone: "зона низкой эмиссии",
  man_made: "рукотворный",
  national_park: "национальный_парк",
  natural: "природные",
  office: "офис",
  parking: "парковка",
  pet: "домашнее животное",
  political: "политика",
  populated_place: "населенный пункт",
  postal_code: "почтовый индекс",
  power: "энергетика",
  production: "производство",
  public_transport: "общественный транспорт",
  railway: "железная дорога",
  religion: "религия",
  rental: "прокат",
  service: "сервис",
  ski: "лыжи",
  sport: "спорт ",
  tourism: "туризм",
};

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
        <div className="bg-rect" onClick={() => setRouteType("pedestrian")}>
          <img className="button" src={pedestrianIcon}></img>
        </div>
        <div className="bg-rect" onClick={() => setRouteType("auto")}>
          <img className="button" src={carIcon}></img>
        </div>
        <div className="bg-rect" onClick={() => setRouteType("masstransit")}>
          <img className="button" src={busIcon}></img>
        </div>
        <div className="bg-rect" onClick={() => setRouteType("bicycle")}>
          <img className="button" src={bicycleIcon}></img>
        </div>
        <div className="bg-rect" onClick={() => setShowRoute(!showRoute)}>
          <img className="button" src={noRouteIcon}></img>
        </div>
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
            src={pinIcon}
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
