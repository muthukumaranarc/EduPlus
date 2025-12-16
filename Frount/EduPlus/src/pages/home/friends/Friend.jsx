import "./Friend.css";
import profile from '../../../assets/profile.png';
import Trophy from "../../../components/Trophy";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Friend() {

    const { setNavState } = useOutletContext();
    useEffect(() => {
        setNavState("friend");
    }, [setNavState]);
    
    let [FriendView, setFriendView] = useState(false);

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
        { FriendView ? viewFriend( user, setFriendView) : <></>}
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
        <div className="friend-profile" onClick={() => setFriendView(true)}>
            <div>
                <img src={profile} alt="profile" />
            </div>
            <div>
                <p><b className="frined-name">{user.name}</b> <br /> {'#' + user.rank}</p>
                <center><p>Friends <br /> {user.friend}</p></center>
                <center><p>Trophies <br /> {user.trophies}</p></center>
            </div>
        </div>
        <div className="friend-profile">
            <div>
                <img src={profile} alt="profile" />
            </div>
            <div>
                <p><b className="frined-name">{user.name}</b> <br /> {'#' + user.rank}</p>
                <center><p>Friends <br /> {user.friend}</p></center>
                <center><p>Trophies <br /> {user.trophies}</p></center>
            </div>
        </div>
        <div className="friend-profile">
            <div>
                <img src={profile} alt="profile" />
            </div>
            <div>
                <p><b className="frined-name">{user.name}</b> <br /> {'#' + user.rank}</p>
                <center><p>Friends <br /> {user.friend}</p></center>
                <center><p>Trophies <br /> {user.trophies}</p></center>
            </div>
        </div>
        <div className="friend-profile">
            <div>
                <img src={profile} alt="profile" />
            </div>
            <div>
                <p><b className="frined-name">{user.name}</b> <br /> {'#' + user.rank}</p>
                <center><p>Friends <br /> {user.friend}</p></center>
                <center><p>Trophies <br /> {user.trophies}</p></center>
            </div>
        </div>
        </div>
    );
}

function viewFriend(user, setFriendView) {
    return (
        <div className="view-friend">
            <div>
                <div>
                    <div>
                        <img src={profile}/>
                    </div>
                    <p>{user.name}</p>
                    <Trophy trophy={user.trophies}/>
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
                <button onClick={() => {setFriendView(false)}}>Close</button>  
            </div>
        </div>
    )
}

export default Friend;