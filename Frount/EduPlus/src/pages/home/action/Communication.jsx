import './Communication.css';
import arrow from '../../../assets/arrow.png';
import { useOutletContext } from 'react-router-dom';

function Communication() {

    let { deviceWidth } = useOutletContext();
    return (
        <>
            {
                (deviceWidth > 768) ?
                    <div className='ac-head' onClick={() => window.history.back()}>
                        <img src={arrow} alt="arrow" />
                        <p>Actions</p>
                    </div> : null
            }
            <div className="comm">
                <h2>Communication Improver</h2>
                <p>Improve your grammar skills with easy, structured learning modules.Get clear explanations and practice tasks to strengthen your communication.</p>
                <div>
                    <div onClick={() => { }} className='button'>
                        <h4>Learn Grammer</h4>
                        <p>Learn Grammar with simple and  basic topics</p>
                    </div>

                    <div onClick={() => { }} className='button'>
                        <h4>Grammer test</h4>
                        <p>See your Grammar ability by testing yourself.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Communication;