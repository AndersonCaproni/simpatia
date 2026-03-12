import { useState, useEffect, useRef } from "react";
import Logo from "../../assets/logo.svg";
import Unifenas from "../../assets/unifenas.png";
import { CaretUp, Robot } from "phosphor-react";
import Button from "../button";
import styles from "./barra-inferior.module.css";
import ModuleIA from "../modules-ia/modules-ia";
import { useNavigate } from "react-router-dom";
import { useMan } from "../../hooks/man-provider";

const BarraInferior = () => {
  const { isMobile, startTutorial, setIsOpenChatBot } = useMan();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Se for mobile, não renderiza essa barra inferior
  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.handleSection} onClick={() => setIsOpen(!isOpen)}>
        <CaretUp size={18} weight="bold" className={`${styles.arrowIcon} ${isOpen ? styles.arrowDown : ""}`} />
      </div>
      <div className={styles.content}>
        <button className={styles.btn} onClick={() => { setIsOpen(false); startTutorial(); }} >
          ?
        </button>
        <button className={styles.btn} onClick={() => { setIsOpen(false); setIsOpenChatBot(true) }} >
          <Robot size={18}/>
        </button>
      </div>
    </div>
  );
};

export default BarraInferior;
