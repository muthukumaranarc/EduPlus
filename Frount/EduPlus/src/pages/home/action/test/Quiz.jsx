import "./Quiz.css";
import { useEffect, useState } from "react";
import arrow from "../../../../assets/arrow.png";
import axios from "axios";

function Quiz({ groupName, testTitle, onBack }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${baseURL}/test/get-all-group`, {
        withCredentials: true,
      });

      const group = res.data.testGroup.find(
        (g) => g.name === groupName
      );

      const test = group?.group.find(
        (t) => t.title === testTitle
      );

      setQuestions(test?.questionSet || []);
    } catch (err) {
      console.error("Failed to load quiz", err);
    }
  };

  return (
    <>
      <div className='ac-head' onClick={onBack}>
        <img src={arrow} alt="arrow" />
        <p>Back</p>
      </div>

      <div style={{display: "flex", alignItems:"flex-end"}}>
        <h4 className="quiz-header">Quiz - {testTitle}</h4>
        {
          !complete &&
          <button className="get-answer" onClick={() => { setComplete(!complete) }}>Get Answers</button>
        }
      </div>

      <div className="quiz">
        {questions.map((questionData, index) => (
          <QuestionCard
            key={index}
            questionData={questionData}
            questionNumber={index + 1}
            complete={complete}
          />
        ))}
      </div>
    </>
  );
}

function QuestionCard({ questionData, questionNumber, complete }) {
  const [disableOption, setDisableOption] = useState(false)
  return (
    <div className="question-card">
      <h4>
        {questionNumber}. {questionData.question}
      </h4>
      <div>
        {
          complete ?
            <p>
              <b>Answer: </b>
              {questionData.answer}
            </p> :
            // {
            questionData.options.map((option, index) => (
              <Options
                index={index}
                option={option}
                answer={questionData.answer}
                setDisableOption={setDisableOption}
                disableOption={disableOption}
                complete={complete}
              />
            ))
          // }

        }
      </div>
    </div>
  );
}

function Options({ index, option, answer, setDisableOption, disableOption }) {
  const [isCorrect, setIsCorrect] = useState(null);
  return (
    <button
      key={index}
      disabled={disableOption}
      className={isCorrect !== null ? isCorrect ? 'correct' : 'wrong' : null}
      onClick={() => {
        option == answer ? setIsCorrect(true) : setIsCorrect(false);
        setDisableOption(true)
      }}>
      {option}
    </button>
  )
}

export default Quiz;
