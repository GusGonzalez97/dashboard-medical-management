"use client";
import React, { useEffect, useRef } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Microphone, MicrophoneSlash } from "@phosphor-icons/react/dist/ssr";
import { motion } from "framer-motion";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  title:string;
}

interface PropsComponent {
  readonly text: string;
  onChangeText: (text: string) => void;
  readonly isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  readonly interimText:string;
  setInterimText : (text:string) => void;
  readonly title:string;
  readonly numberOfRows?:number;
  readonly disabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
  }
}

export function SpeechToText({
  text,
  onChangeText,
  isListening,
  setIsListening,
  interimText = '',
  setInterimText,
  title,
  numberOfRows,
  disabled
}: PropsComponent) : React.JSX.Element {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition as (new () => SpeechRecognition) | undefined;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
    }
    if (recognitionRef.current) {
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "es-ES";
    }

    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += `${event.results[i][0].transcript} `;
        } else {
          interimTranscript += `${event.results[i][0].transcript} `;
        }
      }

      if (finalTranscript.trim() !== "") {
        onChangeText?.(text + finalTranscript);
        setInterimText(""); // Limpiar texto en progreso
      } else {
        setInterimText(interimTranscript); // Mostrar texto intermedio
      }
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }
  }, [onChangeText,setInterimText,setIsListening,text]);

  function handleStart(): void {
    if (recognitionRef.current && !disabled) {
      setIsListening(true);
      recognitionRef?.current?.start();
    }
  }

  function handleStop(): void {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  }

  return (
   <Box position='relative' width='100%'>
        <TextField
          fullWidth
          multiline
          label={title}
          rows={numberOfRows??7}
          variant="outlined"
          value={text + interimText}
          disabled={disabled}
          onChange={(e) => {onChangeText(e.target.value)}}
          placeholder="Aca se transcribirá su voz..."
          sx={{
            borderColor: isListening ? "#00BFFF" : "inherit",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              borderColor: isListening ? "#00BFFF" : "inherit",
            },
          }}
        />
         {/* Micrófono animado */}
         <motion.div
          animate={{
            scale: isListening ? [1, 1.4, 1] : 1,
            color: '#00BFFF',
          }}
          transition={isListening ? { duration: 0.9, repeat: Infinity }: undefined}
          style={{
            position: "absolute",
            right: "10px",
            bottom: 0,
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={isListening ? handleStop : handleStart}
        >
          {isListening ? <Microphone size={20} fontSize="large" /> : <MicrophoneSlash fontSize="large" size={20}/>}
        </motion.div>
        <Button
          variant="contained"
          color={isListening ? "secondary" : "primary"}
          onClick={isListening ? handleStop : handleStart}
          disabled={disabled}
          sx={{ mt: 2 }}
        >
          {isListening ? "Detener" : "Iniciar"}
        </Button>
    </Box>
  );
}

export default SpeechToText;
