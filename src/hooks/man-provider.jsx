import {
  BookOpen,
  Calculator,
  Flask,
  Globe,
  Laptop,
  Palette,
  Robot,
  Users,
} from "phosphor-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ChatMensagem } from "../services/ia";

const ManContext = createContext();

const setStorage = (name, value) => {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao salvar no localStorage:", e);
  }
};

const getStorage = (name) => {
  try {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error("Erro ao ler do localStorage:", e);
    return null;
  }
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
      color: "#0051C2",
      specialties: ["Metodologias", "Planejamento", "Avaliação"],
      messages: [],
    },
    {
      id: "humanities",
      name: "Humanidades",
      icon: BookOpen,
      description:
        "Especialista em História, Literatura, Filosofia e áreas correlatas",
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
      description:
        "Especialista em Sociologia, Psicologia, Administração e Direito",
      presentation:
        "Olá, eu sou o Assistente de Sociais, Especialista em Sociologia, Psicologia, Administração e Direito. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#F97316",
      specialties: ["Sociologia", "Psicologia", "Administração", "Direito"],
      messages: [],
    },
    {
      id: "computer",
      name: "Computação",
      icon: Laptop,
      description:
        "Especialista em computação e em desenvolvimento de software",
      presentation:
        "Olá, eu sou o Assistente de Computação, Especialista em computação e em desenvolvimento de software. Estou pronto para te ajudar com suas dúvidas, o que precisa?",
      color: "#0051C2",
      specialties: ["Inteligência Artificial", "Desenvolvimento", "TI"],
      messages: [],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const [reload, setReload] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const limparStorage = () => {
    if (!selectedAgent) return;
    setReload(true);

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === selectedAgent.id ? { ...a, messages: [] } : a
        )
      );

      setSelectedAgent((prev) => (prev ? { ...prev, messages: [] } : prev));

      const savedMessages = getStorage("agentsMessages");
      if (savedMessages) {
        try {
          savedMessages[selectedAgent.id] = [];
          setStorage("agentsMessages", savedMessages);
        } catch (e) {
          console.error("Erro ao limpar cache do agente:", e);
        }
      }

      setReload(false);
    }, 2000);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!selectedAgent || !inputValue.trim()) return;

    const agentId = selectedAgent.id;

    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setAgents((prev) => {
      const updated = prev.map((a) =>
        a.id === agentId ? { ...a, messages: [...a.messages, userMessage] } : a
      );
      setStorage(
        "agentsMessages",
        updated.reduce((acc, a) => ({ ...acc, [a.id]: a.messages }), {})
      );
      return updated;
    });

    setSelectedAgent((prev) =>
      prev ? { ...prev, messages: [...prev.messages, userMessage] } : prev
    );

    setInputValue("");
    setIsLoading(true);

    try {
      const apiResponse = await ChatMensagem(
        [...selectedAgent.messages, userMessage],
        selectedAgent.specialties
      );

      let botText = "";
      if (!apiResponse) botText = "Sem resposta do servidor.";
      else if (typeof apiResponse === "string") botText = apiResponse;
      else if (apiResponse.content) botText = apiResponse.content;
      else botText = JSON.stringify(apiResponse);

      const botResponse = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "bot",
        content: botText,
        timestamp: new Date(),
      };

      setAgents((prev) => {
        const updated = prev.map((a) =>
          a.id === agentId
            ? { ...a, messages: [...a.messages, botResponse] }
            : a
        );
        setStorage(
          "agentsMessages",
          updated.reduce((acc, a) => ({ ...acc, [a.id]: a.messages }), {})
        );
        return updated;
      });

      setSelectedAgent((prev) =>
        prev ? { ...prev, messages: [...prev.messages, botResponse] } : prev
      );
    } catch (error) {
      console.error("Erro ao enviar/receber mensagem da IA:", error);
      const errorBotResponse = {
        id: `bot-error-${Date.now()}`,
        type: "bot",
        content:
          "Desculpe — ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        timestamp: new Date(),
      };

      setAgents((prev) => {
        const updated = prev.map((a) =>
          a.id === agentId
            ? { ...a, messages: [...a.messages, errorBotResponse] }
            : a
        );
        setStorage(
          "agentsMessages",
          updated.reduce((acc, a) => ({ ...acc, [a.id]: a.messages }), {})
        );
        return updated;
      });

      setSelectedAgent((prev) =>
        prev
          ? { ...prev, messages: [...prev.messages, errorBotResponse] }
          : prev
      );
    } finally {
      setIsLoading(false);
      autoResize();
    }
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
    const savedMessages = getStorage("agentsMessages");
    if (savedMessages) {
      try {
        setAgents((prev) =>
          prev.map((agent) => ({
            ...agent,
            messages: (savedMessages[agent.id] || []).map((msg) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })),
          }))
        );
      } catch (e) {
        console.error("Erro ao parsear mensagens do localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    const messagesData = agents.reduce((acc, agent) => {
      acc[agent.id] = agent.messages;
      return acc;
    }, {});
    setStorage("agentsMessages", messagesData);
  }, [agents]);

  return (
    <ManContext.Provider
      value={{
        isMobile,
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
        reload,
        setReload,
        limparStorage,
      }}
    >
      {children}
    </ManContext.Provider>
  );
};

export const useMan = () => useContext(ManContext);
