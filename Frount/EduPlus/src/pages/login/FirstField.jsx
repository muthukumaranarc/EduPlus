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
    return (
        <>
            <div className="field">
                <label>Username</label>
                <div className="input-row">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {
                        (username.length != 0) ?
                            <span className={isUsernameValid ? "ok" : "bad"}>
                                {isUsernameValid ? "✓ Available" : "✕ Not available"}
                            </span> :
                            null
                    }
                </div>
            </div>

            <div className="field">
                <label>Password</label>
                <div className="input-row">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {
                        (password.length != 0) ?
                            <span className={isPasswordStrong ? "ok" : "bad"}>
                                {isPasswordStrong ? "✓ Strong" : "✕ Weak"}
                            </span> :
                            null
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