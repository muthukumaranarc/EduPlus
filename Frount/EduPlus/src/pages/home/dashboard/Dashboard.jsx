import "./Dashboard.css";
import TrackList from "../../../components/TrackList";

import girl from "../../../assets/girl.png";
import arrow from "../../../assets/arrow.png";
import arrowBlue from "../../../assets/arrow_blue.png";

import { useOutletContext } from "react-router-dom";
import { useContext, useEffect } from "react";
import  ImageContext  from "../../../context/ImageContext.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { setNavState } = useOutletContext();
    const images = useContext(ImageContext);
    const navigate = useNavigate();

    useEffect(() => {
        setNavState("dashboard");
    }, [setNavState]);

    let name = 'Muthu';
    let motivate = 'Your hard work today is the foundation of the success you’ll own tomorrow. 🚀';
    let progres = 80;

    let aboutCont = [
        {
            head: "Study plan with tests",
            cont: "Google’s most intelligent AI. Explore new capabilities like Agent, Visual Layout, Nano Banana Pro and more. Now free & unlimited in the app.",
            image: images.plan,
            root: "/home/action/plan"
        },
        {
            head: "Communication Improver",
            cont: "Build confidence in English communication. Learn grammar, improve vocabulary, practice speaking concepts, and test your skills regularly.",
            image: images.communication,
            root: "/home/action/communication"
        },
        {
            head: "Study Progress Tracker",
            cont: "See how far you’ve come. Track study time, test performance, strengths, and improvements with clear progress insights.",
            image: images.progress,
            root: "/home/action/progress"
        },
        {
            head: "Fitness Tracker",
            cont: "Balance learning with wellness. Follow guided workouts and mindfulness routines to keep your body and mind healthy.",
            image: images.fitness,
            root: "/home/action/fitness"
        },
        {
            head: "Personal Assistant (AI Chat)",
            cont: "Your always-available AI assistant. Ask questions, clear doubts, get explanations, and stay focused on your learning goals.",
            image: images.assistant,
            root: "/home/action/ai"
        },
    ]

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
            <div className="aboutSec">
                {
                    aboutCont.map((about, key) => (
                        <div key={key} className="aboutAction">
                            {
                                (key % 2 !== 0) ? <img src={about.image} loading="lazy" /> : null
                            }
                            <div>
                                <h2>{about.head}</h2>
                                <p>{about.cont}</p>
                                <div onClick={() => {navigate(about.root), setNavState("action")}}>
                                    <p>Try Now</p>
                                    <img src={arrowBlue} alt="arrow" />
                                </div>
                            </div>
                            {
                                (key % 2 === 0) ? <img src={about.image} loading="lazy" /> : null
                            }
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Dashboard;
