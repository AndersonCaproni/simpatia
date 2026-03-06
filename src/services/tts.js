import axios from "axios";

/**
 * Gera áudio realista via Gemini 2.0 Flash TTS.
 * Retorna um AudioBuffer pronto para tocar, ou null em caso de erro.
 *
 * Vozes masculinas disponíveis: Charon (grave/sério), Fenrir (animado), Puck (descontraído)
 */
export async function generateSpeech(text, voiceName = "Charon") {
    const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
        {
            contents: [
                {
                    role: "user",
                    parts: [{ text }],
                },
            ],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName },
                    },
                },
            },
        },
        {
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.REACT_APP_GEMINI_API_KEY,
            },
        }
    );

    const part = response.data?.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) throw new Error("Resposta de áudio inválida");

    const base64 = part.inlineData.data;
    const mimeType = part.inlineData.mimeType || "audio/L16;rate=24000";

    // Decodifica base64 → ArrayBuffer
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);

    const audioCtx = new AudioContext();

    // Gemini retorna PCM 16-bit (L16) a 24kHz — decodifica manualmente
    if (mimeType.includes("L16") || mimeType.includes("pcm")) {
        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)?.[1] || "24000");
        const samples = new Int16Array(buffer);
        const audioBuffer = audioCtx.createBuffer(1, samples.length, sampleRate);
        const channel = audioBuffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) {
            channel[i] = samples[i] / 32768.0;
        }
        return { audioCtx, audioBuffer };
    }

    // Fallback para outros formatos (mp3, wav…)
    const decoded = await audioCtx.decodeAudioData(buffer);
    return { audioCtx, audioBuffer: decoded };
}

/**
 * Toca um AudioBuffer retornado por generateSpeech.
 * Retorna o AudioBufferSourceNode (para poder parar com .stop())
 */
export function playAudioBuffer({ audioCtx, audioBuffer }, onEnd) {
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    if (onEnd) source.onended = onEnd;
    source.start();
    return source;
}
