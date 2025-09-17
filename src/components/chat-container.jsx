import { PaperPlaneRight, CircleNotch, User, Robot } from "phosphor-react";
import { useMan } from "../hooks/man-provider";
import { useEffect } from "react";

const ChatContainer = () => {

    const {
        selectedAgent,
        scrollRef,
        isLoading,
        handleSubmit,
        textareaRef,
        inputValue,
        setInputValue,
        autoResize
    } = useMan()

    return (
        <div className="chat-container">

            <main className="chat-area">
                {selectedAgent ? (
                    <>
                        {/* <header className="chat-header">
                            <Robot size={20} color={selectedAgent.color} />
                            <div>
                                <strong>{selectedAgent.name}</strong>
                                <p>{selectedAgent.description}</p>
                            </div>
                        </header> */}

                        <div className="messages" ref={scrollRef}>
                            {selectedAgent.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.type}`}
                                    style={{
                                        backgroundColor:
                                            msg.type === "bot" ? "#f0f0f0" : selectedAgent.color,
                                        color: msg.type === "bot" ? "#000" : "#fff",
                                    }}
                                >
                                    {msg.type === "user" ? (
                                        <User size={16} />
                                    ) : (
                                        <Robot size={16} />
                                    )}
                                    <span>{msg.content}</span>
                                    <small>
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </small>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="message bot loading">
                                    <Robot size={16} />
                                    <span>Digitando...</span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="input-area">
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => { setInputValue(e.target.value); autoResize() }}
                                placeholder={`Converse com ${selectedAgent.name}...`}
                                rows={1}
                                style={{
                                    flex: 1,
                                    border: '1px solid #E4E4F2',
                                    resize: 'none',
                                    padding: '8px 12px 0px 8px',
                                    outline: 'none',
                                    borderRadius: '8px',
                                    font: 'inherit',
                                    lineHeight: '24px',
                                    height: 'auto',
                                    maxHeight: `${24 * 10}px`,
                                    overflowY: 'hidden',
                                    boxShadow: '0px 1px 4px rgba(76, 75, 103, 0.08)',
                                }}
                            />
                            <button type="submit" disabled={isLoading || !inputValue.trim()}>
                                {isLoading ? (
                                    <CircleNotch size={20} className="spin" />
                                ) : (
                                    <PaperPlaneRight size={20} />
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="empty-chat">
                        <Robot size={40} />
                        <p>Selecione um agente para começar</p>
                    </div>
                )}
            </main>

            <style>{`
  .chat-container {
    display: flex;
    height: 100%;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
  }

  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; 
  }

  .chat-header {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    height: 50px;
    flex-shrink: 0;
  }

  .chat-header strong {
    display: block;
  }

  .chat-header p {
    margin: 0;
    font-size: 12px;
    color: #666;
  }

  .messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    overflow-x: hidden; /* evita scroll horizontal */
    background: red;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-sizing: border-box;
    max-height: CALC(100% - 350px);
  }

  .message {
    max-width: 70%;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    word-break: break-word; /* quebra texto grande */
  }

  .message small {
    font-size: 10px;
    position: absolute;
    bottom: -14px;
    right: 6px;
    color: #666;
  }

  .message.user {
    margin-left: auto;
  }

  .message.bot {
    margin-right: auto;
  }

  .input-area {
    height: 50px;
    display: flex;
    border-top: 1px solid #ddd;
    padding: 12px 16px;
    background: #fff;
    box-shadow: 0px -5px 8px rgba(76, 75, 103, 0.08);
    flex-shrink: 0;
  }

  textarea::-webkit-scrollbar {
    width: 4px; /* mais fino */
  }
  textarea::-webkit-scrollbar-thumb {
    background: #E4E4F2;
    border-radius: 4px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }

  .input-area button {
    margin-left: 8px;
    border: none;
    background: #370199;
    color: #fff;
    border-radius: 6px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .input-area button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }

  .empty-chat {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #666;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0); }
    to { transform: rotate(360deg); }
  }
`}</style>

        </div>
    );
};

export default ChatContainer;
