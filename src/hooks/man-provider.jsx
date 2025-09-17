import { createContext, useContext, useState, useRef, useEffect } from "react";

const ManContext = createContext();

export const ManProvider = ({ children }) => {
    const [value, setValue] = useState("Ola");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [agents, setAgents] = useState([
        {
            id: "general",
            name: "Assistente Geral",
            description: "Especialista em educação geral",
            presentation:
                "Olá, eu sou o Assistente Geral. Estou pronto para te ajudar com suas dúvidas!",
            color: "#6a5acd",
            messages: [],
        },
        {
            id: "math",
            name: "Exatas",
            description: "Especialista em Matemática e Física",
            presentation:
                "Olá, eu sou o Assistente de Exatas. Vamos resolver problemas juntos?",
            color: "#1e90ff",
            messages: [],
        },
        {
            id: "humanities",
            name: "Humanidades",
            description: "História, Filosofia, Literatura",
            presentation:
                "Olá, eu sou o Assistente de Humanidades. Pronto para filosofar?",
            color: "#ff8c00",
            messages: [],
        },
    ]);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);
    const scrollRef = useRef(null);

    const generateResponse = (question, agent) => {
        if (agent.id === "general") {
            return `Sobre "${question}", eu sugiro considerar metodologias eficazes e estruturadas.`;
        }
        if (agent.id === "math") {
            return `Para "${question}", recomendo aplicar conceitos fundamentais e exemplos práticos.`;
        }
        if (agent.id === "humanities") {
            return `No tema "${question}", é essencial conectar com contexto histórico e cultural.`;
        }
        return "Estou aqui para te ajudar!";
    };

    const handleAgentSelect = (agent) => {
        if (agent.messages.length === 0) {
            const welcome = {
                id: `bot-${Date.now()}`,
                type: "bot",
                content: agent.presentation,
                timestamp: new Date(),
            };
            setAgents((prev) =>
                prev.map((a) =>
                    a.id === agent.id ? { ...a, messages: [welcome] } : a
                )
            );
            setSelectedAgent({ ...agent, messages: [welcome] });
        } else {
            setSelectedAgent(agent);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedAgent || !inputValue.trim()) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            type: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setSelectedAgent((prev) =>
            prev ? { ...prev, messages: [...prev.messages, userMessage] } : null
        );

        setAgents((prev) =>
            prev.map((a) =>
                a.id === selectedAgent.id
                    ? { ...a, messages: [...a.messages, userMessage] }
                    : a
            )
        );

        setInputValue("");
        setIsLoading(true);

        setTimeout(() => {
            const botResponse = {
                id: `bot-${Date.now()}`,
                type: "bot",
                content: generateResponse(userMessage.content, selectedAgent),
                timestamp: new Date(),
            };

            setSelectedAgent((prev) =>
                prev ? { ...prev, messages: [...prev.messages, botResponse] } : null
            );

            setAgents((prev) =>
                prev.map((a) =>
                    a.id === selectedAgent.id
                        ? { ...a, messages: [...a.messages, botResponse] }
                        : a
                )
            );
            autoResize();
            setIsLoading(false);
        }, 1500);
    };

    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            const lineHeight = 24;
            const maxHeight = lineHeight * 10;
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
            textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
        }
    };

    useEffect(() => {
        autoResize();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedAgent?.messages, isLoading]);

    return (
        <ManContext.Provider
            value={{
                value,
                setValue,
                agents,
                handleAgentSelect,
                selectedAgent,
                scrollRef,
                isLoading,
                handleSubmit,
                textareaRef,
                autoResize,
                inputValue,
                setInputValue,
            }}
        >
            {children}
        </ManContext.Provider>
    )
}

export const useMan = () => useContext(ManContext);