import "./Dashboard.css";
import girl    from "../../../assets/girl.png";
import edit    from "../../../assets/edit.png";
import x       from "../../../assets/x.png";

import { useOutletContext, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo }   from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

/* ── Feature cards in the "All Features" grid ── */
const FEATURES = [
    { id:"plan",      icon:"📋", title:"Study Plan",         desc:"Upload notes & instantly get an AI‑generated personalised study plan with built-in tests.",            path:"/home/plan",      accent:"#3b82f6", bg:"#eff6ff", border:"#bfdbfe" },
    { id:"test",      icon:"🧪", title:"Smart Test Builder", desc:"Create, edit, and manage AI‑crafted tests. Generate questions from your study material.",              path:"/home/test",      accent:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe" },
    { id:"ai",        icon:"💬", title:"AI Chat",            desc:"Your always-available AI study assistant. Ask questions, clear doubts and stay on track.",             path:"/home/ai",        accent:"#10b981", bg:"#ecfdf5", border:"#a7f3d0" },
    { id:"analytics", icon:"📈", title:"AI Analytics",       desc:"Receive AI‑powered insights on your strengths, weak areas, and personalised recommendations.",         path:"/home/analytics", accent:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
    { id:"revision",  icon:"📝", title:"AI Revision",        desc:"Auto‑generate exam‑ready revision notes, key points and important questions from your syllabus.",      path:"/home/revision",  accent:"#ec4899", bg:"#fdf2f8", border:"#fbcfe8" },
    { id:"syllabus",  icon:"📚", title:"Syllabus",           desc:"Upload and organise your syllabus by subject, unit and topic to power all AI features.",               path:"/home/syllabus",  accent:"#06b6d4", bg:"#ecfeff", border:"#a5f3fc" },
    { id:"trophies",  icon:"🏆", title:"Trophies",           desc:"Earn weekly trophies for completing tests, maintaining streaks and reaching milestones.",              path:"/home/trophies",  accent:"#f97316", bg:"#fff7ed", border:"#fed7aa" },
    { id:"friend",    icon:"👥", title:"Friends",            desc:"Add friends, compare trophy counts and climb the leaderboard to stay motivated together.",             path:"/home/friend",    accent:"#6366f1", bg:"#eef2ff", border:"#c7d2fe" },
];

/* ── Quick actions (right panel) ── */
const QUICK_ACTIONS = [
    { label:"Generate Test",        sub:"AI builds a test from your notes",    path:"/home/test/generate", icon:"🧪", color:"#8b5cf6" },
    { label:"Ask AI",               sub:"Instant study help from your AI",     path:"/home/ai",            icon:"💬", color:"#10b981" },
    { label:"Revision Notes",       sub:"Exam‑ready notes in seconds",          path:"/home/revision",      icon:"📝", color:"#ec4899" },
    { label:"Practice Saved Tests", sub:"Complete any pending tests",           path:"/home/test/saved",    icon:"✅", color:"#3b82f6" },
    { label:"View Analytics",       sub:"Check your AI performance report",     path:"/home/analytics",     icon:"📈", color:"#f59e0b" },
    { label:"Upload Syllabus",      sub:"Add content to power the AI tools",    path:"/home/syllabus",      icon:"📚", color:"#06b6d4" },
];

/* ── Study tips carousel ── */
const TIPS = [
    { icon:"🧠", title:"Spaced Repetition", tip:"Review topics at increasing intervals — day 1, 3, 7, 14. This is proven to improve long‑term retention by over 50%." },
    { icon:"⏱️", title:"Pomodoro Technique", tip:"Study in focused 25‑minute blocks followed by a 5‑minute break. After 4 blocks, take a 20‑minute break." },
    { icon:"📖", title:"Active Recall", tip:"Instead of re‑reading, close your notes and try to recall the key points. Testing yourself is far more effective than passive reading." },
    { icon:"✍️", title:"Feynman Technique", tip:"Explain a concept as if teaching a 10‑year‑old. Gaps in your explanation reveal exactly what you still need to study." },
    { icon:"🎯", title:"Interleaving", tip:"Mix different subjects or topics in a single session instead of blocking one topic. Interleaving boosts problem‑solving skills." },
    { icon:"💤", title:"Sleep for Memory", tip:"Sleep consolidates memories. Studying before sleep and reviewing after waking is one of the best retention strategies." },
];

/* ================================================================
   MAIN COMPONENT
================================================================ */
function Dashboard() {
    const { setNavState } = useOutletContext();
    const { user }        = useContext(UserContext);
    const navigate        = useNavigate();
    const baseURL         = import.meta.env.VITE_API_URL;

    const [tasks,      setTasks]      = useState([]);
    const [isEditing,  setIsEditing]  = useState(false);
    const [newTask,    setNewTask]    = useState("");
    const [stats,      setStats]      = useState({ earned:0, total:0, streak:0, tests:0 });
    const [greeting,   setGreeting]   = useState("Hello");

    useEffect(() => {
        setNavState("dashboard");
        const h = new Date().getHours();
        setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    }, [setNavState]);

    /* tasks */
    useEffect(() => { fetchTrack(); }, []);
    const fetchTrack = async () => {
        try {
            const res = await axios.get(`${baseURL}/pro/ensure-defaults`, { withCredentials: true });
            setTasks(res.data.tasks.map((t, i) => ({ id: i+1, title: t.name, completed: t.completed })));
        } catch { /* ignore */ }
    };

    /* trophies + stats */
    useEffect(() => {
        const go = async () => {
            try {
                const res = await axios.get(`${baseURL}/trophy/get-user-trophies`, { withCredentials: true });
                const earned  = res.data.trophies?.filter(t => t.earned).length ?? 0;
                const total   = res.data.trophies?.length ?? 0;
                const streak  = res.data.currentStreak ?? 0;
                const tests   = res.data.testsCompleted ?? 0;
                setStats({ earned, total, streak, tests });
            } catch { /* ignore */ }
        };
        go();
    }, []);

    const progress = useMemo(() => {
        if (!tasks.length) return 0;
        return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
    }, [tasks]);

    const completedCount = tasks.filter(t => t.completed).length;

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        try {
            await axios.post(`${baseURL}/pro/toggle`, task.title,
                { headers:{ "Content-Type":"text/plain" }, withCredentials:true });
        } catch { setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); }
    };

    const addTask = async () => {
        const name = newTask.trim(); if (!name) return;
        try {
            const res = await axios.post(`${baseURL}/pro/add`, name,
                { headers:{ "Content-Type":"text/plain" }, withCredentials:true });
            setTasks(res.data.tasks.map((t, i) => ({ id: i+1, title: t.name, completed: t.completed })));
            setNewTask(""); setIsEditing(false);
        } catch { /* ignore */ }
    };

    const removeTask = async (taskName) => {
        try {
            const res = await axios.delete(`${baseURL}/pro/remove`,
                { data: taskName, headers:{ "Content-Type":"text/plain" }, withCredentials:true });
            setTasks(res.data.tasks.map((t, i) => ({ id: i+1, title: t.name, completed: t.completed })));
            setIsEditing(false);
        } catch { /* ignore */ }
    };

    const displayName = user
        ? ((user.firstName||"") + " " + (user.lastName||"")).trim() || user.username || "there"
        : "there";

    return (
        <div className="db-page">

            {/* ═══ HERO ═══════════════════════════════════════════════ */}
            <div className="db-hero">
                <div className="db-hero-text">
                    <span className="db-greeting">{greeting},</span>
                    <h1 className="db-username">{displayName}! 👋</h1>
                    <p className="db-moto">Your hard work today is the foundation of the success you'll own tomorrow. 🚀</p>
                    <div className="db-hero-pills">
                        <span className="db-pill db-pill--fire">🔥 {stats.streak} day streak</span>
                        <span className="db-pill db-pill--gold">🏆 {stats.earned}/{stats.total}</span>
                        <span className="db-pill db-pill--green">📝 {stats.tests} tests</span>
                        <span className="db-pill db-pill--blue">✅ {completedCount}/{tasks.length} tasks</span>
                    </div>
                </div>
                <img src={girl} alt="studying" className="db-hero-img" />
            </div>

            {/* ═══ STAT STRIP ══════════════════════════════════════════ */}
            <div className="db-stat-strip">
                {[
                    { label:"Day Streak",     value: stats.streak,    icon:"🔥", accent:"#f97316", bg:"#fff7ed", border:"#fed7aa" },
                    { label:"Trophies Earned",value:`${stats.earned}/${stats.total}`, icon:"🏆", accent:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
                    { label:"Tests Completed",value: stats.tests,     icon:"📝", accent:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe" },
                    { label:"Tasks Done Today",value:`${completedCount}/${tasks.length}`, icon:"✅", accent:"#10b981", bg:"#ecfdf5", border:"#a7f3d0" },
                ].map((s, i) => (
                    <div key={i} className="db-stat-card" style={{"--sc-accent":s.accent,"--sc-bg":s.bg,"--sc-border":s.border}}>
                        <span className="db-stat-icon">{s.icon}</span>
                        <div className="db-stat-info">
                            <span className="db-stat-value">{s.value}</span>
                            <span className="db-stat-label">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ═══ TASKS + QUICK ACTIONS ═══════════════════════════════ */}
            <div className="db-row">

                {/* Today's Tasks */}
                <div className="db-card db-tasks-card">
                    <div className="db-card-header">
                        <div>
                            <h2 className="db-card-title">📋 Today's Tasks</h2>
                            <p className="db-card-sub">{completedCount} of {tasks.length} completed</p>
                        </div>
                        <button className="db-icon-btn" onClick={() => setIsEditing(v => !v)} title={isEditing?"Close":"Edit tasks"}>
                            <img src={isEditing ? x : edit} alt={isEditing?"close":"edit"} />
                        </button>
                    </div>

                    <div className="db-progress-rail">
                        <div className="db-progress-fill" style={{ width:`${progress}%` }} />
                    </div>
                    <p className="db-progress-label">{progress}% complete</p>

                    <div className="db-task-list">
                        {tasks.length === 0 && (
                            <div className="db-empty-tasks">
                                <span className="db-empty-icon">🚀</span>
                                <p>All tasks cleared! Click edit to add new ones.</p>
                            </div>
                        )}
                        {tasks.map(task => (
                            <div key={task.id} className={`db-task-row ${task.completed ? "db-task-done":""}`}>
                                {isEditing ? (
                                    <button className="db-remove-btn" onClick={() => removeTask(task.title)}>✕</button>
                                ) : (
                                    <button className={`db-check ${task.completed?"db-check--done":""}`}
                                            onClick={() => toggleTask(task.id)}>
                                        {task.completed ? "✓" : ""}
                                    </button>
                                )}
                                <span className="db-task-title">{task.title}</span>
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <form className="db-add-task" onSubmit={e => { e.preventDefault(); addTask(); }}>
                            <input className="db-task-input" type="text" placeholder="Add a new task…"
                                   value={newTask} onChange={e => setNewTask(e.target.value)} autoFocus />
                            <button type="submit" className="db-task-add-btn">Add</button>
                        </form>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="db-card db-quick-card">
                    <div className="db-card-header">
                        <div>
                            <h2 className="db-card-title">⚡ Quick Actions</h2>
                            <p className="db-card-sub">Jump into what matters right now</p>
                        </div>
                    </div>
                    <div className="db-quick-list">
                        {QUICK_ACTIONS.map((qa, i) => (
                            <div key={i} className="db-quick-row" onClick={() => navigate(qa.path)}
                                 style={{"--qa-color": qa.color}}>
                                <span className="db-quick-icon" style={{ background:`${qa.color}18`, color:qa.color }}>
                                    {qa.icon}
                                </span>
                                <div className="db-quick-info">
                                    <p className="db-quick-label">{qa.label}</p>
                                    <p className="db-quick-sub">{qa.sub}</p>
                                </div>
                                <span className="db-quick-arrow">›</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* ═══ ALL FEATURES GRID ═══════════════════════════════════ */}
            <div className="db-section-header">
                <h2 className="db-section-title">🧩 All Features</h2>
                <p className="db-section-sub">Everything EduPlus has to offer — click any card to get started</p>
            </div>

            <div className="db-features-grid">
                {FEATURES.map(f => (
                    <div key={f.id} className="db-feature-card" onClick={() => navigate(f.path)}
                         style={{"--f-accent":f.accent,"--f-bg":f.bg,"--f-border":f.border}}>
                        <div className="db-feature-icon-wrap">
                            <span className="db-feature-icon">{f.icon}</span>
                        </div>
                        <div className="db-feature-body">
                            <h3 className="db-feature-title">{f.title}</h3>
                            <p className="db-feature-desc">{f.desc}</p>
                            <span className="db-feature-cta" style={{ color:f.accent }}>Open →</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ═══ STUDY TIPS ══════════════════════════════════════════ */}
            <div className="db-section-header">
                <h2 className="db-section-title">💡 Study Tips</h2>
                <p className="db-section-sub">Evidence‑based techniques to study smarter, not harder</p>
            </div>

            <div className="db-tips-grid">
                {TIPS.map((t, i) => (
                    <div key={i} className="db-tip-card">
                        <span className="db-tip-icon">{t.icon}</span>
                        <div>
                            <h4 className="db-tip-title">{t.title}</h4>
                            <p className="db-tip-body">{t.tip}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ═══ FOOTER NOTE ═════════════════════════════════════════ */}
            <div className="db-footer">
                <span>🤖 EduPlus AI is powered by Google Gemini · Your data stays private</span>
            </div>

        </div>
    );
}

export default Dashboard;
