import { useEffect, useRef } from "react";
import styles from "./chat-bot.module.css";
import { useMan } from "../../hooks/man-provider";
import { PaperPlaneRight, Robot } from "phosphor-react";

const ChatBot = () => {
  const { isMobile, isOpenChatBot, setIsOpenChatBot } = useMan();
  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        isOpenChatBot
      ) {
        setIsOpenChatBot(false);
      }
    };

    if (isOpenChatBot) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenChatBot]);

  if (isMobile) return null;

  return (
    <div
      ref={chatRef}
      className={`${styles.container} ${isOpenChatBot ? styles.open : styles.closed}`}
    >
      <header className={styles.chatHeader}>
        <div className={styles.chatHeaderTitle}>
          {/* <Robot size={20} color={'yellow'} />
          <div>
            <strong>Ajuda AI</strong>
            <span>Seu assistente virtual para dúvidas acadêmicas</span>
          </div> */}
          <span style={{textAlign: 'center', display: 'block', width: '100%'}}>
            Em breve, o Ajuda AI estará disponível para te ajudar com suas dúvidas acadêmicas! Fique ligado!
          </span>
        </div>
      </header>

      <div className={styles.messages}>
        <div className={styles.messagesInner}>

          {false && (
            <div className={`${styles.messagebot} ${styles.message} ${styles.loadingContainer}`}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputAreaWrapper}>
        <form className={styles.inputArea}>

          <div id="chat-input-area" className={styles.inputBox}>
            <textarea
              placeholder={`Pergunte algo ...`}
              rows={1}
              className={styles.textarea}
            />
            <button className={styles.submitBtn}>
              <PaperPlaneRight size={18} weight="fill" />
            </button>
          </div>
          <p className={styles.disclaimer}>
            O Ajuda AI pode cometer erros. Por isso, lembre-se de conferir as informações geradas.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
