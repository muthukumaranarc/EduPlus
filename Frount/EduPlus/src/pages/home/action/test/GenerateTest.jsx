import "./GenerateTest.css";
import { useOutletContext } from "react-router-dom";
import send from "../../../../assets/send.png";
import arrow from "../../../../assets/arrow.png";
import Duck_walking from "../../../../assets/Duck_walking.gif";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GenerateTest() {
    const baseURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    let { deviceWidth } = useOutletContext();

    const [query, setQuery] = useState("");

    const [groups, setGroups] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [newGroupName, setNewGroupName] = useState("");

    const [testTitle, setTestTitle] = useState("");
    const [questionCount, setQuestionCount] = useState(5);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef();

    /* ---------------- FETCH GROUPS ---------------- */
    useEffect(() => {
        fetchGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${baseURL}/test/get-all-group`, {
                withCredentials: true
            });
            setGroups(res.data.testGroup || []);
        } catch (err) {
            console.error("Failed to load groups", err);
        }
    };

    /* ---------------- VALIDATION ---------------- */
    const isBaseDetailsFilled = () => {
        return (
            (groupName || newGroupName.trim()) &&
            testTitle.trim() &&
            questionCount > 0
        );
    };

    const isTextValid = () => {
        return isBaseDetailsFilled() && query.trim();
    };

    /* ---------------- FILE PICKER ---------------- */
    const openFilePicker = () => {
        if (!isBaseDetailsFilled()) return;
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setQuery(""); // avoid conflict
        setLoading(true);

        try {
            const finalGroupName = await createGroupIfNeeded();

            const formData = new FormData();
            formData.append("groupName", finalGroupName);
            formData.append("testTitle", testTitle);
            formData.append("sourceText", selectedFile);
            formData.append("numberOfQuestions", questionCount);

            await axios.post(
                `${baseURL}/test/generate-from-text`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            navigate("/home/action/test/saved");
        } catch (err) {
            console.error("Failed to generate test from file", err);
            alert("Failed to generate test from file");
            setLoading(false);
        }
    };


    /* ---------------- CREATE GROUP ---------------- */
    const createGroupIfNeeded = async () => {
        if (!newGroupName.trim()) return groupName;

        await axios.post(
            `${baseURL}/test/create-group`,
            newGroupName,
            {
                headers: { "Content-Type": "text/plain" },
                withCredentials: true
            }
        );

        return newGroupName;
    };

    /* ---------------- GENERATE TEST (TEXT) ---------------- */
    const generateTest = async () => {
        if (!isTextValid()) {
            alert("Please fill all required fields and text");
            return;
        }

        setLoading(true);

        try {
            const finalGroupName = await createGroupIfNeeded();

            await axios.post(
                `${baseURL}/test/generate/${questionCount}`,
                {
                    groupName: finalGroupName,
                    testTitle: testTitle,
                    text: query
                },
                { withCredentials: true }
            );

            navigate("/home/action/test/saved");
        } catch (err) {
            console.error("Failed to generate test", err);
            alert("Failed to generate test");
            setLoading(false);
        }
    };

    /* ---------------- LOADING SCREEN ---------------- */
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

    return (
        <>
            {deviceWidth > 768 && (
                <div className="ac-head" onClick={() => window.history.back()}>
                    <img src={arrow} alt="arrow" />
                    <p>Actions</p>
                </div>
            )}

            <div className="gen-test">
                <h2>Speak with EduPlus AI</h2>
                <p>
                    With EduPlus AI, you can ask questions, get guidance,
                    and instantly create smart tests.
                </p>

                <div className="input">
                    <div className="first-row">
                        <select
                            value={groupName}
                            onChange={(e) => {
                                setGroupName(e.target.value);
                                setNewGroupName("");
                            }}
                            className="select-group"
                        >
                            <option value="">Select existing group</option>
                            {groups.map((g) => (
                                <option key={g.name} value={g.name}>
                                    {g.name}
                                </option>
                            ))}
                        </select>

                        <p>OR</p>

                        <input
                            type="text"
                            placeholder="Create new group"
                            value={newGroupName}
                            maxLength={20}
                            onChange={(e) => {
                                setNewGroupName(e.target.value);
                                setGroupName("");
                            }}
                        />
                    </div>

                    <div className="second-row">
                        <div>
                            <p>Test title: </p>
                            <input
                                type="text"
                                placeholder="Test title"
                                value={testTitle}
                                maxLength={20}
                                onChange={(e) => setTestTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <p>Number of questions: </p>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* -------- TEXT INPUT -------- */}
                <div className="text-input">
                    <input
                        type="text"
                        placeholder="Paste your text and click send"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        spellCheck={false}
                    />

                    <button
                        onClick={generateTest}
                        disabled={loading || !isTextValid()}
                    >
                        <img src={send} alt="send" />
                        <p>Send</p>
                    </button>
                </div>

                {/* -------- FILE UPLOAD -------- */}
                {isBaseDetailsFilled() && (
                    <>
                        <p>OR</p>
                        <p>Upload a file to generate tests</p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />

                        <button onClick={openFilePicker}>
                            Upload file
                        </button>
                    </>
                )}
            </div>
        </>
    );
}

export default GenerateTest;
