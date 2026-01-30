import './ChatHistoryBlock.css';
import ReactMarkdown from "react-markdown";

function ChatHistoryBlock({ chatHistory }) {
    if (!Array.isArray(chatHistory)) return null;
    return (
        <>
            {chatHistory.map((data, index) => (
                <div
                    key={index}
                    className={index % 2 === 0 ? "request" : "response"}
                >
                    <ReactMarkdown>{data}</ReactMarkdown>
                </div>
            ))}
        </>
    );
}

export default ChatHistoryBlock;