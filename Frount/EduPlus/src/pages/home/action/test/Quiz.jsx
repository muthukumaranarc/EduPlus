import "./Quiz.css";
import { useEffect, useState } from "react";
import arrow from "../../../../assets/arrow.png";
import axios from "axios";

function Quiz({ groupName, testTitle, onBack }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [complete, setComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [trophiesEarned, setTrophiesEarned] = useState([]);

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

  const handleAnswerSelect = (questionIndex, selectedAnswer, isCorrect) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: { answer: selectedAnswer, isCorrect }
    }));
  };

  const handleSubmitQuiz = async () => {
    // Calculate score
    const correctAnswers = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    setScore(percentage);
    setShowResults(true);

    // Award trophies based on performance
    try {
      const earnedTrophies = [];

      // Perfect score trophy
      if (percentage === 100) {
        await awardTrophy("Perfect Score", "Achieved 100% on a test!");
        earnedTrophies.push({ name: "Perfect Score", description: "Achieved 100% on a test!" });
      }

      // High achiever trophy (90%+)
      if (percentage >= 90) {
        await awardTrophy("High Achiever", "Scored 90% or higher!");
        earnedTrophies.push({ name: "High Achiever", description: "Scored 90% or higher!" });
      }

      // Test taker trophy (for completing any test)
      await awardTrophy("Test Taker", "Completed a test!");
      earnedTrophies.push({ name: "Test Taker", description: "Completed a test!" });

      setTrophiesEarned(earnedTrophies);
    } catch (err) {
      console.error("Failed to award trophies", err);
    }
  };

  const awardTrophy = async (trophyName, description) => {
    try {
      await axios.post(
        `${baseURL}/trophy/earn`,
        { trophyName, description },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(`Failed to award trophy: ${trophyName}`, err);
    }
  };

  const allQuestionsAnswered = Object.keys(userAnswers).length === questions.length;

  if (showResults) {
    return <QuizResults
      score={score}
      totalQuestions={questions.length}
      correctAnswers={Object.values(userAnswers).filter(a => a.isCorrect).length}
      trophiesEarned={trophiesEarned}
      onBack={onBack}
      onRetry={() => {
        setUserAnswers({});
        setShowResults(false);
        setComplete(false);
        setScore(0);
        setTrophiesEarned([]);
      }}
    />;
  }

  return (
    <>
      <div className='ac-head' onClick={onBack}>
        <img src={arrow} alt="arrow" />
        <p>Back</p>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
        <h4 className="quiz-header">Quiz - {testTitle}</h4>
        {
          !complete && !allQuestionsAnswered &&
          <button className="get-answer" onClick={() => setComplete(true)}>Get Answers</button>
        }
      </div>

      <div className="quiz">
        {questions.map((questionData, index) => (
          <QuestionCard
            key={index}
            questionData={questionData}
            questionNumber={index + 1}
            complete={complete}
            onAnswerSelect={(answer, isCorrect) => handleAnswerSelect(index, answer, isCorrect)}
            userAnswer={userAnswers[index]}
          />
        ))}

        {!complete && allQuestionsAnswered && (
          <div className="submit-section">
            <button className="submit-quiz-button" onClick={handleSubmitQuiz}>
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function QuestionCard({ questionData, questionNumber, complete, onAnswerSelect, userAnswer }) {
  const [disableOption, setDisableOption] = useState(false);

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
            questionData.options.map((option, index) => (
              <Options
                key={index}
                index={index}
                option={option}
                answer={questionData.answer}
                setDisableOption={setDisableOption}
                disableOption={disableOption}
                onAnswerSelect={onAnswerSelect}
              />
            ))
        }
      </div>
    </div>
  );
}

function Options({ index, option, answer, setDisableOption, disableOption, onAnswerSelect }) {
  const [isCorrect, setIsCorrect] = useState(null);

  const handleClick = () => {
    const correct = option === answer;
    setIsCorrect(correct);
    setDisableOption(true);
    onAnswerSelect(option, correct);
  };

  return (
    <button
      key={index}
      disabled={disableOption}
      className={isCorrect !== null ? isCorrect ? 'correct' : 'wrong' : null}
      onClick={handleClick}>
      {option}
    </button>
  );
}

function QuizResults({ score, totalQuestions, correctAnswers, trophiesEarned, onBack, onRetry }) {
  const getGrade = () => {
    if (score >= 90) return "Excellent!";
    if (score >= 75) return "Great Job!";
    if (score >= 60) return "Good!";
    if (score >= 50) return "Pass";
    return "Keep Practicing!";
  };

  return (
    <>
      <div className='ac-head' onClick={onBack}>
        <img src={arrow} alt="arrow" />
        <p>Back</p>
      </div>

      <div className="quiz-results">
        <div className="results-card">
          <h2>Quiz Complete! 🎉</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-value">{score.toFixed(0)}%</span>
              <span className="score-label">{getGrade()}</span>
            </div>
          </div>

          <div className="results-details">
            <div className="result-item">
              <span className="result-label">Correct Answers:</span>
              <span className="result-value">{correctAnswers} / {totalQuestions}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Score:</span>
              <span className="result-value">{score.toFixed(1)}%</span>
            </div>
          </div>

          {trophiesEarned.length > 0 && (
            <div className="trophies-section">
              <h3>🏆 Trophies Earned!</h3>
              <div className="trophies-list">
                {trophiesEarned.map((trophy, index) => (
                  <div key={index} className="trophy-item">
                    <span className="trophy-icon">🏆</span>
                    <div className="trophy-info">
                      <span className="trophy-name">{trophy.name}</span>
                      <span className="trophy-desc">{trophy.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-actions">
            <button className="retry-button" onClick={onRetry}>Retry Quiz</button>
            <button className="back-button" onClick={onBack}>Back to Tests</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Quiz;
