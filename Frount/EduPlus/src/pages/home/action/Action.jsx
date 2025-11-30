import "./Action.css";

import arrow from '../../../assets/arrow_w.png';
import { useNavigate } from "react-router-dom";

function Action() {

    let navigate = useNavigate();

    return (
        <>
        <h3>Actions</h3>

        <div className="action-com">

            <div onClick={() => {navigate('/home/action/plan')}} className="button">
                <p>Study plan with test</p>
                <img src={arrow} alt="arrow" />
            </div>

            <div onClick={() => {navigate('/home/action/communication')}} className="button">
                <p>Communication improver</p>
                <p className="sub">(English)</p>
                <img src={arrow} alt="arrow" />
            </div>

            <div onClick={() => {navigate('/home/action/progress')}} className="button">
                <p>Study progress tracker</p>
                <img src={arrow} alt="arrow" />
            </div>

            <div onClick={() => {navigate('/home/action/ai')}} className="button">
                <p>Personal assistant</p>
                <p className="sub">(AI Chat)</p>
                <img src={arrow} alt="arrow" />
            </div>
            
        </div>
        </>
    );
}

export default Action;