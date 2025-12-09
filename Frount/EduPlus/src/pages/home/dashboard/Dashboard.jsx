import "./Dashboard.css";
import TrackList from "../../../components/TrackList";

import girl from "../../../assets/girl.png";
import arrow from "../../../assets/arrow.png";

import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

function Dashboard() {
    const { setNavState } = useOutletContext();
    
    useEffect(() => {
        setNavState("dashboard");
    }, [setNavState]);

    let name = 'Muthu';
    let motivate = 'Your hard work today is the foundation of the success you’ll own tomorrow. 🚀';
    let progres = 80;

    return (
        <>
            <h3>Dashboard</h3>

            <div className="wel">
                <h2>Welcome back {name}!</h2>
                <p>{motivate}</p>
                <img src={girl} alt="girl" />
            </div>

            <div className="cont">
                <TrackList name={'Today task'} progres={progres} />

                <div className="action-required">
                    <h2>Action Required</h2>

                    <div>
                        <div></div>
                        <div>
                            <p>Workout</p>
                            <p>For 15min</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                    <div>
                        <div></div>
                        <div>
                            <p>Meditation</p>
                            <p>For 15min</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                    <div>
                        <div></div>
                        <div>
                            <p>Complete today tasks</p>
                            <p>within today</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;
