import "./Action.css";

import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";


function Action() {

    const { setNavState } = useOutletContext();
    useEffect(() => {
        setNavState("action");
    }, [setNavState]);

    let navigate = useNavigate();

    return (
        <>
        <h3>Actions</h3>

        <div className="action-com">

            <div 
            onClick={() => {navigate('/home/action/plan')}} 
            className="button" 
            style={{backgroundImage:`url(/action/study_plan.webp)`}}
            >
                <p>Study plan with test</p>
                <img src="/src/assets/arrow_w.png" loading="lazy" alt="arrow" />
            </div>

            <div 
            onClick={() => {navigate('/home/action/communication')}} 
            className="button" 
            style={{backgroundImage:`url(/action/communication_improver.webp)`}}
            >
                <p>Grammar improver</p>
                <p className="sub">(English)</p>
                <img src="/src/assets/arrow_w.png" loading="lazy" alt="arrow" />
            </div>

            <div 
            onClick={() => {navigate('/home/action/progress')}} 
            className="button" 
            style={{backgroundImage:`url(/action/study_progress.webp)`}}
            >
                <p>Study progress tracker</p>
                <img src="/src/assets/arrow_w.png" loading="lazy" alt="arrow" />
            </div>

            <div 
            onClick={() => {navigate('/home/action/fitness')}} 
            className="button" 
            style={{backgroundImage:`url(/action/fitness_tracker.webp)`}}
            >
                <p>Fitness tracter</p>
                <img src="/src/assets/arrow_w.png" loading="lazy" alt="arrow" />
            </div>

            <div 
            onClick={() => {navigate('/home/action/ai')}} 
            className="button" 
            style={{backgroundImage:`url(/action/personal_assistant.webp)`}}
            >
                <p>Personal assistant</p>
                <p className="sub">(AI Chat)</p>
                <img src="/src/assets/arrow_w.png" loading="lazy" alt="arrow" />
            </div>
            
        </div>
        </>
    );
}

export default Action;