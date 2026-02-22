import "./SyllabusList.css";
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getAllSyllabus, getSubjects, deleteSyllabus } from "../../../services/syllabusApi";

function SyllabusList() {
    const { setNavState } = useOutletContext();
    const navigate = useNavigate();

    const [syllabus, setSyllabus] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [expandedTopics, setExpandedTopics] = useState({});

    useEffect(() => {
        setNavState("syllabus");
    }, [setNavState]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allData, subjectList] = await Promise.all([
                getAllSyllabus(),
                getSubjects(),
            ]);
            setSyllabus(allData);
            setSubjects(subjectList);
        } catch (err) {
            console.error("Failed to fetch syllabus:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteSyllabus(id);
            setSyllabus((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const toggleTopic = (id) => {
        setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter by selected subject
    const filtered =
        selectedSubject === "all"
            ? syllabus
            : syllabus.filter((s) => s.subject === selectedSubject);

    // Group: subject → unit → [entries]
    const grouped = filtered.reduce((acc, entry) => {
        if (!acc[entry.subject]) acc[entry.subject] = {};
        if (!acc[entry.subject][entry.unit]) acc[entry.subject][entry.unit] = [];
        acc[entry.subject][entry.unit].push(entry);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="sl-page">
                <div className="sl-loading">
                    <div className="sl-spinner">📚</div>
                    <p>Loading syllabus…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="sl-page">
            <h3 className="sl-page-label">Syllabus</h3>

            {/* ── Page Header ── */}
            <div className="sl-header">
                <div>
                    <h2 className="sl-title">📚 My Syllabus</h2>
                    <p className="sl-subtitle">
                        {syllabus.length} topic{syllabus.length !== 1 ? "s" : ""} across {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    className="sl-upload-btn"
                    onClick={() => navigate("/home/syllabus/upload")}
                >
                    + Upload Syllabus
                </button>
            </div>

            {/* ── Subject Filter Dropdown ── */}
            <div className="sl-filter-bar">
                <label className="sl-filter-label" htmlFor="subject-select">Filter by Subject</label>
                <select
                    id="subject-select"
                    className="sl-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="all">All Subjects</option>
                    {subjects.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>

            {/* ── Empty State ── */}
            {Object.keys(grouped).length === 0 && (
                <div className="sl-empty">
                    <div className="sl-empty-icon">📖</div>
                    <h4>No syllabus yet</h4>
                    <p>Upload your first topic to start building your learning library.</p>
                    <button
                        className="sl-btn-primary"
                        onClick={() => navigate("/home/syllabus/upload")}
                    >
                        Upload Syllabus
                    </button>
                </div>
            )}

            {/* ── Grouped Content ── */}
            {Object.entries(grouped).map(([subject, units]) => (
                <div key={subject} className="sl-subject-block">
                    <div className="sl-subject-header">
                        <span className="sl-subject-icon">📘</span>
                        <h3 className="sl-subject-name">{subject}</h3>
                        <span className="sl-subject-count">
                            {Object.values(units).flat().length} topic{Object.values(units).flat().length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {Object.entries(units).map(([unit, entries]) => (
                        <div key={unit} className="sl-unit-block">
                            <div className="sl-unit-header">
                                <span className="sl-unit-icon">📂</span>
                                <h4 className="sl-unit-name">{unit}</h4>
                            </div>

                            <div className="sl-topics">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="sl-topic-card">
                                        <div
                                            className="sl-topic-header"
                                            onClick={() => toggleTopic(entry.id)}
                                        >
                                            <div className="sl-topic-left">
                                                <span className="sl-topic-arrow">
                                                    {expandedTopics[entry.id] ? "▾" : "▸"}
                                                </span>
                                                <span className="sl-topic-name">{entry.topic}</span>
                                            </div>
                                            <button
                                                className="sl-delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(entry.id);
                                                }}
                                                disabled={deletingId === entry.id}
                                                title="Delete this topic"
                                            >
                                                {deletingId === entry.id ? "…" : "✕"}
                                            </button>
                                        </div>

                                        {expandedTopics[entry.id] && (
                                            <div className="sl-topic-content">
                                                <p>{entry.content}</p>
                                                <span className="sl-topic-date">
                                                    Added {new Date(entry.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default SyllabusList;
