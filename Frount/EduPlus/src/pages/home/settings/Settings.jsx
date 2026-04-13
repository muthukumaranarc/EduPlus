import "./Settings.css";
import profile from '../../../assets/profile.png';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext }  from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import ConfirmAlert from "../../../components/ConfirmAlert";
import UpdateModal   from "../../../components/UpdateModal";
import AnimatedAvatar from "../../../components/AnimatedAvatar";

/* ─── Inline SVG icons ─── */
const Ico = {
    id:      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="14" height="13" rx="2.5"/><path d="M7 9h6M7 12.5h4"/></svg>,
    lock:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="9" width="10" height="8" rx="2"/><path d="M7 9V7a3 3 0 0 1 6 0v2"/></svg>,
    user:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>,
    cake:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="9" width="14" height="8" rx="2"/><path d="M7 9V7M10 9V6M13 9V7"/><path d="M3 13h14"/></svg>,
    gender:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10" cy="9" r="4"/><path d="M10 13v4M8 15h4"/></svg>,
    phone:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="6" y="2" width="8" height="16" rx="2"/><circle cx="10" cy="15" r=".8" fill="currentColor" stroke="none"/></svg>,
    mail:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="14" height="11" rx="2"/><path d="M3 5l7 6 7-6"/></svg>,
    link:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 12a4 4 0 0 0 5.66 0l2-2a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M12 8a4 4 0 0 0-5.66 0l-2 2a4 4 0 0 0 5.66 5.66l1-1"/></svg>,
    logout:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 15l3-3-3-3M16 12H8"/><path d="M8 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>,
    trash:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 6h12M8 6V4h4v2M7 10v6M13 10v6M5 6l1 10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-10"/></svg>,
    chevron: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 5l4 5-4 5"/></svg>,
    camera:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M17 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1.5l1-2h4l1 2H15a2 2 0 0 1 2 2v7z"/><circle cx="10" cy="11" r="2.5"/></svg>,
    refresh: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 10a6 6 0 1 0 1.2-3.6"/><path d="M4 4v3h3"/></svg>,
    brain:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 3a4 4 0 0 0-4 4c0 1.2.5 2.2 1.3 3A4 4 0 0 0 7 17h6a4 4 0 0 0 2.7-7A4 4 0 0 0 13 3H7z"/><path d="M10 3v14M7 8h6M7 12h6"/></svg>,
    plus:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4v12M4 10h12"/></svg>,
    edit:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 3l3 3-9 9H5v-3L14 3z"/></svg>,
    x:       <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15"/></svg>,
};

/* ─── Row component ─── */
function SettingRow({ icon, label, value, onClick, tag, disabled }) {
    return (
        <div
            className={`st-row${disabled ? " st-row--dim" : ""}`}
            onClick={disabled ? undefined : onClick}
            role={disabled ? undefined : "button"}
            tabIndex={disabled ? undefined : 0}
            onKeyDown={disabled ? undefined : e => e.key === "Enter" && onClick?.()}
        >
            <span className="st-row-ico">{icon}</span>
            <div className="st-row-body">
                <span className="st-row-lbl">{label}</span>
                <span className="st-row-val">{value || <em>Not set</em>}</span>
            </div>
            {tag && <span className="st-row-tag">{tag}</span>}
            {!disabled && <span className="st-row-chevron">{Ico.chevron}</span>}
        </div>
    );
}

/* ─── Section wrapper ─── */
function Section({ title, subtitle, accent, children }) {
    return (
        <section className="st-section" style={{ "--sec-accent": accent || "#2c5de5" }}>
            <div className="st-sec-head">
                <div className="st-sec-accent-bar" />
                <div>
                    <h3 className="st-sec-title">{title}</h3>
                    {subtitle && <p className="st-sec-sub">{subtitle}</p>}
                </div>
            </div>
            <div className="st-sec-body">{children}</div>
        </section>
    );
}

