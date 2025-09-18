import { BookOpen, Calculator, Globe, Robot, Palette, Users, Flask } from "phosphor-react";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const ManContext = createContext();

const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

export const ManProvider = ({ children }) => {
  const [value, setValue] = useState("Ola");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([
    {
      id: "general",
      name: "Assistente Geral",
      icon: Robot,
      description: "Especialista em educação geral e metodologias de ensino",
      presentation:
        "Olá, eu sou o Assistente Geral, Especialista em educação geral e metodologias de ensino. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#6C63FF",
      specialties: ["Metodologias", "Planejamento", "Avaliação"],
      messages: [],
    },
    {
      id: "humanities",
      name: "Humanidades",
      icon: BookOpen,
      description: "Especialista em História, Literatura, Filosofia e áreas correlatas",
      presentation:
        "Olá, eu sou o Assistente de Humanidades, Especialista em História, Literatura, Filosofia e áreas correlatas. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#F59E0B",
      specialties: ["História", "Literatura", "Filosofia", "Linguística"],
      messages: [],
    },
    {
      id: "mathematics",
      name: "Exatas",
      icon: Calculator,
      description: "Especialista em Matemática, Física, Química e Engenharias",
      presentation:
        "Olá, eu sou o Assistente de Exatas, Especialista em Matemática, Física, Química e Engenharias. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#3B82F6",
      specialties: ["Matemática", "Física", "Química", "Engenharias"],
      messages: [],
    },
    {
      id: "languages",
      name: "Idiomas",
      icon: Globe,
      description: "Especialista em ensino de idiomas e comunicação",
      presentation:
        "Olá, eu sou o Assistente de Idiomas, Especialista em ensino de idiomas e comunicação. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#22C55E",
      specialties: ["Inglês", "Espanhol", "Português", "Comunicação"],
      messages: [],
    },
    {
      id: "sciences",
      name: "Biológicas",
      icon: Flask,
      description: "Especialista em Biologia, Medicina e Ciências da Saúde",
      presentation:
        "Olá, eu sou o Assistente de Biológicas, Especialista em Biologia, Medicina e Ciências da Saúde. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#10B981",
      specialties: ["Biologia", "Medicina", "Enfermagem", "Farmácia"],
      messages: [],
    },
    {
      id: "arts",
      name: "Artes",
      icon: Palette,
      description: "Especialista em Artes, Design e áreas criativas",
      presentation:
        "Olá, eu sou o Assistente de Artes, Especialista em Artes, Design e áreas criativas. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#8B5CF6",
      specialties: ["Arte", "Design", "Música", "Teatro"],
      messages: [],
    },
    {
      id: "social",
      name: "Sociais",
      icon: Users,
      description: "Especialista em Sociologia, Psicologia, Administração e Direito",
      presentation:
        "Olá, eu sou o Assistente de Sociais, Especialista em Sociologia, Psicologia, Administração e Direito. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#F97316",
      specialties: ["Sociologia", "Psicologia", "Administração", "Direito"],
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
    if (agent.id === "mathematics") {
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
        prev.map((a) => (a.id === agent.id ? { ...a, messages: [welcome] } : a))
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

    setAgents((prev) => {
      const updatedAgents = prev.map((a) =>
        a.id === selectedAgent.id
          ? { ...a, messages: [...a.messages, userMessage] }
          : a
      );

      const messagesData = updatedAgents.reduce((acc, agent) => {
        acc[agent.id] = agent.messages;
        return acc;
      }, {});
      setCookie("agentsMessages", JSON.stringify(messagesData));

      return updatedAgents;
    });

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
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY =
        textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedAgent?.messages, isLoading]);

  useEffect(() => {
    autoResize();
    const savedMessages = getCookie("agentsMessages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setAgents((prev) =>
          prev.map((agent) => ({
            ...agent,
            messages: (parsed[agent.id] || []).map((msg) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })),
          }))
        );
      } catch (e) {
        console.error("Erro ao parsear mensagens do cookie:", e);
      }
    }
  }, []);

  useEffect(() => {
    const messagesData = agents.reduce((acc, agent) => {
      acc[agent.id] = agent.messages;
      return acc;
    }, {});
    setCookie("agentsMessages", JSON.stringify(messagesData));
  }, [agents]);

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
  );
};

export const useMan = () => useContext(ManContext);
