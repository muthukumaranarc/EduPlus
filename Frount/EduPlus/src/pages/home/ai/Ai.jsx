import "./Ai.css";

import generate from "../../../assets/generate.png";
import aiSearch from "../../../assets/aiSearch.png";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Ai() {

    const { setNavState } = useOutletContext();
    useEffect(() => {
        setNavState("ai");
    }, [setNavState]);

    let quichPic = ['How to start EduPlus for learning?', 'Motivate Me', 'What is weather today?'];

    let [query, setQuery] = useState("What is in your mind?")

    return (
        <div className="ai-chat"> 
        <h3>Ai Chat</h3>
        <h2>Speak with Eduplus AI</h2>
        <p>With EduPlus AI, you can ask questions, get guidance, and instantly speak for smarter learning.</p>
        <div className="query">
            <input type="text" id="input" placeholder={query}/>
            <button>
                <img src={generate} alt="generate" />
                <p>Generate</p>
            </button>
        </div>
        <div className="quick-pic">
            {
                quichPic.map((data, index) => (
                    <div key={index} onClick={() => {setQuery(data)}}>
                        <img src={aiSearch} alt="" />
                        <p>{data}</p>
                    </div>
                ))
            }
        </div>
        </div>
    );
}

export default Ai;