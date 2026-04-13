import "./GenerateTest.css";
import { useOutletContext } from "react-router-dom";
import send    from "../../../../assets/send.png";
import arrow   from "../../../../assets/arrow.png";
import Duck_walking from "../../../../assets/Duck_walking.gif";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QUESTION_TYPES = [
    {
        key: "mcqCount",
        label: "MCQ",
        icon: "🔘",
        desc: "Multiple choice — 4 options, 1 correct answer",
        color: "#6366f1",
        bg: "#eef2ff",
        border: "#c7d2fe",
        defaultVal: 5,
    },
    {
        key: "twoMarkCount",
        label: "2 Marks",
        icon: "✏️",
        desc: "Short-answer — concise written response",
        color: "#0891b2",
        bg: "#ecfeff",
        border: "#a5f3fc",
        defaultVal: 3,
    },
    {
        key: "tenMarkCount",
        label: "10 Marks",
        icon: "📝",
        desc: "Long-answer — detailed essay / key points",
        color: "#7c3aed",
        bg: "#f5f3ff",
        border: "#ddd6fe",
        defaultVal: 2,
    },
];

function GenerateTest() {
    const baseURL   = import.meta.env.VITE_API_URL;
    const navigate  = useNavigate();
    let { deviceWidth } = useOutletContext();

    const [query,        setQuery]        = useState("");
    const [groups,       setGroups]       = useState([]);
    const [groupName,    setGroupName]    = useState("");
    const [newGroupName, setNewGroupName] = useState("");
    const [testTitle,    setTestTitle]    = useState("");
    const [loading,      setLoading]      = useState(false);

    /* Question counts per type */
    const [counts, setCounts] = useState({
        mcqCount:     5,
        twoMarkCount: 3,
        tenMarkCount: 2,
    });

    const fileInputRef = useRef();

    useEffect(() => { fetchGroups(); }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${baseURL}/test/get-all-group`, { withCredentials: true });
            setGroups(res.data.testGroup || []);
        } catch (err) { console.error("Failed to load groups", err); }
    };

    const setCount = (key, val) => {
        const n = Math.max(0, Math.min(20, Number(val)));
        setCounts(prev => ({ ...prev, [key]: n }));
    };

    const totalQuestions = counts.mcqCount + counts.twoMarkCount + counts.tenMarkCount;

    const isBaseValid = () =>
        (groupName || newGroupName.trim()) && testTitle.trim() && totalQuestions > 0;

    const isTextValid = () => isBaseValid() && query.trim();

    /* ── GROUP CREATION ── */
    const createGroupIfNeeded = async () => {
        if (!newGroupName.trim()) return groupName;
        await axios.post(`${baseURL}/test/create-group`, newGroupName, {
            headers: { "Content-Type": "text/plain" },
            withCredentials: true,
        });
        return newGroupName;
    };

    /* ── GENERATE FROM TEXT ── */
    const generateTest = async () => {
        if (!isTextValid()) { alert("Please fill all required fields and enter some text."); return; }
        setLoading(true);
        try {
            const finalGroup = await createGroupIfNeeded();
            await axios.post(
                `${baseURL}/test/generate-mixed`,
                { groupName: finalGroup, testTitle, text: query, ...counts },
                { withCredentials: true }
            );
            navigate("/home/test/saved");
        } catch (err) {
            console.error("Failed to generate test", err);
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to generate test. Please try again.";
            alert(msg);
            setLoading(false);
        }
    };

    /* ── GENERATE FROM FILE ── */
    const openFilePicker = () => { if (!isBaseValid()) return; fileInputRef.current.click(); };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setQuery("");
        setLoading(true);
        try {
            const finalGroup = await createGroupIfNeeded();
            const formData   = new FormData();
            formData.append("groupName",    finalGroup);
            formData.append("testTitle",    testTitle);
            formData.append("sourceText",   file);
            formData.append("mcqCount",     counts.mcqCount);
            formData.append("twoMarkCount", counts.twoMarkCount);
            formData.append("tenMarkCount", counts.tenMarkCount);
            await axios.post(`${baseURL}/test/generate-mixed-from-file`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            navigate("/home/test/saved");
        } catch (err) {
            console.error("Failed to generate test from file", err);
            const msg = err?.response?.data?.message || err?.response?.data || "Failed to generate test from file. Please try again.";
            alert(msg);
            setLoading(false);
        }
    };

    /* ── LOADING SCREEN ── */
    if (loading) {
        return (
            <>
                {deviceWidth > 768 && (
                    <div className="ac-head" onClick={() => window.history.back()}>
                        <img src={arrow} alt="arrow" /> <p>Actions</p>
                    </div>
                )}
                <div className="plan">
                    <img className="duck-walking" src={Duck_walking} alt="loading" />
                    <p className="loading-text">AI is crafting your question paper… please wait</p>
                </div>
            </>
        );
    }

    return (
        <>
            {deviceWidth > 768 && (
                <div className="ac-head" onClick={() => window.history.back()}>
                    <img src={arrow} alt="arrow" /> <p>Actions</p>
                </div>
            )}

            <div className="gt-page">

                {/* ── HEADER ── */}
                <div className="gt-header">
                    <h1 className="gt-title">🧪 Generate Test</h1>
                    <p className="gt-subtitle">
                        Paste your notes or upload a file — EduPlus AI will build a mixed question paper instantly.
                    </p>
                </div>

                {/* ── STEP 1: GROUP + TITLE ── */}
                <section className="gt-card">
                    <div className="gt-card-label"><span>1</span> Test Details</div>
                    <div className="gt-row gt-row--2col">
                        <div className="gt-field">
                            <label>Group</label>
                            <div className="gt-group-row">
                                <select
                                    value={groupName}
                                    onChange={e => { setGroupName(e.target.value); setNewGroupName(""); }}
                                    className="gt-select"
                                >
                                    <option value="">Select existing group</option>
                                    {groups.map(g => (
                                        <option key={g.name} value={g.name}>{g.name}</option>
                                    ))}
                                </select>
                                <span className="gt-or">or</span>
                                <input
                                    className="gt-input"
                                    type="text"
                                    placeholder="Create new group"
                                    value={newGroupName}
                                    maxLength={20}
                                    onChange={e => { setNewGroupName(e.target.value); setGroupName(""); }}
                                />
                            </div>
                        </div>
                        <div className="gt-field">
                            <label>Test Title</label>
                            <input
                                className="gt-input"
                                type="text"
                                placeholder="e.g. Chapter 3 — Thermodynamics"
                                value={testTitle}
                                maxLength={40}
                                onChange={e => setTestTitle(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* ── STEP 2: QUESTION TYPE COUNTS ── */}
                <section className="gt-card">
                    <div className="gt-card-label"><span>2</span> Question Types & Counts</div>
                    <div className="gt-type-grid">
                        {QUESTION_TYPES.map(t => (
                            <div
                                key={t.key}
                                className="gt-type-card"
                                style={{ "--tc": t.color, "--tb": t.bg, "--tbd": t.border }}
                            >
                                <div className="gt-type-top">
                                    <span className="gt-type-icon">{t.icon}</span>
                                    <span className="gt-type-label">{t.label}</span>
                                </div>
                                <p className="gt-type-desc">{t.desc}</p>
                                <div className="gt-counter">
                                    <button onClick={() => setCount(t.key, counts[t.key] - 1)}>−</button>
                                    <input
                                        type="number"
                                        min="0" max="20"
                                        value={counts[t.key]}
                                        onChange={e => setCount(t.key, e.target.value)}
                                    />
                                    <button onClick={() => setCount(t.key, counts[t.key] + 1)}>＋</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="gt-total-badge">
                        Total: <strong>{totalQuestions}</strong> question{totalQuestions !== 1 ? "s" : ""}
                    </div>
                </section>

                {/* ── STEP 3: TEXT INPUT ── */}
                <section className="gt-card">
                    <div className="gt-card-label"><span>3</span> Source Material</div>
                    <div className="gt-text-box">
                        <textarea
                            className="gt-textarea"
                            placeholder="Paste your notes, textbook content or any study material here…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            rows={6}
                            spellCheck={false}
                        />
                        <div className="gt-text-actions">
                            <button
                                className="gt-btn gt-btn--secondary"
                                onClick={openFilePicker}
                                disabled={!isBaseValid()}
                            >
                                📂 Upload File
                            </button>
                            <button
                                className="gt-btn gt-btn--primary"
                                onClick={generateTest}
                                disabled={loading || !isTextValid()}
                            >
                                <img src={send} alt="send" />
                                Generate Test
                            </button>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <p className="gt-hint">
                        Supports PDF, DOCX, TXT, images and more · Max file size 50 MB
                    </p>
                </section>

            </div>
        </>
    );
}

export default GenerateTest;
