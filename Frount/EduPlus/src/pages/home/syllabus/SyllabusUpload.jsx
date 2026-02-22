import "./SyllabusUpload.css";
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { uploadSyllabus } from "../../../services/syllabusApi";

function SyllabusUpload() {
    const { setNavState } = useOutletContext();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        subject: "",
        unit: "",
        topic: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setNavState("syllabus");
    }, [setNavState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setSuccess(false);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.subject.trim() || !form.unit.trim() || !form.topic.trim() || !form.content.trim()) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await uploadSyllabus(form);
            setSuccess(true);
            setForm({ subject: "", unit: "", topic: "", content: "" });
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Failed to upload syllabus. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="su-page">
            <h3 className="su-page-label">Syllabus</h3>

            <div className="su-header">
                <div className="su-header-left">
                    <button className="su-back-btn" onClick={() => navigate("/home/syllabus")}>
                        ← Back
                    </button>
                    <div>
                        <h2 className="su-title">📖 Upload Syllabus</h2>
                        <p className="su-subtitle">Add a new topic to your personal syllabus library</p>
                    </div>
                </div>
            </div>

            <div className="su-card">
                <form className="su-form" onSubmit={handleSubmit}>

                    <div className="su-row">
                        <div className="su-field">
                            <label className="su-label" htmlFor="subject">Subject</label>
                            <input
                                id="subject"
                                className="su-input"
                                type="text"
                                name="subject"
                                placeholder="e.g. Mathematics"
                                value={form.subject}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>

                        <div className="su-field">
                            <label className="su-label" htmlFor="unit">Unit</label>
                            <input
                                id="unit"
                                className="su-input"
                                type="text"
                                name="unit"
                                placeholder="e.g. Unit 1 - Algebra"
                                value={form.unit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="su-field">
                        <label className="su-label" htmlFor="topic">Topic</label>
                        <input
                            id="topic"
                            className="su-input"
                            type="text"
                            name="topic"
                            placeholder="e.g. Quadratic Equations"
                            value={form.topic}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="su-field">
                        <label className="su-label" htmlFor="content">Content / Notes</label>
                        <textarea
                            id="content"
                            className="su-textarea"
                            name="content"
                            placeholder="Paste your syllabus content, notes, or key points here..."
                            value={form.content}
                            onChange={handleChange}
                            rows={10}
                        />
                    </div>

                    {error && (
                        <div className="su-error-box">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="su-success-box">
                            <span>✅</span> Syllabus uploaded successfully!
                        </div>
                    )}

                    <div className="su-actions">
                        <button
                            type="button"
                            className="su-btn-ghost"
                            onClick={() => navigate("/home/syllabus")}
                        >
                            View All Syllabus
                        </button>
                        <button
                            type="submit"
                            className="su-btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Uploading…" : "Upload Syllabus"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default SyllabusUpload;
