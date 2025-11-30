import "./Progress.css";
import arrow from "../../../assets/arrow.png";
import TrackList from "../../../components/TrackList";

function Progress() {
    return (
        <div className="progress">
            <div className='ac-head' onClick={() => window.history.back()}>
                <p>Actions</p>
                <img src={arrow} alt="arrow"/>
            </div>
            <h2>Progress tracker</h2>
            <button>+ Create New</button>
            <div className="tracks">
                <TrackList name={"Today's Track"} progres={80}/>
                <TrackList name={"Daily Task"} progres={50}/>
                <TrackList name={"Exam prep"} progres={20}/>
            </div>
        </div>
    );
}

export default Progress;