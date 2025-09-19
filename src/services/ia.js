import axios from "axios";

export async function ChatMensagem(pergunta, specialties) {
  try {
    console.log("Pergunta enviada:", pergunta);

    const data = `${JSON.stringify(pergunta)} - RESPONDA SEMPRE MINHA ÚLTIMA PERGUNTA, PORÉM LEVE EM CONTA TODAS AS OUTRAS PERGUNTAS E RESPOSTA QUE EXISTEM NA LISTA. VOCÊ DEVE SER UM AGENTE DE IA TREINADO EM ${specialties}, NÃO PODE SAIR DO SEU TEMA. É EXTREMAMENTE PROIBIO VOCÊ DAR A RESPOSTA PARA O ALUNO, VOCÊ DEVE EXPLICAR COM O ALUNOS CHEGA NO SEU OBJETIVO, SEJA CORTEZ.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-70b-instruct",
        messages: [
          {
            role: "user",
            content: data,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.choices?.[0]?.message?.content) {
      throw new Error("Resposta inválida da API OpenRouter");
    }

    const respostaTexto = response.data.choices[0].message.content;

    console.log("✅ Resposta recebida da IA");
    return respostaTexto;
  } catch (erro) {
    console.error("❌ Erro ao consultar LLaMA:", erro);
    return "Houve um erro ao consultar a IA. Tente novamente em instantes.";
  }
}
