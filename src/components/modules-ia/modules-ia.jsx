import { CaretDown } from "phosphor-react";
import { useMan } from "../../hooks/man-provider";
import { useDropdown } from "../../hooks/use-dropdown";
import Button from "../button";
import { useEffect, useState, useRef } from "react";
import styles from './_modules-ia.module.css'
import NavModulos from "../nav-modulos/NavModulos";

export default function ModuleIA() {
  const { agents, handleAgentSelect } = useMan();
  const { isOpen, setIsOpen, toggle, close } = useDropdown();
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    toggle();
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      close();
    }, 400); // 600ms dá bastante tempo para cruzar a tela até o modal
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 950);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {
        isMobile ?
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            className={styles.btn}
          >
            <div
              style={{
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: "6px"
              }}
            >
              <span style={{ lineHeight: "1" }}>Módulos de IA</span>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  width: "20px",
                  height: "20px",
                }}
              >
                <CaretDown
                  style={{
                    position: 'absolute',
                    width: "20px",
                    height: "20px",
                    transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    color: "#006FFF"
                  }}
                />
                <CaretDown
                  style={{
                    position: 'absolute',
                    width: "20px",
                    height: "20px",
                    transform: "rotate(0deg)",
                    transition: "transform 0.3s",
                    color: "#006FFF"
                  }}
                />
              </div>
            </div>

          </Button>
          :
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            types="outline"
          >
            Módulos de IA
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              style={{
                transform: isOpen ? "rotate(+180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
                color: "#006fff"
              }}
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="var(--azul-principal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
      }

      <div
        className={`${styles.submenuLinks} ${isOpen ? styles.submenuLinksOpen : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavModulos />
      </div>
    </div >
  );
}
