import "./App.css";
import map from "./icons/map.png";
import params from "./icons/params.png";
import profile from "./icons/profile.png";
import settings from "./icons/settings.png";
import route from "./icons/route.png";
import MapWidget from "./components/MapWidget.js";
import { useState } from "react";

const routeTypes = {
  Пеший: "pedestrian",
  Автомобильный: "auto",
  "Общественный транспорт": "masstransit",
  Велосипед: "bicycle",
  Такси: "taxi",
};

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
      <div className="bg-rect route" onClick={() => setShowRoute(!showRoute)}>
        <img className="button" src={route}></img>
      </div>
    );
  } else if (showParams) {
    footer = (
      <div className={"params bg-rect"}>
        <label>
          {"Тип маршрута: "}
          <br></br>

          <select
            name="route-type"
            defaultValue={routeType}
            onChange={(event) => {
              setRouteType(event.target.value);
            }}
          >
            {Object.keys(routeTypes).map((option) => (
              <option
                key={routeTypes[option]}
                value={routeTypes[option]}
                className="select-item"
              >
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  } else if (showCategories) {
    footer = (
      <div className={"params bg-rect"}>
        <label>
          {"Категория: "}
          <br></br>

          <select
            name="categories"
            defaultValue={categories[0]}
            onChange={(event) => {
              setCategories([event.target.value]);
            }}
          >
            {Object.keys(allCategories).map((en) => (
              <option key={en} value={en} className="select-item">
                {allCategories[en]}
              </option>
            ))}
          </select>
        </label>
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
