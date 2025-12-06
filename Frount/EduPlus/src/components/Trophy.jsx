import './trophy.css';
import trophyImg from "../assets/trophy.png";

function Trophy({trophy}) {
    return (
        <div className="trop">
                <img src={trophyImg} alt="trophy" />
                <p>Trophies: {trophy}</p>
        </div>
    );
}

export default Trophy;