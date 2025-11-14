import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Vapi from "@vapi-ai/web";

const VAPI_API_KEY = "8c91c3b0-bdef-4ceb-aec7-77f6653e8185";
const ASSISTANT_ID = "350e5c66-88a2-493d-9958-a2b955ad94de";

export const VapiVoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const vapiRef = useRef<Vapi | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize VAPI
    vapiRef.current = new Vapi(VAPI_API_KEY);

    // Set up event listeners
    vapiRef.current.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setIsListening(true);
      setTranscript("Voice assistant is listening...");
    });

    vapiRef.current.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsListening(false);
      setTranscript("");
    });

    vapiRef.current.on("speech-start", () => {
      console.log("User started speaking");
      setTranscript("Listening to your voice...");
    });

    vapiRef.current.on("speech-end", () => {
      console.log("User stopped speaking");
      setTranscript("Processing your request...");
    });

    vapiRef.current.on("message", (message: any) => {
      console.log("Message received:", message);
      if (message.type === "transcript" && message.transcript) {
        setTranscript(message.transcript);
      } else if (message.type === "function-call") {
        setTranscript(`Executing: ${message.functionCall.name}`);
      }
    });

    vapiRef.current.on("error", (error: any) => {
      console.error("VAPI Error:", error);
      toast({
        title: "Voice Assistant Error",
        description: "There was an issue with the voice assistant. Please try again.",
        variant: "destructive",
      });
      setIsConnected(false);
      setIsListening(false);
      setTranscript("Error: Unable to connect");
    });

    // Load saved state
    const savedState = sessionStorage.getItem("vapiOpen");
    if (savedState === "true") {
      setIsOpen(true);
    }

    // Cleanup
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [toast]);

  useEffect(() => {
    sessionStorage.setItem("vapiOpen", isOpen.toString());
  }, [isOpen]);

  const startCall = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (vapiRef.current) {
        await vapiRef.current.start(ASSISTANT_ID);
        toast({
          title: "Voice Assistant Active",
          description: "You can now speak to the assistant.",
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use the voice assistant.",
        variant: "destructive",
      });
      setTranscript("Error: Microphone access denied");
      setIsListening(false);
      setIsConnected(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setIsListening(false);
    setIsConnected(false);
    setTranscript("");
    toast({
      title: "Call Ended",
      description: "Voice assistant session ended.",
    });
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isListening);
      setIsListening(!isListening);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <Mic className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-4 w-80 shadow-xl z-50 animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Voice Assistant
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {transcript && (
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground min-h-[60px]">
              {transcript}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {!isConnected ? (
              <Button onClick={startCall} className="gap-2 w-full">
                <Mic className="h-4 w-4" />
                Start Voice Call
              </Button>
            ) : (
              <>
                <Button
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleMute}
                  className="gap-2 flex-1"
                >
                  {isListening ? (
                    <>
                      <Mic className="h-4 w-4 animate-pulse" />
                      Listening
                    </>
                  ) : (
                    <>
                      <MicOff className="h-4 w-4" />
                      Muted
                    </>
                  )}
                </Button>
                <Button variant="destructive" onClick={endCall} className="gap-2">
                  <PhoneOff className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p className="font-medium">Try saying:</p>
            <p>"Find experts for Parkinson's Disease"</p>
            <p>"Search clinical trials near me"</p>
            <p>"Show latest publications"</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
