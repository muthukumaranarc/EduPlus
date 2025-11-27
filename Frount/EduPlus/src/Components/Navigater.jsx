import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Action from "./Action.jsx";
import Ai from "./Ai.jsx";
import Test from "./Test.jsx";
import Friend from "./Friend.jsx";
import Settings from "./Settings.jsx";

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