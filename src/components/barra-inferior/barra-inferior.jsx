import { useState, useEffect, useRef } from "react";
import { CaretUp,  } from "phosphor-react";
import styles from "./barra-inferior.module.css";
import { useMan } from "../../hooks/man-provider";
import { BsRobot  } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa";

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
          <FaQuestion  size={18} weight="bold" />
        </button>
        <button className={styles.btn} onClick={() => { setIsOpen(false); setIsOpenChatBot(true) }} >
          <BsRobot size={22} />
        </button>
      </div>
    </div>
  );
};

export default BarraInferior;
