// AI Service for summarization and recommendations
const OPENAI_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyCxFyIy_WwzhjyWODvd3LBv2oTiuK4L-Qs";

export const generateSimpleSummary = async (technicalText: string): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical expert who explains complex research in simple, patient-friendly language. Keep summaries under 100 words."
          },
          {
            role: "user",
            content: `Simplify this medical research abstract for a patient to understand: ${technicalText}`
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary not available at this time.";
  }
};

export const summarizeClinicalTrial = async (description: string): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Summarize clinical trials in clear, accessible language focusing on what patients need to know."
          },
          {
            role: "user",
            content: `Summarize this clinical trial: ${description}`
          }
        ],
        max_tokens: 120
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing trial:", error);
    return "Summary not available.";
  }
};

export const getChatResponse = async (message: string, conversationHistory: any[] = []): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are CuraLink AI Assistant, helping patients and researchers find medical information, experts, clinical trials, and publications. Be helpful, concise, and empathetic."
          },
          ...conversationHistory,
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I'm having trouble connecting right now. Please try again.";
  }
};
