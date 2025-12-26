import "./Friend.css";
import profile from '../../../assets/profile.png';
import Trophy from "../../../components/Trophy";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

function Friend() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();
    let [FriendView, setFriendView] = useState(false);
    const [userFriends, setUserFriends] = useState([]);
    const [friends, setFriends] = useState([]);


    useEffect(() => {
        setNavState("friend");
        fetchFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setNavState]);

    const fetchFriends = async () => {
        try {
            const res = await axios.get(`${baseURL}/friends/get-user`, {
                withCredentials: true,
            });
            setUserFriends(res.data.friends);

            console.log(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                setUserFriends({});
            }
        }
    };

    const fetchUser = async (username) => {
        try {
            const res = await axios.post(
                `${baseURL}/user/get-user-username`,
                username,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            );

            setFriends(prev => {
                if (prev.some(f => f.username === res.data.username)) {
                    return prev;
                }
                return [...prev, res.data];
            });

        } catch (err) {
            if (err.response?.status === 401) {
                setUserFriends(prev => prev);
            }
        }
    };

    useEffect(() => {
        if (!userFriends.length) return;

        setFriends([]);

        Promise.all(userFriends.map(fetchUser));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFriends]);


    useEffect(() => {
        console.log(friends);
    }, [friends]);



    let user = {
        name: 'Muthukumaran M',
        rank: 1,
        friend: 10,
        trophies: 105,
        email: "muthukumaranarc00@gmail.com",
        linkedIn: "muthukumaranarc",
        dob: "july 12 2008"
    }

    return (
        <div className="friend-page">
            {FriendView ? viewFriend(user, setFriendView) : <></>}
            <h3>Friends</h3>
            <div className="my-profile">
                <div>
                    <img src={profile} alt="profile" />
                </div>
                <div>
                    <p><b className="my-name">{user.name}</b> <br /> {'#' + user.rank}</p>
                    <center><p>Friends <br /> {user.friend}</p></center>
                    <center><p>Trophies <br /> {user.trophies}</p></center>
                </div>
            </div>
            <p className="your-friend">Your friends</p>
            {
                [...friends]
                    .sort((a, b) => b.trophies - a.trophies)
                    .map((data) => (
                        <div
                            key={data.username}
                            className="friend-profile"
                            onClick={() => setFriendView(true)}
                        >
                            <div>
                                <img src={profile} alt="profile" />
                            </div>

                            <div>
                                <p>
                                    <b className="friend-name">{data.firstName}</b><br />
                                    {'#' + data.trophy}
                                </p>

                                <center>
                                    <p>Friends <br /> {data.friends}</p>
                                </center>

                                <center>
                                    <p>Trophies <br /> {data.trophy}</p>
                                </center>
                            </div>
                        </div>
                    ))
            }



        </div>
    );
}

function viewFriend(user, setFriendView) {
    return (
        <div className="view-friend">
            <div>
                <div>
                    <div>
                        <img src={profile} />
                    </div>
                    <p>{user.name}</p>
                    <Trophy trophy={user.trophies} />
                </div>
                <div>
                    <div>
                        <p>Email: </p>
                        <p>LinkedIn: </p>
                        <p>Birth day: </p>
                    </div>
                    <div>
                        <p>{user.email}</p>
                        <p>{user.linkedIn}</p>
                        <p>{user.dob}</p>
                    </div>
                </div>
                <button onClick={() => { setFriendView(false) }}>Close</button>
            </div>
        </div>
    )
}

export default Friend;