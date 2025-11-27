import "./Dashboard.css";
import girl from "../assets/girl.png";
import arrow from '../assets/arrow.png';


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
            <div className="today-track">
                <div>
                    <h2>Today track</h2>
                    <img onClick={() => {}} src={arrow} alt="arrow" />
                </div>
                <div className="pro">
                    <div className="bar">
                        <div className="state" style={{ width: `calc( ( 320px / 100 ) * ${progres} )`}}></div>
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
            <div className="action-required">

            </div>
        </>
    );
}

export default Dashboard;