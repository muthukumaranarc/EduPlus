import './TestBuilder.css';
import arrow from '../../../../assets/arrow.png';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';

function TestBuilder() {
    let { deviceWidth, setNavState } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => { setNavState("test"); }, [setNavState]);

    return (
        <>
            {
                (deviceWidth > 768) ?
                    <div className='ac-head' onClick={() => window.history.back()}>
                        <img src={arrow} alt="arrow" />
                        <p>Actions</p>
                    </div> : null
            }
            <div className="test">
                <h2>Smart Test Builder</h2>
                <p>Create, edit, and manage tests effortlessly. Generate questions from study material, customize tests, and refine them anytime to match your learning goals.</p>
                <div>
                    <div onClick={() => {navigate("/home/test/saved")}} className='button'>
                        <h4>Saved Test</h4>
                        <p>Practice and learn with already saved Tests.</p>
                    </div>

                    <div onClick={() => {navigate("/home/test/generate")}} className='button'>
                        <h4>Generate test</h4>
                        <p>Create new tests by AI with your study notes.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TestBuilder;