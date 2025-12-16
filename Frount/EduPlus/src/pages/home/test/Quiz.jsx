import { useParams } from 'react-router-dom';
import './Quiz.css';

function Quiz(){
    let params = useParams();
    let questions = 
        [
            {
                question: "Which of the following is not a feature of Java?",
                options: [
                "Platform-independent",
                "Object-oriented",
                "Pointer arithmetic",
                "Automatic memory management"
                ],
                answer: "Pointer arithmetic"
            },
            {
                question: "What is the default value of a boolean variable in Java?",
                options: [
                "True",
                "False",
                "0",
                "null"
                ],
                answer: "False"
            },
            {
                question: "Which keyword is used to inherit a class in Java?",
                options: [
                "this",
                "super",
                "extends",
                "implements"
                ],
                answer: "extends"
            },
            {
                question: "Which of these is the correct way to declare an array in Java?",
                options: [
                "int arr[] = new int[5];",
                "int arr = new int[5];",
                "int[5] arr;",
                "array arr = new int[5];"
                ],
                answer: "int arr[] = new int[5];"
            },
            {
                question: "Which of the following is not part of OOP in Java?",
                options: [
                "Encapsulation",
                "Inheritance",
                "Compilation",
                "Polymorphism"
                ],
                answer: "Compilation"
            }
        ]

    return (
        <>
            <div className='quiz-header'>
                <h4>Quiz - {params.testName}</h4>
                <img src="/src/assets/reload.png" alt="reload" onClick={()=>{}}/>
            </div>
            <div className='quiz'>
                {
                    questions.map((questionData, index) => (
                        <QuestionCard 
                            key={index}
                            questionData={questionData}
                            questionNumber={index + 1}
                        />
                    ))
                    
                }
            </div>
        </>
    );
}


function QuestionCard({questionData, questionNumber}) {
    return (
        <div className="question-card">
            <h4>{questionNumber}: {questionData.question}</h4> 
            <div>
                {questionData.options.map((option, index) => (
                    <button key={index}>{option}</button>
                ))}
            </div>
        </div>
    );
}

export default Quiz;