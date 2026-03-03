import "./Quiz.css";
import { useEffect, useState, useMemo } from "react";
import arrow from "../../../../assets/arrow.png";
import axios from "axios";

/* ── Type metadata ── */
const TYPE_META = {
    MCQ:        { label: "MCQ",      icon: "🔘", color: "#6366f1", marks: 1 },
    TWO_MARKS:  { label: "2 Marks",  icon: "✏️",  color: "#0891b2", marks: 2 },
    TEN_MARKS:  { label: "10 Marks", icon: "📝",  color: "#7c3aed", marks: 10 },
};

/* ── Infer type for old questions that have no `type` field ── */
const inferType = (q) => {
    if (q.type) return q.type;
    if (Array.isArray(q.options) && q.options.length > 0) return "MCQ";
    return "TWO_MARKS";
};

/* ════════════════════════════════════════════════
   MAIN QUIZ COMPONENT
════════════════════════════════════════════════ */
function Quiz({ groupName, testTitle, onBack }) {
    const baseURL = import.meta.env.VITE_API_URL;

    const [questions,      setQuestions]      = useState([]);
    const [userAnswers,    setUserAnswers]     = useState({});
    const [showAnswers,    setShowAnswers]     = useState(false);
    const [showResults,    setShowResults]     = useState(false);
    const [score,          setScore]           = useState(0);
    const [trophiesEarned, setTrophiesEarned]  = useState([]);

    useEffect(() => { fetchQuestions(); }, []);

    const fetchQuestions = async () => {
        try {
            const res   = await axios.get(`${baseURL}/test/get-all-group`, { withCredentials: true });
            const group = res.data.testGroup?.find(g => g.name === groupName);
            const test  = group?.group?.find(t  => t.title === testTitle);
            setQuestions(test?.questionSet || []);
        } catch (err) { console.error("Failed to load quiz", err); }
    };

    /* Typed question groups */
    const mcqQuestions = useMemo(() => questions.filter(q => inferType(q) === "MCQ"),       [questions]);
    const q2  = useMemo(() => questions.filter(q => inferType(q) === "TWO_MARKS"),  [questions]);
    const q10 = useMemo(() => questions.filter(q => inferType(q) === "TEN_MARKS"),  [questions]);

    const handleAnswerChange = (idx, val, isCorrect = null) => {
        setUserAnswers(prev => ({ ...prev, [idx]: { answer: val, isCorrect } }));
    };

    /* Check if all answerable (MCQ) questions have been answered */
    const mcqIds = mcqQuestions.map(q => questions.indexOf(q));
    const allMcqAnswered = mcqIds.every(i => userAnswers[i]?.answer);
    const allWrittenFilled = [...q2, ...q10].every(q => {
        const i = questions.indexOf(q);
        return (userAnswers[i]?.answer || "").trim().length > 0;
    });
    const canSubmit = questions.length > 0 && allMcqAnswered && allWrittenFilled;

    const handleSubmitQuiz = async () => {
        /* Score only MCQ */
        const totalMcq   = mcqQuestions.length;
        const correctMcq = mcqIds.filter(i => userAnswers[i]?.isCorrect).length;
        const pct        = totalMcq > 0 ? (correctMcq / totalMcq) * 100 : 100;

        setScore(pct);
        setShowResults(true);

        try {
            const earned = [];
            await axios.post(`${baseURL}/trophy/increment-test-completed`, {}, { withCredentials: true });
            earned.push({ name: "Test Completed", description: "You completed a test!", icon: "📝" });
            if (pct >= 90) {
                await axios.post(`${baseURL}/trophy/record-high-score`, {}, { withCredentials: true });
                earned.push({ name: "High Score", description: `MCQ score: ${pct.toFixed(0)}% — Outstanding!`, icon: "⭐" });
            }
            if (pct === 100 && totalMcq > 0) {
                await axios.post(`${baseURL}/trophy/increment-milestone`, {}, { withCredentials: true });
                earned.push({ name: "Perfect MCQ", description: "All MCQs correct — Flawless!", icon: "🥇" });
            }
            setTrophiesEarned(earned);
        } catch (err) { console.error("Trophy error", err); }
    };

    if (showResults) {
        return (
            <QuizResults
                score={score}
                totalMcq={mcqQuestions.length}
                correctMcq={mcqIds.filter(i => userAnswers[i]?.isCorrect).length}
                writtenCount={q2.length + q10.length}
                trophiesEarned={trophiesEarned}
                onBack={onBack}
                onRetry={() => { setUserAnswers({}); setShowResults(false); setShowAnswers(false); setScore(0); setTrophiesEarned([]); }}
            />
        );
    }

    return (
        <div className="quiz-page">
            {/* ── Top bar ── */}
            <div className="quiz-topbar">
                <div className="ac-head" onClick={onBack} style={{ position:"static", marginBottom:0 }}>
                    <img src={arrow} alt="back" /> <p>Back</p>
                </div>
                <div className="quiz-meta">
                    <h2 className="quiz-title">{testTitle}</h2>
                    <div className="quiz-type-chips">
                        {mcqQuestions.length > 0 && <span className="chip chip--mcq">🔘 {mcqQuestions.length} MCQ</span>}
                        {q2.length > 0            && <span className="chip chip--2m">✏️ {q2.length} × 2 Mark</span>}
                        {q10.length > 0           && <span className="chip chip--10m">📝 {q10.length} × 10 Mark</span>}
                    </div>
                </div>
                {!showAnswers && (
                    <button className="quiz-show-ans-btn" onClick={() => setShowAnswers(true)}>
                        Show All Answers
                    </button>
                )}
            </div>

            {/* ── Progress bar ── */}
            {mcqQuestions.length > 0 && (
                <div className="quiz-progress-wrap">
                    <div className="quiz-progress-bar">
                        <div className="quiz-progress-fill" style={{ width: `${(mcqIds.filter(i=>userAnswers[i]).length / mcqQuestions.length)*100}%` }} />
                    </div>
                    <span className="quiz-progress-label">
                        MCQ: {mcqIds.filter(i=>userAnswers[i]).length}/{mcqQuestions.length} answered
                    </span>
                </div>
            )}

            {/* ── Questions ── */}
            <div className="quiz-body">

                {/* MCQ section */}
                {mcqQuestions.length > 0 && (
                    <section className="quiz-section">
                        <div className="quiz-section-header quiz-section-header--mcq">
                            🔘 Multiple Choice Questions <span>({mcqQuestions.length} × 1 mark)</span>
                        </div>
                        {mcqQuestions.map((q, sIdx) => {
                            const globalIdx = questions.indexOf(q);
                            return (
                                <McqCard
                                    key={globalIdx}
                                    q={q}
                                    qNum={sIdx + 1}
                                    globalIdx={globalIdx}
                                    userAnswer={userAnswers[globalIdx]}
                                    showAnswers={showAnswers}
                                    onSelect={(ans, correct) => handleAnswerChange(globalIdx, ans, correct)}
                                />
                            );
                        })}
                    </section>
                )}

                {/* 2-Mark section */}
                {q2.length > 0 && (
                    <section className="quiz-section">
                        <div className="quiz-section-header quiz-section-header--2m">
                            ✏️ Short Answer Questions — 2 Marks <span>({q2.length} questions)</span>
                        </div>
                        {q2.map((q, sIdx) => {
                            const globalIdx = questions.indexOf(q);
                            return (
                                <WrittenCard
                                    key={globalIdx}
                                    q={q}
                                    qNum={sIdx + 1}
                                    globalIdx={globalIdx}
                                    marks={2}
                                    userAnswer={userAnswers[globalIdx]?.answer || ""}
                                    showAnswers={showAnswers}
                                    onChange={val => handleAnswerChange(globalIdx, val, null)}
                                    placeholder="Write a concise 2–3 sentence answer…"
                                    rows={4}
                                />
                            );
                        })}
                    </section>
                )}

                {/* 10-Mark section */}
                {q10.length > 0 && (
                    <section className="quiz-section">
                        <div className="quiz-section-header quiz-section-header--10m">
                            📝 Long Answer Questions — 10 Marks <span>({q10.length} questions)</span>
                        </div>
                        {q10.map((q, sIdx) => {
                            const globalIdx = questions.indexOf(q);
                            return (
                                <WrittenCard
                                    key={globalIdx}
                                    q={q}
                                    qNum={sIdx + 1}
                                    globalIdx={globalIdx}
                                    marks={10}
                                    userAnswer={userAnswers[globalIdx]?.answer || ""}
                                    showAnswers={showAnswers}
                                    onChange={val => handleAnswerChange(globalIdx, val, null)}
                                    placeholder="Write a detailed answer covering all key points…"
                                    rows={8}
                                />
                            );
                        })}
                    </section>
                )}

                {/* ── Submit ── */}
                {!showAnswers && (
                    <div className="quiz-submit-area">
                        {!canSubmit && (
                            <p className="quiz-submit-hint">
                                {!allMcqAnswered
                                    ? `Answer all ${mcqQuestions.length} MCQ${mcqQuestions.length !== 1 ? "s" : ""} to submit`
                                    : "Fill in all written answers to submit"}
                            </p>
                        )}
                        <button
                            className="quiz-submit-btn"
                            onClick={handleSubmitQuiz}
                            disabled={!canSubmit}
                        >
                            🎯 Submit Test
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════
   MCQ CARD
════════════════════════════════════════════════ */
function McqCard({ q, qNum, globalIdx, userAnswer, showAnswers, onSelect }) {
    const [selected, setSelected] = useState(null);
    const [locked,   setLocked]   = useState(false);

    const pick = (opt) => {
        if (locked || showAnswers) return;
        const correct = opt === q.answer;
        setSelected(opt);
        setLocked(true);
        onSelect(opt, correct);
    };

    const opts = Array.isArray(q.options) ? q.options : [];

    return (
        <div className={`qcard qcard--mcq ${locked || showAnswers ? "qcard--locked" : ""}`}>
            <div className="qcard-header">
                <span className="qcard-num">Q{qNum}</span>
                <span className="qcard-badge qcard-badge--mcq">MCQ · 1 mark</span>
            </div>
            <p className="qcard-question">{q.question}</p>

            {showAnswers ? (
                <div className="qcard-answer-reveal">
                    <span className="qcard-answer-label">Correct Answer:</span>
                    <span className="qcard-answer-text">{q.answer}</span>
                </div>
            ) : (
                <div className="qcard-options">
                    {opts.map((opt, i) => {
                        let cls = "option-btn";
                        if (locked) {
                            if (opt === q.answer) cls += " option-btn--correct";
                            else if (opt === selected) cls += " option-btn--wrong";
                        }
                        return (
                            <button key={i} className={cls} onClick={() => pick(opt)} disabled={locked}>
                                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            )}

            {locked && !showAnswers && (
                <p className={`qcard-feedback ${userAnswer?.isCorrect ? "qcard-feedback--correct" : "qcard-feedback--wrong"}`}>
                    {userAnswer?.isCorrect ? "✓ Correct!" : `✗ Correct answer: ${q.answer}`}
                </p>
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════
   WRITTEN ANSWER CARD (2-mark / 10-mark)
════════════════════════════════════════════════ */
function WrittenCard({ q, qNum, marks, userAnswer, showAnswers, onChange, placeholder, rows }) {
    const typeClass = marks === 10 ? "qcard--10m" : "qcard--2m";
    const badgeClass = marks === 10 ? "qcard-badge--10m" : "qcard-badge--2m";

    return (
        <div className={`qcard ${typeClass}`}>
            <div className="qcard-header">
                <span className="qcard-num">Q{qNum}</span>
                <span className={`qcard-badge ${badgeClass}`}>{marks === 10 ? "10 Marks" : "2 Marks"}</span>
            </div>
            <p className="qcard-question">{q.question}</p>

            {showAnswers ? (
                <>
                    {userAnswer && (
                        <div className="written-user-ans">
                            <span className="written-label">Your answer:</span>
                            <p>{userAnswer}</p>
                        </div>
                    )}
                    <div className="qcard-answer-reveal">
                        <span className="qcard-answer-label">Model Answer:</span>
                        <p className="qcard-answer-text">{q.answer}</p>
                    </div>
                </>
            ) : (
                <textarea
                    className="written-textarea"
                    rows={rows}
                    placeholder={placeholder}
                    value={userAnswer}
                    onChange={e => onChange(e.target.value)}
                />
            )}
        </div>
    );
}

/* ════════════════════════════════════════════════
   RESULTS SCREEN
════════════════════════════════════════════════ */
function QuizResults({ score, totalMcq, correctMcq, writtenCount, trophiesEarned, onBack, onRetry }) {
    const getGrade = () => {
        if (totalMcq === 0) return "Submitted! 📋";
        if (score >= 90) return "Excellent! 🌟";
        if (score >= 75) return "Great Job! 👍";
        if (score >= 60) return "Good 😊";
        if (score >= 50) return "Pass ✓";
        return "Keep Practicing! 💪";
    };

    return (
        <div className="results-page">
            <div className="ac-head" onClick={onBack}>
                <img src={arrow} alt="back" /> <p>Back</p>
            </div>

            <div className="results-card">
                <h2 className="results-title">Test Complete! 🎉</h2>

                {totalMcq > 0 && (
                    <div className="score-ring-wrap">
                        <svg className="score-ring" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="52" className="score-ring-bg" />
                            <circle
                                cx="60" cy="60" r="52"
                                className="score-ring-fill"
                                strokeDasharray={`${(score / 100) * 327} 327`}
                            />
                        </svg>
                        <div className="score-ring-inner">
                            <span className="score-pct">{score.toFixed(0)}%</span>
                            <span className="score-grade">{getGrade()}</span>
                        </div>
                    </div>
                )}

                <div className="results-stats">
                    {totalMcq > 0 && (
                        <>
                            <div className="result-row">
                                <span>MCQ Score</span>
                                <span className="result-val">{correctMcq} / {totalMcq} correct</span>
                            </div>
                            <div className="result-row">
                                <span>MCQ Percentage</span>
                                <span className="result-val">{score.toFixed(1)}%</span>
                            </div>
                        </>
                    )}
                    {writtenCount > 0 && (
                        <div className="result-row">
                            <span>Written Questions</span>
                            <span className="result-val">{writtenCount} submitted</span>
                        </div>
                    )}
                </div>

                {writtenCount > 0 && (
                    <div className="results-written-note">
                        📋 Written answers submitted — review them with the model answers by clicking
                        "Retry / Review" and then "Show All Answers".
                    </div>
                )}

                {trophiesEarned.length > 0 && (
                    <div className="results-trophies">
                        <h3>🏆 Trophies Earned</h3>
                        {trophiesEarned.map((t, i) => (
                            <div key={i} className="trophy-row">
                                <span className="trophy-icon">{t.icon}</span>
                                <div>
                                    <span className="trophy-name">{t.name}</span>
                                    <span className="trophy-desc">{t.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="results-actions">
                    <button className="res-btn res-btn--retry" onClick={onRetry}>🔄 Retry / Review</button>
                    <button className="res-btn res-btn--back"  onClick={onBack}>← Back to Tests</button>
                </div>
            </div>
        </div>
    );
}

export default Quiz;
