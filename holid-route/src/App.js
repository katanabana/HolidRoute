import "./App.css";
import map from "./icons/map.png";
import params from "./icons/params.png";
import profile from "./icons/profile.png";
import settings from "./icons/settings.png";
import route from "./icons/route.png";
import MapWidget from "./components/MapWidget.js";

function App() {
  return (
    <>
      <div className="header">
        <h1>HolidRoute</h1>
        <div className="bg-rect main-header">
          <img className="button" src={map}></img>
          <img className="button" src={params}></img>
          <img className="button" src={profile}></img>
        </div>
        <div className="bg-rect">
          <img className="button" src={settings}></img>
        </div>
      </div>

      <div className="bg-rect map">
        <MapWidget></MapWidget>
      </div>

      <div className="bg-rect route">
        <img className="button" src={route}></img>
      </div>
    </>
  );
}

export default App;
