/* ── Shared Modern Dot Loading Animation ──────────────────────────── */
import "./DotsLoader.css";

function DotsLoader({ message = "Loading…" }) {
    return (
        <div className="dots-loader-wrap">
            <div className="dots-loader">
                <span /><span /><span />
            </div>
            {message && <p className="dots-loader-msg">{message}</p>}
        </div>
    );
}

export default DotsLoader;
