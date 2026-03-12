import axios from "axios";

/**
 * Gera áudio realista via Gemini 2.0 Flash TTS.
 * Retorna um AudioBuffer pronto para tocar, ou null em caso de erro.
 *
 * Vozes masculinas disponíveis: Charon (grave/sério), Fenrir (animado), Puck (descontraído)
 */
export async function generateSpeech(text, voiceName = "Charon", existingAudioCtx = null) {
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

    console.log(response.data);

    const part = response.data?.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) throw new Error("Resposta de áudio inválida");

    const base64 = part.inlineData.data;
    const mimeType = part.inlineData.mimeType || "audio/L16;rate=24000";

    // Decodifica base64 → ArrayBuffer
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);

    const audioCtx = existingAudioCtx || new (window.AudioContext || window.webkitAudioContext)();

    // Gemini retorna PCM 16-bit (L16) a 24kHz — precisamos encodar em WAV
    if (mimeType.includes("L16") || mimeType.includes("pcm")) {
        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)?.[1] || "24000");
        const wavBlob = encodeWAV(buffer, sampleRate);
        const url = URL.createObjectURL(wavBlob);
        return { type: "html5", url };
    }

    // Fallback se vier algum outro formato mp3/wav
    const url = URL.createObjectURL(new Blob([buffer], { type: mimeType }));
    return { type: "html5", url };
}

// Cria o cabeçalho WAV para um buffer de raw PCM
function encodeWAV(pcmBuffer, sampleRate) {
    const pcmData = new Uint8Array(pcmBuffer);
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    return new Blob([wavHeader, pcmData], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

/**
 * Toca um URL de áudio.
 */
export function playAudioObject(url, onEnd, existingAudioRef) {
    const audio = existingAudioRef && existingAudioRef.current ? existingAudioRef.current : new Audio();
    audio.src = url;
    
    // Configura evento de fim
    audio.onended = () => {
        if (onEnd) onEnd();
        URL.revokeObjectURL(url); // libera memória
    };
    audio.onerror = () => {
        if (onEnd) onEnd();
        URL.revokeObjectURL(url);
    };

    audio.play().catch(e => {
        console.warn("HTML5 audio play falhou:", e);
        if (onEnd) onEnd();
    });
    return audio;
}
