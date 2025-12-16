import './Fitness.css';
import arrow from '../../../assets/arrow.png';

function Fitness() {
    return (
        <>
        <div className='ac-head' onClick={() => window.history.back()}>
            <img src={arrow} alt="arrow"/>
            <p>Actions</p>
        </div>
        </>
    );
}

export default Fitness;