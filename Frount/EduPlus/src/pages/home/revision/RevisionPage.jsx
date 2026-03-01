import "./RevisionPage.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { getSubjects } from "../../../services/syllabusApi";

function RevisionPage() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [revision, setRevision] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subjectsLoading, setSubjectsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setNavState("revision");
    }, [setNavState]);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        setSubjectsLoading(true);
        try {
            const data = await getSubjects();
            setSubjects(data || []);
            if (data && data.length > 0) {
                setSelectedSubject(data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch subjects:", err);
            setError("Failed to load subjects. Please refresh the page.");
        } finally {
            setSubjectsLoading(false);
        }
    };

    const generateRevision = async () => {
        if (!selectedSubject) return;

        setLoading(true);
        setError(null);
        setRevision(null);

        try {
            const res = await axios.post(
                `${baseURL}/ai/generate-revision`,
                { subject: selectedSubject },
                { withCredentials: true }
            );
            setRevision(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                window.location.href = `${baseURL}/oauth2/authorization/google`;
            } else {
                setError("Failed to generate revision notes. Please try again.");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="revision-page">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="revision-header">
                <div className="revision-header-icon">📖</div>
                <div>
                    <h1 className="revision-title">AI Revision Generator</h1>
                    <p className="revision-subtitle">
                        Generate exam-focused revision notes from your syllabus using Gemini AI
                    </p>
                </div>
            </div>

            {/* ── Control Panel ─────────────────────────────────────────────── */}
            <div className="revision-control-panel">
                <div className="revision-select-wrapper">
                    <label className="revision-label" htmlFor="subject-select">
                        📚 Select Subject
                    </label>
                    {subjectsLoading ? (
                        <div className="revision-select-skeleton" />
                    ) : subjects.length === 0 ? (
                        <p className="revision-no-subjects">
                            No subjects found. Upload syllabus content first.
                        </p>
                    ) : (
                        <select
                            id="subject-select"
                            className="revision-select"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {subjects.map((subject, i) => (
                                <option key={i} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <button
                    className="revision-generate-btn"
                    onClick={generateRevision}
                    disabled={loading || !selectedSubject || subjectsLoading}
                >
                    {loading ? (
                        <>
                            <span className="revision-btn-spinner" />
                            Generating...
                        </>
                    ) : (
                        <>✨ Generate Revision</>
                    )}
                </button>
            </div>

            {/* ── Loading State ─────────────────────────────────────────────── */}
            {loading && (
                <div className="revision-loading-card">
                    <div className="revision-loading-pulse">🧠</div>
                    <h3>Generating AI Revision Notes...</h3>
                    <p>EduPlus AI is crafting exam-focused notes from your <strong>{selectedSubject}</strong> syllabus.</p>
                    <div className="revision-loading-bar">
                        <div className="revision-loading-bar-fill" />
                    </div>
                </div>
            )}

            {/* ── Error State ────────────────────────────────────────────────── */}
            {error && !loading && (
                <div className="revision-error-card">
                    <div className="revision-error-icon">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button className="revision-retry-btn" onClick={generateRevision}>
                        🔄 Try Again
                    </button>
                </div>
            )}

            {/* ── Revision Results ──────────────────────────────────────────── */}
            {revision && !loading && (
                <div className="revision-results">

                    {/* Subject Badge */}
                    <div className="revision-subject-badge">
                        <span>📘</span>
                        <span>{selectedSubject}</span>
                        <span className="revision-badge-tag">AI Generated</span>
                    </div>

                    {/* Section 1: Summary */}
                    <div className="revision-card revision-card--summary">
                        <div className="revision-card-header">
                            <div className="revision-card-icon revision-icon--summary">📋</div>
                            <div>
                                <h2>Summary</h2>
                                <p>Overview of the subject</p>
                            </div>
                        </div>
                        <div className="revision-summary-text">
                            {revision.summary || "No summary available."}
                        </div>
                    </div>

                    {/* Section 2 & 3 grid */}
                    <div className="revision-grid">

                        {/* Section 2: Key Points */}
                        <div className="revision-card revision-card--keypoints">
                            <div className="revision-card-header">
                                <div className="revision-card-icon revision-icon--keypoints">🔑</div>
                                <div>
                                    <h2>Key Points</h2>
                                    <p>Core concepts to remember</p>
                                </div>
                            </div>
                            <ul className="revision-bullet-list">
                                {revision.keyPoints?.length > 0
                                    ? revision.keyPoints.map((point, i) => (
                                        <li key={i} className="revision-bullet-item">
                                            <span className="revision-bullet revision-bullet--blue">●</span>
                                            <span>{point}</span>
                                        </li>
                                    ))
                                    : <li className="revision-list-empty">No key points available.</li>
                                }
                            </ul>
                        </div>

                        {/* Section 4: Revision Tips */}
                        <div className="revision-card revision-card--tips">
                            <div className="revision-card-header">
                                <div className="revision-card-icon revision-icon--tips">💡</div>
                                <div>
                                    <h2>Quick Revision Tips</h2>
                                    <p>Strategies to boost retention</p>
                                </div>
                            </div>
                            <ul className="revision-bullet-list">
                                {revision.revisionTips?.length > 0
                                    ? revision.revisionTips.map((tip, i) => (
                                        <li key={i} className="revision-bullet-item">
                                            <span className="revision-bullet revision-bullet--yellow">●</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))
                                    : <li className="revision-list-empty">No tips available.</li>
                                }
                            </ul>
                        </div>

                    </div>

                    {/* Section 3: Important Questions */}
                    <div className="revision-card revision-card--questions">
                        <div className="revision-card-header">
                            <div className="revision-card-icon revision-icon--questions">❓</div>
                            <div>
                                <h2>Important Exam Questions</h2>
                                <p>Likely questions to practise</p>
                            </div>
                        </div>
                        <ol className="revision-numbered-list">
                            {revision.importantQuestions?.length > 0
                                ? revision.importantQuestions.map((q, i) => (
                                    <li key={i} className="revision-numbered-item">
                                        <span className="revision-question-num">{i + 1}</span>
                                        <span>{q}</span>
                                    </li>
                                ))
                                : <li className="revision-list-empty">No questions available.</li>
                            }
                        </ol>
                    </div>

                    {/* Footer */}
                    <p className="revision-footer-note">
                        🤖 Revision notes generated by Gemini AI from your uploaded syllabus.
                        Keep your syllabus up-to-date for more accurate notes!
                    </p>

                </div>
            )}

            {/* ── Empty State (before any generation) ──────────────────────── */}
            {!revision && !loading && !error && (
                <div className="revision-empty-state">
                    <div className="revision-empty-icon">📝</div>
                    <h3>Ready to Revise?</h3>
                    <p>Select a subject above and click <strong>Generate Revision</strong> to get AI-powered exam notes from your syllabus.</p>
                </div>
            )}

        </div>
    );
}

export default RevisionPage;
