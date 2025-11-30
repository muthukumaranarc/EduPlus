import "./TrackList.css";
import arrow from "../assets/arrow.png";

function TrackList({name, progres, }) {

    // let classes = [
    //     {

    //     }
    // ];

    return (
        <div className="today-track">
            <div>
                <h2>{name}</h2>
                <img onClick={() => {}} src={arrow} alt="arrow" />
            </div>
            <div className="pro">
                <div className="bar">
                    <div className="state" style={{ width: `calc( ( 350px / 100 ) * ${progres} )`}}></div>
                </div>
                <p>{progres}%</p>
            </div>
                {/* add ... for using more number char in string */}
            <div>
                <p>Create Unit 2</p>
                <button className="done">Done</button>
            </div>
            <div>
                <p>Create Unit 2</p>
                <button className="comp">Completed</button>
            </div>
            <div>
                <p>Create Unit 2</p>
                <button className="done">Done</button>
            </div>
            {/* {
                tasks.map((task, index) => (
                    <p key={index}>{task}</p>
                ))
            } */}
        </div>
    );
}

export default TrackList;