import "./Action.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useContext } from "react";
import  ImageContext  from "../../../context/ImageContext.js";
import arrow from '../../../assets/arrow_w.png';

function Action() {
    const images = useContext(ImageContext);
    const { setNavState } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        setNavState("action");
    }, [setNavState]);

    const ActionCard = ({ img, title, sub, path }) => (
        <div className="button" onClick={() => navigate(path)}>
            <img
                src={img}
                className="bg-img"
                fetchPriority="high"
                alt={title}
                loading="lazy"
            />

            <div className="text">
                <div style={{ marginTop: sub ? "30px" : "0px" }}>
                    <p>{title}</p>
                    {sub && <p className="sub">{sub}</p>}
                </div>
                <img src={arrow} className="arrow" alt="arrow" />
            </div>
        </div>
    );

    return (
        <>
            <h3>Actions</h3>

            <div className="action-com">
                <ActionCard img={images.plan} title="Study plan with test" path="/home/action/plan" />
                <ActionCard img={images.communication} title="Grammar improver" sub="(English)" path="/home/action/communication" />
                <ActionCard img={images.progress} title="Study progress tracker" path="/home/action/progress" />
                <ActionCard img={images.fitness} title="Fitness tracker" path="/home/action/fitness" />
                <ActionCard img={images.assistant} title="Personal assistant" sub="(AI Chat)" path="/home/action/ai" />
            </div>
        </>
    );
}

export default Action;
