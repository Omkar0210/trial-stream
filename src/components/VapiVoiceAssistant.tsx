import { useState, useEffect } from "react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VAPI_API_KEY = "8c91c3b0-bdef-4ceb-aec7-77f6653e8185";
const ASSISTANT_ID = "350e5c66-88a2-493d-9958-a2b955ad94de";

export const VapiVoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const savedState = sessionStorage.getItem("vapiOpen");
    if (savedState === "true") {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("vapiOpen", isOpen.toString());
  }, [isOpen]);

  const startCall = async () => {
    try {
      setIsListening(true);
      setIsConnected(true);
      setTranscript("Voice assistant is listening...");
      
      // In production, initialize VAPI SDK here
      console.log("Starting VAPI call with Assistant ID:", ASSISTANT_ID);
    } catch (error) {
      console.error("Error starting call:", error);
      setTranscript("Error connecting to voice assistant");
      setIsListening(false);
      setIsConnected(false);
    }
  };

  const endCall = () => {
    setIsListening(false);
    setIsConnected(false);
    setTranscript("");
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
            <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              {transcript}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {!isConnected ? (
              <Button onClick={startCall} className="gap-2">
                <Mic className="h-4 w-4" />
                Start Voice Call
              </Button>
            ) : (
              <>
                <Button
                  variant={isListening ? "default" : "outline"}
                  onClick={() => setIsListening(!isListening)}
                  className="gap-2"
                >
                  {isListening ? (
                    <>
                      <Mic className="h-4 w-4 animate-pulse" />
                      Listening...
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
                  End Call
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Say "Find experts for [condition]" or "Search clinical trials"
          </p>
        </div>
      </div>
    </Card>
  );
};