/* ─── AI Profile tag chip ─── */
function ProfileTag({ text, onDelete, onEdit }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(text);

    const commit = () => {
        if (val.trim() && val.trim() !== text) onEdit(text, val.trim());
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="st-tag-edit-wrap">
                <input
                    className="st-tag-edit-input"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
                    autoFocus
                />
                <button className="st-tag-edit-ok" onClick={commit}>✓</button>
                <button className="st-tag-edit-cancel" onClick={() => setEditing(false)}>✕</button>
            </div>
        );
    }

    return (
        <div className="st-profile-tag">
            <span className="st-tag-text">{text}</span>
            <button className="st-tag-btn st-tag-btn--edit"  onClick={() => setEditing(true)}  title="Edit">{Ico.edit}</button>
            <button className="st-tag-btn st-tag-btn--del"   onClick={() => onDelete(text)}    title="Remove">{Ico.x}</button>
        </div>
    );
}

/* ═══════════════════════════════════════════════ */
function Settings() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState }            = useOutletContext();
    const { user, setUser, loading } = useContext(UserContext);
    const { theme, toggleTheme }     = useContext(ThemeContext);
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState(null);
    const [showUpdate,  setShowUpdate]  = useState(false);
    const [updateType,  setUpdateType]  = useState(null);

    // AI Profile state
    const [aiProfile, setAiProfile]     = useState([]);
    const [aiLoading, setAiLoading]     = useState(true);
    const [newFact,   setNewFact]       = useState("");
    const [addingFact, setAddingFact]   = useState(false);

    useEffect(() => { setNavState("setting"); }, [setNavState]);

    // Fetch AI profile facts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const r = await axios.get(`${baseURL}/about/get`, { withCredentials: true });
                setAiProfile(r.data || []);
            } catch (e) { console.error(e); }
            finally { setAiLoading(false); }
        };
        fetchProfile();
    }, [baseURL]);

    const api = axios.create({
        baseURL: `${baseURL}/user`,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    /* ── API helpers ── */
    const updateUsername       = (p, v) => { alert("Changing your username will sign you out."); api.post("/update-username", { password: p, usernameToChange: v }); handleLogout(); };
    const updatePassword       = (p, v) => api.post("/update-password",      { currentPassword: p, newPassword: v });
    const updateFirstname      = (p, v) => api.post("/update-firstname",     { password: p, firstname: v });
    const updateLastname       = (p, v) => api.post("/update-lastname",      { password: p, lastname: v });
    const updateMobileNumber   = (p, v) => api.post("/update-mobile-number", { password: p, mobilenumber: v });
    const updateMailId         = (p, v) => api.post("/update-mail-id",       { password: p, mailid: v });
    const updateDOB            = (p, v) => api.post("/update-dob",           { password: p, dob: v });
    const updateGender         = (p, v) => api.post("/update-gender",        { password: p, gender: v });
    const updateLinkedIn       = (p, v) => api.post("/update-linkedin",      { password: p, linkedin: v });
    const updateProfilePicture = (p, v) => api.post("/update-profile-picture", { password: p, profilePicture: v });
    const logoutUser           = ()     => api.get("/logout");
    const deleteUser           = ()     => api.delete("/delete");

    const handleLogout = async () => { await logoutUser(); navigate("/account-login"); };
    const handleDelete = async () => { await deleteUser(); navigate("/account-login"); };

    const fetchUser = async () => {
        try { const r = await axios.get(`${baseURL}/user/get-user`, { withCredentials: true }); setUser(r.data); }
        catch (e) { if (e.response?.status === 401) setUser(null); }
    };

    const open  = cfg => { setUpdateType(cfg); setShowUpdate(true); };
    const close = ()  => setShowUpdate(false);

    /* ── AI Profile actions ── */
    const deleteFact = async (fact) => {
        try {
            await axios.delete(`${baseURL}/about/delete`, {
                withCredentials: true,
                data: fact,
                headers: { "Content-Type": "text/plain" },
            });
            setAiProfile(prev => prev.filter(f => f !== fact));
        } catch (e) { console.error(e); }
    };

    const editFact = async (oldFact, newFact) => {
        try {
            await axios.put(`${baseURL}/about/replace`, { old: oldFact, new: newFact }, { withCredentials: true });
            setAiProfile(prev => prev.map(f => f === oldFact ? newFact : f));
        } catch (e) { console.error(e); }
    };

    const addFact = async () => {
        const trimmed = newFact.trim();
        if (!trimmed || aiProfile.includes(trimmed)) return;
        setAddingFact(true);
        try {
            await axios.post(`${baseURL}/about/add`, trimmed, {
                withCredentials: true,
                headers: { "Content-Type": "text/plain" },
            });
            setAiProfile(prev => [...prev, trimmed]);
            setNewFact("");
        } catch (e) { console.error(e); }
        finally { setAddingFact(false); }
    };

    const isBasicAuth = user?.password && user.password.length > 0;

    if (loading || !user) {
        return (
            <div className="st-loading">
                <div className="st-loading-ring" />
                <p>Loading your settings…</p>
            </div>
        );
    }

    const initials    = ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || user.username?.[0]?.toUpperCase() || "U";
    const displayName = ((user.firstName || "") + " " + (user.lastName || "")).trim() || user.username;

    return (
        <div className="st-page">

            {/* ── Page heading ── */}
            <div className="st-page-head">
                <h1 className="st-page-title">Settings</h1>
                <p  className="st-page-sub">Manage your account and preferences</p>
            </div>

            {/* ── Profile card ── */}
            <div className="st-profile-card">
                <div className="st-profile-left">
                    <div className="st-avatar-shell">
                        <AnimatedAvatar 
                            src={user.profilePicture} 
                            gender={user.gender} 
                            name={user.username} 
                            size={100} 
                        />
                        {isBasicAuth && (
                            <button className="st-avatar-cam" title="Change photo"
                                onClick={() => open({
                                    title: "Update Profile Picture",
                                    firstInput:  { placeholder: "Current password", type: "password" },
                                    secondInput: { placeholder: "Choose image",     type: "file", accept: "image/*" },
                                    onUpdate: (pw, file) => {
                                        if (!file) return alert("Please select an image.");
                                        const r = new FileReader();
                                        r.onloadend = () => { updateProfilePicture(pw, r.result); close(); setTimeout(fetchUser, 500); };
                                        r.readAsDataURL(file);
                                    },
                                    onCancel: close,
                                    isFileUpload: true,
                                })}>
                                {Ico.camera}
                            </button>
                        )}
                    </div>
                    <div className="st-profile-meta">
                        <span className="st-profile-name">{displayName}</span>
                        <span className="st-profile-username">@{user.username}</span>
                        <span className={`st-account-badge ${isBasicAuth ? "st-account-badge--local" : "st-account-badge--google"}`}>
                            {isBasicAuth ? "Local account" : "Google account"}
                        </span>
                    </div>
                </div>
                <button className="st-refresh-btn" onClick={fetchUser} title="Refresh data">
                    {Ico.refresh}
                    <span>Refresh</span>
                </button>
            </div>

            {/* ── Account settings ── */}
            <Section title="Account" subtitle="Your personal information" accent="#2c5de5">
                <SettingRow icon={Ico.id} label="User ID" value={user.username}
                    onClick={() => isBasicAuth
                        ? open({ title:"Update Username", firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"New username",type:"text"}, onUpdate:(a,b)=>{updateUsername(a,b);close();}, onCancel:close })
                        : alert("User ID cannot be changed for Google accounts.")} />

                {isBasicAuth && (
                    <SettingRow icon={Ico.lock} label="Password" value="••••••••"
                        onClick={() => open({ title:"Update Password", firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"New password",type:"password"}, onUpdate:(a,b)=>{updatePassword(a,b);close();}, onCancel:close })} />
                )}

                <SettingRow icon={Ico.user}   label="First Name" value={user.firstName}
                    onClick={() => open({ title:"Update First Name", firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"New first name",type:"text"}, onUpdate:(a,b)=>{updateFirstname(a,b);close();}, onCancel:close })} />
                <SettingRow icon={Ico.user}   label="Last Name"  value={user.lastName}
                    onClick={() => open({ title:"Update Last Name",  firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"New last name", type:"text"}, onUpdate:(a,b)=>{updateLastname(a,b);close();},  onCancel:close })} />
                <SettingRow icon={Ico.cake}   label="Birthday"   value={user.dob}
                    onClick={() => open({ title:"Update Birthday",   firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"Date of birth",  type:"date"}, onUpdate:(a,b)=>{updateDOB(a,b);close();},        onCancel:close })} />
                <SettingRow icon={Ico.gender} label="Gender"     value={user.gender}
                    onClick={() => open({ title:"Update Gender",     firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"Gender",         type:"text"}, onUpdate:(a,b)=>{updateGender(a,b);close();},      onCancel:close, type:"select" })} />
                <SettingRow icon={Ico.phone}  label="Mobile"     value={user.mobileNumber}
                    onClick={() => open({ title:"Update Mobile",     firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"Mobile number",  type:"tel"},  onUpdate:(a,b)=>{updateMobileNumber(a,b);close();},onCancel:close })} />
                <SettingRow icon={Ico.mail}   label="Email"      value={user.mailId}
                    onClick={() => open({ title:"Update Email",      firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"Email address",  type:"email"},onUpdate:(a,b)=>{updateMailId(a,b);close();},      onCancel:close })} />
                <SettingRow icon={Ico.link}   label="LinkedIn"   value={user.linkedIn}
                    onClick={() => open({ title:"Update LinkedIn",   firstInput:{placeholder:"Current password",type:"password"}, secondInput:{placeholder:"Profile URL",    type:"text"}, onUpdate:(a,b)=>{updateLinkedIn(a,b);close();},     onCancel:close })} />
            </Section>

            {/* ── AI Profile section ── */}
            <Section title="AI Profile" subtitle="Facts the AI has learned about you from chat — used to personalize all AI features" accent="#7b3fe4">
                <div className="st-ai-profile-body">
                    {aiLoading ? (
                        <div className="st-ai-loading">
                            <div className="st-loading-ring" style={{ width: 22, height: 22, borderWidth: 2 }} />
                            <span>Loading profile…</span>
                        </div>
                    ) : aiProfile.length === 0 ? (
                        <div className="st-ai-empty">
                            <span className="st-ai-empty-icon">🧠</span>
                            <p>No personality data yet. Start chatting with the AI and it will automatically learn about you!</p>
                        </div>
                    ) : (
                        <div className="st-tag-cloud">
                            {aiProfile.map((fact, i) => (
                                <ProfileTag
                                    key={i}
                                    text={fact}
                                    onDelete={deleteFact}
                                    onEdit={editFact}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add custom fact */}
                    <div className="st-ai-add-row">
                        <input
                            className="st-ai-add-input"
                            placeholder='Add a fact, e.g. "Interest: Machine Learning"'
                            value={newFact}
                            onChange={e => setNewFact(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && addFact()}
                        />
                        <button className="st-ai-add-btn" onClick={addFact} disabled={addingFact || !newFact.trim()}>
                            {Ico.plus}
                        </button>
                    </div>
                </div>
            </Section>

            {/* ── Danger zone ── */}
            <section className="st-danger-section">
                <div className="st-danger-head">
                    <h3 className="st-danger-title">Danger Zone</h3>
                    <p  className="st-danger-sub">Irreversible actions — proceed with caution</p>
                </div>
                <div className="st-danger-body">
                    <div className="st-danger-item">
                        <div>
                            <p className="st-danger-item-label">Log out</p>
                            <p className="st-danger-item-sub">End your current session on this device</p>
                        </div>
                        <button className="st-danger-btn st-danger-btn--neutral"
                            onClick={() => { setConfirmType("login"); setShowConfirm(true); }}>
                            {Ico.logout} Log Out
                        </button>
                    </div>
                    <div className="st-danger-item">
                        <div>
                            <p className="st-danger-item-label">Delete account</p>
                            <p className="st-danger-item-sub">Permanently remove your account and all data</p>
                        </div>
                        <button className="st-danger-btn st-danger-btn--red"
                            onClick={() => { setConfirmType("delete"); setShowConfirm(true); }}>
                            {Ico.trash} Delete Account
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Modals ── */}
            {showConfirm && (
                <ConfirmAlert
                    message={confirmType === "delete" ? "Permanently delete your account and all data?" : "Log out of your account?"}
                    onConfirm={() => { setShowConfirm(false); confirmType === "delete" ? handleDelete() : handleLogout(); }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
            {showUpdate && updateType && <UpdateModal {...updateType} />}
        </div>
    );
}

export default Settings;
