import { Robot } from "phosphor-react";
import { useMan } from "../hooks/man-provider";

const SideBar = ({ children }) => {

    const {
        agents,
        handleAgentSelect,
        selectedAgent
    } = useMan();

    return (
        <div
            style={{
                display: "flex",
                width: '15rem',
                height: "100%",
                backgroundColor: "#F8F8FC",
                border: "solid 1px #E4E4F2",
                boxShadow: "0px 4px 16px rgba(76, 75, 103, 0.08)",
                borderRadius: "9px"
            }}
        >
            <aside className="sidebar">
                <h2>Agentes</h2>
                <ul>
                    {agents.map((agent) => (
                        <li
                            key={agent.id}
                            className={selectedAgent?.id === agent.id ? "active" : ""}
                            onClick={() => handleAgentSelect(agent)}
                            style={{ borderLeftColor: agent.color }}
                        >
                            <Robot size={18} /> {agent.name}
                        </li>
                    ))}
                </ul>
            </aside>
            <style>{`
        .sidebar {
          width: 220px;
          background: #fafafa;
          border-right: 1px solid #ddd;
          padding: 16px;
        }
        .sidebar h2 {
          font-size: 16px;
          margin-bottom: 12px;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar li {
          padding: 8px;
          margin-bottom: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          border-left: 4px solid transparent;
          transition: background 0.2s;
        }
        .sidebar li.active, .sidebar li:hover {
          background: #eee;
        }
      `}</style>
        </div>
    );
}

export default SideBar;