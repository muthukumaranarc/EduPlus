import "./Test.css";

function Test() {

    let name = 'Computer Science';
    let test = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
    
    return (
        <>
        <h3>Tests</h3>
        <div className="tests">
            {
                group(name, test)
            }
            {
                group(name, test)
            }
        </div>
        </>
    );
}

function group(name, test) {
    return (
        <div className="test-group">
            <p>{name}</p>
            <div>
                {
                    test.map((name) => testBlock(name))
                }
            </div>
        </div>
    )
}

function testBlock(name) {
    return (
        <div className="test-block">
            <p>{name}</p>
            <img src="/src/assets/arrow.png" alt="arrow" />
        </div>
    )
}

export default Test;