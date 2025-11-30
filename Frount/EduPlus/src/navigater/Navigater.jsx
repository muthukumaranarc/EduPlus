import { useParams } from "react-router-dom";
import Dashboard from "../pages/home/Dashboard.jsx";
import Action from "../pages/home/action/Action.jsx";
import Ai from "../pages/home/Ai.jsx";
import Test from "../pages/home/Test.jsx";
import Friend from "../pages/home/Friend.jsx";
import Settings from "../pages/home/Settings.jsx";

function Navigater() {
    let params = useParams();
    return (
        <>
            {renderPage(params.nav)}
        </>
    );
}

function renderPage(nav) {
  switch (nav) {
    case "dashboard":
      return <Dashboard />;

    case "action":
      return <Action />;

    case "ai":
      return <Ai />;
    
    case "test":
      return <Test />;
    
    case "friend":
      return <Friend />;
    
    case "setting":
      return <Settings />;

    default:
      return;
  }
}


export default Navigater;