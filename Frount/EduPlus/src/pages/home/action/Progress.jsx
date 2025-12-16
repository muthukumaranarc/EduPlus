import "./Progress.css";
import arrow from "../../../assets/arrow.png";
import TrackList from "../../../components/TrackList";
import { useOutletContext } from "react-router-dom";

function Progress() {
    let { deviceWidth } = useOutletContext();
    return (
        <>
            {
                (deviceWidth >= 768) ?
                    <div className='ac-head' onClick={() => window.history.back()}>
                        <img src={arrow} alt="arrow" />
                        <p>Actions</p>
                    </div>
                    : null
            }
            <div className="progress">
                {
                    (deviceWidth >= 768) ? <h2>Progress tracker</h2> : null
                }
                <button>{`+ ${(deviceWidth >= 768) ? 'Create New' : ''}`}</button>
                <div className="tracks">
                    <TrackList name={"Today's Track"} progres={80} />
                    <TrackList name={"Daily Task"} progres={50} />
                    <TrackList name={"Exam prep"} progres={20} />
                </div>
            </div>
        </>
    );
}

export default Progress;