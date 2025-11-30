import "./Friend.css";
import profile from '../../assets/profile.png';

function Friend() {

    let user = {
        name: 'Muthukumaran',
        rank: 1,
        friend: 10,
        trophies: 105
    }

    return (
        <>
        <h3>Friends</h3>
        <div>
            <div>
                <img src={profile} alt="" />
            </div>
            <div>
                <p>{user.name}</p>
                <p>{user.rank}</p>
                <p>{user.friend}</p>
            </div>
        </div>
        </>
    );
}

export default Friend;