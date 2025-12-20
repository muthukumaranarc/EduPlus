import './ChatHistoryBlock.css';

function ChatHistoryBlock({ chatHistory }) {
    if (!Array.isArray(chatHistory)) return null;
    return (
        <>
            {chatHistory.map((data, index) => (
                <div
                    key={index}
                    className={index % 2 === 0 ? "request" : "response"}
                >
                    <p>{data}</p>
                </div>
            ))}
        </>
    );
}

export default ChatHistoryBlock;