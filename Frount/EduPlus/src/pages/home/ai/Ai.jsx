import "./Ai.css";

import generate from "../../../assets/generate.png";
import aiSearch from "../../../assets/aiSearch.png";
import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ChatHistoryBlock from "../../../components/ChatHistoryBlock";
import ShinyText from "../../../components/ShinyText";

function Ai() {
    const baseURL = import.meta.env.VITE_API_URL;

    const divRef = useRef(null);

    const { setNavState, chatHistory, setChatHistory } = useOutletContext();

    // ── AI mode: "general" | "syllabus" ──────────────────────────────────
    const [aiMode, setAiMode] = useState("general");

    const quickPic = [
        "How to start EduPlus for learning?",
        "Motivate Me",
        "What is weather today?"
    ];

    const [waitingMsg, setWaitingMsg] = useState("");
    const [query, setQuery] = useState("");

    // Set nav state once
    useEffect(() => {
        setNavState("ai");
    }, [setNavState]);

    // Change waiting message if server is slow
    useEffect(() => {
        if (waitingMsg === "Thinking...") {
            const timer = setTimeout(() => {
                setWaitingMsg("Thinking... (Sorry our server is slow today)");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [waitingMsg]);

    // Auto-scroll when chat history updates
    useEffect(() => {
        handleScrollToEnd();
    }, [chatHistory]);

    const handleQuery = async (data = "") => {
        if (query === "" && data === "") return;

        const currentQuery = data || query;

        // Clear input IMMEDIATELY
        setQuery("");

        try {
            setWaitingMsg("Thinking...");

            // Add user message
            setChatHistory(prev =>
                prev.length ? [...prev, currentQuery] : [currentQuery]
            );

            // ── Route to the correct endpoint based on aiMode ─────────────
            let res;
            // Build history including the new user message (already appended above)
            const historyWithCurrentMsg = [...(chatHistory.length ? chatHistory : []), currentQuery];

            if (aiMode === "syllabus") {
                res = await axios.post(
                    `${baseURL}/ass/ask-syllabus`,
                    { message: currentQuery },
                    { withCredentials: true }
                );
            } else {
                res = await axios.post(
                    `${baseURL}/ass/ask`,
                    { currentQuery, history: historyWithCurrentMsg },
                    { withCredentials: true }
                );
            }

            // Add AI response
            setChatHistory(prev => [...prev, res.data.response]);
            setWaitingMsg("");

            // ── Fire-and-forget personality analysis ─────────────────────
            axios.post(
                `${baseURL}/ass/analyze-personality`,
                { message: currentQuery },
                { withCredentials: true }
            ).catch(() => {}); // silently ignore errors

        } catch (err) {
            setWaitingMsg("");

            if (err.response?.status === 401) {
                window.location.href =
                    `${baseURL}/oauth2/authorization/google`;
            } else {
                const msg = err?.response?.data?.message || err?.response?.data || "Failed to contact the AI assistant.";
                // Append the error to chat so user can see it
                setChatHistory(prev => [...prev, `[System Error] ${msg}`]);
                console.error(err);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleQuery();
        }
    };

    const handleScrollToEnd = () => {
        if (!divRef.current) return;

        divRef.current.scrollTo({
            top: divRef.current.scrollHeight,
            behavior: "smooth"
        });
    };

    const handleQuickPic = (data) => {
        handleQuery(data);
    };

    return (
        <div className="ai-chat">

            {/* Header when no chat */}
            {chatHistory[0] == null && (
                <>
                    <h3 style={{ position: "absolute", top: "5px", left: "5px", textAlign: "left" }}>AI Chat</h3>
                    <h2>Speak with EduPlus AI</h2>
                    <p>
                        With EduPlus AI, you can ask questions, get guidance,
                        and instantly speak for smarter learning.
                    </p>
                </>
            )}

            {/* Chat history */}
            {chatHistory[0] != null && (
                <div className="history-sec" ref={divRef}>
                    <ChatHistoryBlock chatHistory={chatHistory} />

                    {chatHistory.length % 2 !== 0 && (
                        <ShinyText
                            text={waitingMsg}
                            disabled={false}
                            speed={2.5}
                            className="custom-class"
                        />
                    )}
                </div>
            )}

            {/* ── Mode Toggle + Query box wrapper ── */}
            <div className={`query-wrapper ${chatHistory[0] != null ? "query-wrapper-fixed" : ""}`}>

                {/* Mode toggle pill — only before the first message */}
                {chatHistory[0] == null && (
                    <>
                        <div className="ai-mode-toggle">
                            <button
                                id="ai-mode-general"
                                className={`ai-mode-btn ${aiMode === "general" ? "ai-mode-active" : ""}`}
                                onClick={() => setAiMode("general")}
                            >
                                ✨ General AI
                            </button>
                            <button
                                id="ai-mode-syllabus"
                                className={`ai-mode-btn ${aiMode === "syllabus" ? "ai-mode-active ai-mode-syllabus-active" : ""}`}
                                onClick={() => setAiMode("syllabus")}
                            >
                                📖 Syllabus AI
                            </button>
                        </div>

                        {/* Syllabus mode indicator */}
                        {aiMode === "syllabus" && (
                            <div className="ai-mode-indicator">
                                📚 Syllabus AI Mode Active — answers are grounded in your uploaded syllabus
                            </div>
                        )}
                    </>
                )}

                {/* Query box */}
                <div className="query">
                    <input
                        type="text"
                        placeholder={aiMode === "syllabus" ? "Ask from your syllabus…" : "Ask anything"}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />

                    <button
                        disabled={waitingMsg !== ""}
                        onClick={() => handleQuery()}
                    >
                        <img src={generate} alt="generate" />
                        <p>Generate</p>
                    </button>
                </div>

            </div>

            {/* Quick suggestions */}
            {chatHistory[0] == null && (
                <div className="quick-pic">
                    {quickPic.map((data, index) => (
                        <div
                            key={index}
                            onClick={() => handleQuickPic(data)}
                        >
                            <img src={aiSearch} alt="search" />
                            <p>{data}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Ai;
