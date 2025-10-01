import {
  ArrowsCounterClockwise,
  CircleNotch,
  PaperPlaneRight,
  Robot,
  User,
} from "phosphor-react";
import { useMan } from "../../hooks/man-provider";
import { formatDate } from "../../utils/format-date";
import TypingMessage from "../typing-message";
import styles from "./chat-container.module.css";

const ChatContainer = () => {
  const {
    selectedAgent,
    scrollRef,
    isLoading,
    handleSubmit,
    textareaRef,
    inputValue,
    setInputValue,
    autoResize,
    reload,
    limparCookie,
  } = useMan();

  // Proteção para o ícone
  const Icon = selectedAgent?.icon;

  return (
    <div className={styles.chatContainer}>
      {selectedAgent ? (
        <>
          <header className={styles.chatHeader}>
            <div className={styles.chatHeaderTitle}>
              {Icon && <Icon size={20} color={selectedAgent.color} />}
              <div>
                <strong>{selectedAgent.name}</strong>
                <p>{selectedAgent.description}</p>
              </div>
            </div>
            <button className={styles.buttonTop} onClick={limparCookie}>
              <ArrowsCounterClockwise
                size={20}
                color="white"
                className={reload ? styles.spinTop : ""}
              />
            </button>
          </header>

          <div className={styles.messages} ref={scrollRef}>
            {selectedAgent.messages.map((msg) => {
              const MessageIcon = msg.type === "user" ? User : Icon;
              return (
                <div
                  key={msg.id}
                  className={`${styles.message} ${
                    styles[`message${msg.type}`]
                  }`}
                  style={{
                    backgroundColor:
                      msg.type === "bot" ? "#f0f0f0" : selectedAgent.color,
                    color: msg.type === "bot" ? "#000" : "#fff",
                  }}
                >
                  <div style={{ minHeight: "20px", minWidth: "20px" }}>
                    {MessageIcon && <MessageIcon size={16} />}
                  </div>
                  {msg.type === "bot" &&
                  selectedAgent?.messages[selectedAgent.messages.length - 1]
                    .id === msg.id &&
                  Date.now() - new Date(msg.timestamp).getTime() <= 5000 ? (
                    <TypingMessage content={msg.content} />
                  ) : (
                    <>{msg.content}</>
                  )}

                  <small>{formatDate(msg.timestamp)}</small>
                </div>
              );
            })}

            {isLoading && Icon && (
              <div className={`${styles.messagebot} ${styles.message}`}>
                <Icon size={16} />
                <span>Pensando...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && inputValue.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
              placeholder={`Converse com ${selectedAgent.name}...`}
              rows={1}
              style={{
                flex: 1,
                border: "1px solid #E4E4F2",
                resize: "none",
                padding: "8px 12px 0px 8px",
                outline: "none",
                borderRadius: "8px",
                font: "inherit",
                lineHeight: "24px",
                height: "auto",
                maxHeight: `${24 * 10}px`,
                overflowY: "hidden",
                boxShadow: "0px 1px 4px rgba(76, 75, 103, 0.08)",
                boxSizing: "border-box",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />
            <button type="submit" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <CircleNotch size={20} className={styles.spin} />
              ) : (
                <PaperPlaneRight size={20} />
              )}
            </button>
          </form>
        </>
      ) : (
        <div className={styles.emptyChat}>
          <Robot size={40} />
          <p>Selecione um agente para começar</p>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
