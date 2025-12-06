import './Fitness.css';
import arrow from '../../../assets/arrow.png';

function Fitness() {
    return (
        <>
        <div className='ac-head' onClick={() => window.history.back()}>
                    <p>Fitness tracker</p>
                    <img src={arrow} alt="arrow"/>
                </div>
        </>
    );
}

export default Fitness;