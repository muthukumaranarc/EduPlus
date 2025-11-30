import "./Dashboard.css";
import girl from "../../assets/girl.png";
import arrow from '../../assets/arrow.png';
import TrackList from "../../components/TrackList";


function Dashboard() {
    let name = 'Muthu';
    let motivate = 'Your hard work today is the foundation of the success you’ll own tomorrow. 🚀';
    // let tasks = ['Complete Unit 2', 'Create PPT', 'Make test in CC', "Write record note", 'Prepare for test'];
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
            {/* <div> */}
                <TrackList  progres={progres}/>
            {/* </div> */}
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