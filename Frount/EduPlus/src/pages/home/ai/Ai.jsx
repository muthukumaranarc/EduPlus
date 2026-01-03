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

        // ✅ Clear input IMMEDIATELY
        setQuery("");

        try {
            setWaitingMsg("Thinking...");

            // Add user message
            setChatHistory(prev =>
                prev.length ? [...prev, currentQuery] : [currentQuery]
            );

            const res = await axios.post(
                `${baseURL}/ass/ask`,
                { currentQuery },
                { withCredentials: true }
            );

            // Add AI response
            setChatHistory(prev => [...prev, res.data.response]);

            setWaitingMsg("");

        } catch (err) {
            setWaitingMsg("");

            if (err.response?.status === 401) {
                window.location.href =
                    `${baseURL}/oauth2/authorization/google`;
            } else {
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
                    <h3 style = {{position: "absolute", top: "5px", left: "5px", textAlign: "left"}}>AI Chat</h3>
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

            {/* Query box */}
            <div
                className={`query ${chatHistory[0] != null ? "query-with-history" : ""}`}
            >
                <input
                    type="text"
                    placeholder="Ask anything"
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
