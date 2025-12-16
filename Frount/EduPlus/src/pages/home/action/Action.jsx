import "./Action.css";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { ImageContext } from "../../../context/ImageContext.js";

function Action() {

    const images = useContext(ImageContext);
    const { setNavState } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        setNavState("action");
    }, [setNavState]);

    if (!images.plan) {
        return <p>Loading...</p>;
    }

    const ActionCard = ({ img, title, sub, path }) => {
        const [loaded, setLoaded] = useState(false);

        useEffect(() => {
            const image = new Image();
            image.src = img;

            if (image.complete) {
                // Image already cached → no loader
                setLoaded(true);
            } else {
                image.onload = () => setLoaded(true);
            }
        }, [img]);

        return (
            <div onClick={() => navigate(path)} className="button">

                {!loaded && <div className="img-loader"></div>}

                <img
                    src={img}
                    className={`bg-img ${loaded ? "show" : "hide"}`}
                    alt=""
                />

                <div className="text">
                    <div style={{ marginTop: sub ? "30px" : "0px" }}>
                        <p>{title}</p>
                        {sub && <p className="sub">{sub}</p>}
                    </div>
                    <img src="/src/assets/arrow_w.png" className="arrow" alt="arrow" />
                </div>
            </div>
        );
    };


    return (
        <>
            <h3>Actions</h3>

            <div className="action-com">

                <ActionCard
                    img={images.plan}
                    title="Study plan with test"
                    path="/home/action/plan"
                />

                <ActionCard
                    img={images.communication}
                    title="Grammar improver"
                    sub="(English)"
                    path="/home/action/communication"
                />

                <ActionCard
                    img={images.progress}
                    title="Study progress tracker"
                    path="/home/action/progress"
                />

                <ActionCard
                    img={images.fitness}
                    title="Fitness tracker"
                    path="/home/action/fitness"
                />

                <ActionCard
                    img={images.assistant}
                    title="Personal assistant"
                    sub="(AI Chat)"
                    path="/home/action/ai"
                />

            </div>
        </>
    );
}

export default Action;
