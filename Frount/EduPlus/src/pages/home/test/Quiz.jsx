import { useParams } from 'react-router-dom';
import './Quiz.css';

function Quiz(){
    let params = useParams();
    return (
        <>
            <h3>Quiz Page - {params.testName}</h3>
        </>
    );
}

export default Quiz;