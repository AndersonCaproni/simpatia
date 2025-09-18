import { Robot } from "phosphor-react";
import { useMan } from "../../hooks/man-provider";
import AgentButton from "../agent-button";
import styles from './side-bar.module.css'

const SideBar = ({ children }) => {

  const {
    agents,
    handleAgentSelect,
    selectedAgent
  } = useMan();

  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-header"]}>
        Agentes Especializados
      </div>
      <div className={styles["sidebar-content"]}>
        {agents?.map((agent, index) => {
          const isSelected = selectedAgent?.id === agent.id;
          return (
            <AgentButton
              key={index}
              isSelected={isSelected}
              handleAgentSelect={handleAgentSelect}
              agent={agent}
            />
          );
        })}
      </div>
    </div>

  );
}

export default SideBar;