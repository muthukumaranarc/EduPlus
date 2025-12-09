import { useNavigate } from "react-router-dom";
import "./Test.css";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

function Test() {

    const { setNavState } = useOutletContext();
    useEffect(() => {
        setNavState("test");
    }, [setNavState]);

    let name = 'Computer Science';
    let test = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
    let navigate = useNavigate();
    
    return (
        <>
        <h3>Tests</h3>
        <div className="tests">
            {
                group(name, test, navigate)
            }
            {
                group(name, test, navigate)
            }
        </div>
        </>
    );
}

function group(name, test, navigate) {
    return (
        <div className="test-group">
            <p>{name}</p>
            <div>
                {
                    test.map((name,key) => testBlock(key, name, navigate)) 
                }
            </div>
        </div>
    )
}

function testBlock(key, name, navigate) {
    
    return (
        <div key={key} className="test-block button" onClick={() => {navigate(`/home/test/${name}`)}}>
            <p>{name}</p>
            <img src="/src/assets/arrow.png" alt="arrow" />
        </div>
    )
}

export default Test;