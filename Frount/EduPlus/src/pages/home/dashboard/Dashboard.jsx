import "./Dashboard.css";

import girl from "../../../assets/girl.png";
import arrow from "../../../assets/arrow.png";
import edit from "../../../assets/edit.png";
import x from "../../../assets/x.png";
import arrowBlue from "../../../assets/arrow_blue.png";

import { useOutletContext } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import ImageContext from "../../../context/ImageContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const { setNavState } = useOutletContext();
    const images = useContext(ImageContext);
    const navigate = useNavigate();
    let [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const handleResize = () => {
            setDeviceWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        setNavState("dashboard");
    }, [setNavState]);

    let name = 'Muthu';
    let motivate = 'Your hard work today is the foundation of the success you’ll own tomorrow. 🚀';

    let aboutCont = [
        {
            head: "Study plan with tests",
            cont: "Google’s most intelligent AI. Explore new capabilities like Agent, Visual Layout, Nano Banana Pro and more. Now free & unlimited in the app.",
            image: images.plan,
            root: "/home/action/plan"
        },
        {
            head: "Smart Test Builder",
            cont: "Create, edit, and manage tests effortlessly. Generate questions from study material, customize tests, and refine them anytime to match your learning goals.",
            image: images.test,
            root: "/home/action/test"
        },
        {
            head: "Personal Assistant (AI Chat)",
            cont: "Your always-available AI assistant. Ask questions, clear doubts, get explanations, and stay focused on your learning goals.",
            image: images.assistant,
            root: "/home/action/ai"
        },
        {
            head: "Your friends",
            cont: "Connect with friends, view their progress, compare achievements, and stay motivated by learning and growing together.",
            image: images.communication,
            root: "/home/friend"
        }
    ]

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTrack();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [tasks, setTasks] = useState([]);
    const fetchTrack = async () => {
        try {
            const res = await axios.get(`${baseURL}/pro/get`, {
                withCredentials: true
            });

            const fetchedTasks = res.data.tasks.map((task, index) => ({
                id: index + 1,                // frontend id
                title: task.name,             // backend → frontend mapping
                completed: task.completed
            }));

            setTasks(fetchedTasks);
        } catch (err) {
            console.error("Failed to fetch progress track", err);
        }
    };

    // 🔢 progress calculation
    const progress = useMemo(() => {
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.completed).length;
        return Math.round((completed / tasks.length) * 100);
    }, [tasks]);

    const toggleTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        setTasks(prev =>
            prev.map(t =>
                t.id === id
                    ? { ...t, completed: !t.completed }
                    : t
            )
        );
        try {
            await axios.post(
                `${baseURL}/pro/toggle`,
                task.title, // taskName
                {
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    withCredentials: true
                }
            );
        } catch (err) {
            console.error("Toggle failed", err);
            setTasks(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, completed: !t.completed }
                        : t
                )
            );
        }
    };

    const [newTask, setNewTask] = useState("");

    const addTask = async () => {
        const taskName = newTask.trim();
        if (!taskName) return;

        try {
            const res = await axios.post(
                `${baseURL}/pro/add`,
                taskName,
                {
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    withCredentials: true
                }
            );

            // Backend returns updated ProgressTrack
            const updatedTasks = res.data.tasks.map((task, index) => ({
                id: index + 1,
                title: task.name,
                completed: task.completed
            }));

            setTasks(updatedTasks);
            setNewTask("");
            setIsEditing(false);

        } catch (err) {
            console.error("Failed to add task", err);
        }
    };

    const removeTask = async (taskName) => {
        try {
            const res = await axios.delete(
                `${baseURL}/pro/remove`,
                {
                    data: taskName, // plain text body
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    withCredentials: true
                }
            );

            // Update tasks from backend response
            const updatedTasks = res.data.tasks.map((task, index) => ({
                id: index + 1,
                title: task.name,
                completed: task.completed
            }));

            setTasks(updatedTasks);
            setIsEditing(false);

        } catch (err) {
            console.error("Failed to remove task", err);
        }
    };


    return (
        <>
            <h3 style={{ position: "absolute", top: "5px", left: "20px", textAlign: "left" }}>Dashboard</h3>

            <div className="wel">
                <h2>Welcome back {name}!</h2>
                <p>{motivate}</p>
                <img src={girl} alt="girl" />
            </div>

            <div className="cont">
                <div className="today-track">

                    {/* ---------- HEADER ---------- */}
                    <div>
                        <h2>Today Task</h2>
                        {
                            !isEditing ?
                                <img
                                    src={edit}
                                    alt="edit"
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{ cursor: "pointer" }}
                                /> :
                                <img
                                    src={x}
                                    alt="edit"
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{ cursor: "pointer" }}
                                />
                        }
                    </div>

                    {/* ---------- PROGRESS ---------- */}
                    <div className="pro">
                        <div className="bar">
                            <div
                                className="state"
                                style={{
                                    width: `calc(( ${deviceWidth > 768 ? "350px" : "260px"} / 100) * ${progress})`
                                }}
                            />
                        </div>
                        <p>{progress}%</p>
                    </div>

                    {/* ---------- TASKS ---------- */}

                    {tasks.length === 0 && (
                        <p className="empty-state" style={{
                            textAlign: "center",
                            width: "100%",
                            color: "#777",
                        }}>
                            No tasks yet. Click <b>Edit</b> to add one 🚀
                        </p>
                    )}

                    {tasks.map(task => (
                        <div key={task.id}>
                            <p>{task.title}</p>
                            {
                                isEditing ?
                                    <button
                                        style={{
                                            color: "red",
                                            border: "2px solid red"
                                        }}
                                        onClick={() => removeTask(task.title)}
                                    >
                                        Remove
                                    </button>
                                    :
                                    <button
                                        className={task.completed ? "comp" : "done"}
                                        onClick={() => toggleTask(task.id)}
                                    >
                                        {task.completed ? "Completed" : "Done"}
                                    </button>
                            }
                        </div>
                    ))}

                    {
                        isEditing &&
                        <div className="create-new-task">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    addTask();
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Add a task..."
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />

                                <button type="submit" className="add-task-btn">
                                    Add
                                </button>
                            </form>
                        </div>
                    }


                </div>

                <div className="action-required">
                    <h2>Action Required</h2>

                    <div onClick={() => {navigate("/home/action/test/generate")}}>
                        <div></div>
                        <div>
                            <p>Generate Test</p>
                            <p>2 times</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                    <div onClick={() => {navigate("/home/ai")}}>
                        <div></div>
                        <div>
                            <p>Ask to AI</p>
                            <p>For 15min</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                    <div onClick={() => {navigate("/home/action/test/saved")}}>
                        <div></div>
                        <div>
                            <p>Complete unsolved tests</p>
                            <p>within today</p>
                        </div>
                        <img src={arrow} alt="arrow" />
                    </div>

                </div>
            </div>
            <div className="aboutSec">
                {
                    aboutCont.map((about, key) => (
                        <div key={key} className="aboutAction">
                            {(
                                deviceWidth > 768 && (
                                    (key % 2 !== 0) ? <img src={about.image} loading="lazy" /> : null
                                )
                            )}
                            {(
                                deviceWidth < 768 && (
                                    <img src={about.image} loading="lazy" />
                                )
                            )}
                            <div>
                                <h2>{about.head}</h2>
                                <p>{about.cont}</p>
                                <div onClick={() => { navigate(about.root), setNavState("action") }}>
                                    <p>Try Now</p>
                                    <img src={arrowBlue} alt="arrow" />
                                </div>
                            </div>
                            {(
                                deviceWidth > 768 && (
                                    (key % 2 == 0) ? <img src={about.image} loading="lazy" /> : null
                                )
                            )}
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Dashboard;
