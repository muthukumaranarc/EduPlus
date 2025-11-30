import './plan.css';
import arrow from "../../../assets/arrow.png";
import upload from "../../../assets/upload.png";

function Plan() {
    return (
        <div className="plan"> 
            <div className='ac-head' onClick={() => window.history.back()}>
                <p>Actions</p>
                <img src={arrow} alt="arrow"/>
            </div>
            
            <h2>Study plan with tests</h2>
            <p>Upload your file or paste text below to instantly generate your personalized study plan with tests.</p>
            <div className="query">
                <input type="text" id="input" placeholder="Upload file and ask your query"/>
                <button>
                    <img src={upload} alt="Upload" />
                    <p>Upload</p>
                </button>
            </div>
        </div>
    )
}

export default Plan;