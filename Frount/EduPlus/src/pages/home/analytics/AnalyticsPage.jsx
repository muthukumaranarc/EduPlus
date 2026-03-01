import "./AnalyticsPage.css";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

function AnalyticsPage() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setNavState("analytics");
    }, [setNavState]);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(
                `${baseURL}/ai/analyze-progress`,
                {},
                { withCredentials: true }
            );
            setAnalysis(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                window.location.href = `${baseURL}/oauth2/authorization/google`;
            } else {
                setError("Failed to load analysis. Please try again.");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Loading State ─────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-loading">
                    <div className="analytics-spinner">🧠</div>
                    <h3>Analyzing your performance...</h3>
                    <p>EduPlus AI is reviewing your test history and identifying patterns.</p>
                </div>
            </div>
        );
    }

    // ── Error State ────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="analytics-page">
                <div className="analytics-error">
                    <div className="analytics-error-icon">⚠️</div>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                    <button className="analytics-retry-btn" onClick={fetchAnalysis}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="analytics-header">
                <div className="analytics-header-left">
                    <div className="analytics-header-icon">🧠</div>
                    <div>
                        <h1 className="analytics-title">AI Performance Analytics</h1>
                        <p className="analytics-subtitle">
                            Personalized insights powered by EduPlus AI — based on your test history
                        </p>
                    </div>
                </div>
                <button
                    className="analytics-refresh-btn"
                    onClick={fetchAnalysis}
                    title="Refresh analysis"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ── Stats Strip ─────────────────────────────────────────────── */}
            <div className="analytics-stats-strip">
                <div className="analytics-strip-card">
                    <span className="strip-icon">⚠️</span>
                    <div>
                        <strong>{analysis?.weakTopics?.length ?? 0}</strong>
                        <p>Weak Areas</p>
                    </div>
                </div>
                <div className="analytics-strip-card">
                    <span className="strip-icon">✅</span>
                    <div>
                        <strong>{analysis?.strongTopics?.length ?? 0}</strong>
                        <p>Strong Areas</p>
                    </div>
                </div>
                <div className="analytics-strip-card">
                    <span className="strip-icon">💡</span>
                    <div>
                        <strong>{analysis?.recommendations?.length ?? 0}</strong>
                        <p>Recommendations</p>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ───────────────────────────────────────────────── */}
            <div className="analytics-grid">

                {/* Weak Topics */}
                <div className="analytics-card analytics-card--weak">
                    <div className="analytics-card-header">
                        <div className="analytics-card-icon analytics-card-icon--weak">⚠️</div>
                        <div>
                            <h2>Weak Topics</h2>
                            <p>Areas that need more practice</p>
                        </div>
                    </div>
                    <ul className="analytics-list analytics-list--weak">
                        {analysis?.weakTopics?.length > 0
                            ? analysis.weakTopics.map((topic, i) => (
                                <li key={i} className="analytics-list-item">
                                    <span className="analytics-list-bullet analytics-list-bullet--weak">●</span>
                                    <span>{topic}</span>
                                </li>
                            ))
                            : <li className="analytics-list-empty">No weak topics detected 🎉</li>
                        }
                    </ul>
                </div>

                {/* Strong Topics */}
                <div className="analytics-card analytics-card--strong">
                    <div className="analytics-card-header">
                        <div className="analytics-card-icon analytics-card-icon--strong">✅</div>
                        <div>
                            <h2>Strong Topics</h2>
                            <p>Areas where you excel</p>
                        </div>
                    </div>
                    <ul className="analytics-list analytics-list--strong">
                        {analysis?.strongTopics?.length > 0
                            ? analysis.strongTopics.map((topic, i) => (
                                <li key={i} className="analytics-list-item">
                                    <span className="analytics-list-bullet analytics-list-bullet--strong">●</span>
                                    <span>{topic}</span>
                                </li>
                            ))
                            : <li className="analytics-list-empty">Complete more tests to see strong areas</li>
                        }
                    </ul>
                </div>

            </div>

            {/* ── Recommendations ─────────────────────────────────────────── */}
            <div className="analytics-card analytics-card--recs">
                <div className="analytics-card-header">
                    <div className="analytics-card-icon analytics-card-icon--recs">💡</div>
                    <div>
                        <h2>AI Recommendations</h2>
                        <p>Personalised action plan from EduPlus AI</p>
                    </div>
                </div>
                <div className="analytics-recs-grid">
                    {analysis?.recommendations?.length > 0
                        ? analysis.recommendations.map((rec, i) => (
                            <div key={i} className="analytics-rec-item">
                                <span className="analytics-rec-number">{i + 1}</span>
                                <p>{rec}</p>
                            </div>
                        ))
                        : <p className="analytics-list-empty">No recommendations yet — take more tests!</p>
                    }
                </div>
            </div>

            {/* ── Footer note ─────────────────────────────────────────────── */}
            <p className="analytics-footer-note">
                🤖 Analysis generated by Gemini AI based on your current test inventory.
                Take more tests to get more accurate insights!
            </p>

        </div>
    );
}

export default AnalyticsPage;
