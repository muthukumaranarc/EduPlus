import "./plan.css";
import arrow from "../../../assets/arrow.png";
import upload from "../../../assets/upload.png";
import send from "../../../assets/send.png";
import copyImg from "../../../assets/copy.png";
import copiedImg from "../../../assets/copied.png";
import Duck_walking from "../../../assets/Duck_walking.gif";

import { useOutletContext } from "react-router-dom";
import { useRef, useState, useEffect, useMemo } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import axios from "axios";
import ReactMarkdown from "react-markdown";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function Plan() {
    const { deviceWidth } = useOutletContext();

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [pageCount, setPageCount] = useState(null);

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    /* -------------------- API -------------------- */
    const api = useMemo(() => {
        return axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            withCredentials: true,
        });
    }, []);

    /* -------------------- ACTIONS -------------------- */
    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const resetFileState = () => {
        setFile(null);
        setUploaded(false);
        setText("");
        setPageCount(null);
        setResult(null);

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);

        if (fileInputRef.current) fileInputRef.current.value = "";

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleCopy = async () => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Clipboard API failed", err);
        }
    } else {
        // Fallback for HTTP / mobile / older browsers
        const textArea = document.createElement("textarea");
        textArea.value = result;
        textArea.style.position = "fixed"; // prevent scroll jump
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Fallback copy failed", err);
        }

        document.body.removeChild(textArea);
    }
};


    const handleSend = async () => {
        if (!file || loading) return; // 🚨 prevent double fire (mobile)

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (text.trim()) formData.append("query", text);

            const res = await api.post("/stu/send-direct-file", formData);
            setResult(res.data.response);
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- FILE HANDLING -------------------- */
    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
        setUploaded(true);

        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);

        if (selected.type.startsWith("image/")) {
            setPageCount(1);
        } else if (selected.type === "application/pdf") {
            await renderPdfPreview(url);
        } else {
            estimatePagesFromText(selected);
        }
    };

    const estimatePagesFromText = async (file) => {
        try {
            const txt = await file.text();
            setPageCount(Math.max(1, Math.ceil(txt.length / 1800)));
        } catch {
            setPageCount(1);
        }
    };

    const renderPdfPreview = async (url) => {
        const pdf = await pdfjsLib.getDocument(url).promise;
        setPageCount(pdf.numPages);

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
        }).promise;
    };

    const getReadableFileType = (file) => {
        if (!file) return "FILE";
        if (file.type.startsWith("image/")) return "IMAGE";
        return file.name.split(".").pop().toUpperCase();
    };

    /* -------------------- CLEANUP -------------------- */
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /* -------------------- KEYBOARD (MOBILE SAFE) -------------------- */
    // const handleKeyDown = (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault(); // 🚨 stop mobile submit/reload
    //     }
    // };

    /* -------------------- LOADING -------------------- */
    if (loading) {
        return (
            <>
                {deviceWidth > 768 && (
                    <div
                        className="ac-head"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                    >
                        <img src={arrow} alt="arrow" />
                        <p>Actions</p>
                    </div>
                )}
                <div className="plan">
                    <img
                        className="duck-walking"
                        src={Duck_walking}
                        alt="Duck_walking"
                    />
                    <p className="loading-text">
                        Please wait, it is processing...
                    </p>
                </div>
            </>
        );
    }

    /* -------------------- RESULT -------------------- */
    if (result ) {
        return (
            <>
                {deviceWidth > 768 && (
                    <div
                        className="ac-head"
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                    >
                        <img src={arrow} alt="arrow" />
                        <p>Actions</p>
                    </div>
                )}

                <div className="result-wrapper">
                    <div className="result">
                        <h1>Your Results:</h1>
                        <ReactMarkdown>{result}</ReactMarkdown>

                        <button
                            type="button"
                            className="copy-btn"
                            onClick={handleCopy}
                        >
                            <img
                                src={copied ? copiedImg : copyImg}
                                alt="copy"
                            />
                        </button>
                    </div>
                </div>
            </>
        );
    }

    /* -------------------- MAIN UI -------------------- */
    return (
        <>
            {deviceWidth > 768 && (
                <div
                    className="ac-head"
                    onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                    }}
                >
                    <img src={arrow} alt="arrow" />
                    <p>Actions</p>
                </div>
            )}

            <div className={`plan ${uploaded ? "uploaded" : ""}`}>
                {!uploaded && (
                    <div className="intro">
                        <h2>Study plan with tests</h2>
                        <p>
                            Upload your file or paste text below to instantly
                            generate your personalized study plan with tests.
                        </p>
                    </div>
                )}

                {uploaded && file && (
                    <div className="file-card">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={resetFileState}
                        >
                            ✕
                        </button>

                        <div className="file-preview">
                            {file.type.startsWith("image/") && previewUrl && (
                                <img src={previewUrl} alt="preview" />
                            )}
                            {file.type === "application/pdf" && (
                                <canvas ref={canvasRef} />
                            )}
                        </div>

                        <div className="file-details">
                            <p>
                                <b>Name</b> :{" "}
                                {file.name.substring(
                                    0,
                                    file.name.lastIndexOf(".")
                                )}
                            </p>
                            <p>
                                <b>Size</b> :{" "}
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                            <p>
                                <b>Type</b> : {getReadableFileType(file)}
                            </p>
                            {pageCount && (
                                <p>
                                    <b>Pages</b> : {pageCount}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="query">
                    <input
                        type="text"
                        placeholder={
                            uploaded
                                ? "Add a text with it"
                                : "Upload file and ask your query"
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        // onKeyDown={handleKeyDown}
                    />

                    {!uploaded ? (
                        <button type="button" onClick={openFilePicker}>
                            <img src={upload} alt="Upload" />
                            <p>Upload</p>
                        </button>
                    ) : (
                        <button type="button" onClick={handleSend}>
                            <img src={send} alt="Send" />
                            <p>Send</p>
                        </button>
                    )}
                </div>
            </div>

            <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </>
    );
}

export default Plan;
