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
    let quichPic = ['How to start EduPlus for learning?', 'Motivate Me', 'What is weather today?'];
    let [query, setQuery] = useState("")
    const { setNavState, chatHistory, setChatHistory } = useOutletContext();
    const divRef = useRef(null);
    let [waitingMsg, setWaitingMsg] = useState("");

    useEffect(() => {
        setNavState("ai");
    }, [setNavState]);

    useEffect(() => {
    if (waitingMsg === "Thinking...") {
        setTimeout(() => {
            setWaitingMsg("Thinking... (Sorry our server is slow today)");
        }, 5000);
    }
}, [waitingMsg]);

    useEffect(() => {
        console.log('data: ' + chatHistory);

        handleScrollToEnd();
    }, [chatHistory])

    const handleQuery = () => {
        setWaitingMsg('thinking...')
        if (chatHistory != []) {
            setChatHistory(prev => [...prev, query])
        }
        else {
            setChatHistory(query)
        }
        axios.post(
            `${baseURL}/ass/ask`,
            { query },
            { withCredentials: true }
        )
            .then(res => {
                console.log(res.data);
                setChatHistory(prev => [...prev, res.data.response]);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    window.location.href =
                        `${baseURL}/oauth2/authorization/google`;
                } else {
                    console.error(err);
                }
            })
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

    return (
        <div className="ai-chat">
            {
                (chatHistory[0] == null) ?
                    <>
                        <h3>Ai Chat</h3>
                        <h2>Speak with Eduplus AI</h2>
                        <p>With EduPlus AI, you can ask questions, get guidance, and instantly speak for smarter learning.</p>
                    </> :
                    <div className="history-sec" ref={divRef}>
                        {
                            <ChatHistoryBlock chatHistory={chatHistory} />
                        }
                        {
                            (chatHistory.length % 2 != 0) ?
                                <ShinyText
                                    text={waitingMsg}
                                    disabled={false}
                                    speed={2.5}
                                    className='custom-class'
                                /> :
                                null
                        }
                    </div>
            }
            <div className={`query ${chatHistory[0] != null ? 'query-with-history' : ''}`}>
                <input
                    type="text"
                    id="input"
                    placeholder="What is in your mind?"
                    value={query}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    onChange={(e) => { setQuery(e.target.value) }}
                />
                <button onClick={handleQuery}>
                    <img src={generate} alt="generate" />
                    <p>Generate</p>
                </button>
            </div>

            {
                (chatHistory[0] == null) ?
                    <div className="quick-pic">
                        {
                            quichPic.map((data, index) => (
                                <div key={index} onClick={() => { setQuery(data) }}>
                                    <img src={aiSearch} alt="" />
                                    <p>{data}</p>
                                </div>
                            ))
                        }
                    </div> :
                    null

            }

        </div>
    );
}

export default Ai;