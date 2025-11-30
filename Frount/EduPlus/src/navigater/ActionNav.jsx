import { useParams } from "react-router-dom";
import Communication from "../pages/home/action/Communication";
import Ai from "../pages/home/Ai";
import Plan from "../pages/home/action/Plan";
import Progress from "../pages/home/action/Progress";

function ActionNav() {

    let params = useParams();

    return (
        <>
        {
            renderPage(params.nav)
        }
        </>
    );
}

function renderPage(nav) {
  switch (nav) {
    case "plan":
      return <Plan />;

    case "communication":
      return <Communication />;

    case "progress":
      return <Progress />;
    
    case "ai":
      return <Ai />;

    default:
      return;
  }
}

export default ActionNav;