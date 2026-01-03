import { useEffect, useState } from 'react';
import './FirstField.css';

function FirstField({
    setFirstname,
    setLastname,
    setUsername,
    setPassword,
    username,
    password,
    firstname,
    lastname,
    isUsernameValid,
    isPasswordStrong
}) {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setDeviceWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="field">
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "310px"
                }}>
                    <label>Username</label>
                    {deviceWidth < 768 && (
                        (username.length != 0) ?
                            <span className={isUsernameValid ? "ok" : "bad"}>
                                {isUsernameValid ? "✓ Available" : "✕ Not available"}
                            </span> :
                            null
                    )
                    }
                </div>
                <div className="input-row">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {!(deviceWidth < 768) ?
                        <>
                            {
                                (username.length != 0) ?
                                    <span className={isUsernameValid ? "ok" : "bad"}>
                                        {isUsernameValid ? "✓ Available" : "✕ Not available"}
                                    </span> :
                                    null

                            }
                        </> : null

                    }
                </div>
            </div>

            <div className="field">
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "310px"
                }}
                >
                    <label>Password</label>
                    {deviceWidth < 768 && (
                        (password.length != 0) ?
                            <span className={isPasswordStrong ? "ok" : "bad"}>
                                {isPasswordStrong ? "✓ Strong" : "✕ Weak"}
                            </span> :
                            null
                    )}
                </div>
                <div className="input-row">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!(deviceWidth < 768) ?
                        <>
                            {
                                (password.length != 0) ?
                                    <span className={isPasswordStrong ? "ok" : "bad"}>
                                        {isPasswordStrong ? "✓ Strong" : "✕ Weak"}
                                    </span> :
                                    null
                            }
                        </> : null
                    }
                </div>
            </div>

            <div className="name-row">
                <div className="field">
                    <label>First name</label>
                    <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label>Last name</label>
                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
}

export default FirstField;