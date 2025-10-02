import { CaretDown } from "phosphor-react";
import { useMan } from "../../hooks/man-provider";
import { useDropdown } from "../../hooks/use-dropdown";
import Button from "../button";
import { useEffect, useState } from "react";
import styles from './_modules-ia.module.css'

export default function ModuleIA() {
  const { agents, handleAgentSelect } = useMan();
  const { isOpen, toggle, close } = useDropdown();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>

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
              <CaretDown
                style={{
                  width: "15px",  
                  height: "15px",
                  transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                  color: "#006FFF"
                }}
                color="#006FFF"
              />
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
            <CaretDown
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRight: "2px solid currentColor",
                borderBottom: "2px solid currentColor",
                transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)",
                transition: "transform 0.3s",
                marginLeft: "4px",
              }}
              color="#006FFF"
            />
          </Button>
      }

      {isOpen && (
        <ul
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            zIndex: 1000,
            minWidth: "180px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            marginTop: "4px",
            listStyle: "none",
            padding: "4px 0",
          }}
        >
          {agents.map((agent) => (
            <li
              key={agent.id}
              onClick={() => {
                handleAgentSelect(agent);
                close();
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                color: "#374151",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <agent.icon size={16} color={agent.color} />
              {agent.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
