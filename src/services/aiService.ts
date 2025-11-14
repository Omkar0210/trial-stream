// AI Service for summarization and recommendations using OpenAI
const OPENAI_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyCxFyIy_WwzhjyWODvd3LBv2oTiuK4L-Qs";

// Helper to check if API is available
const isOpenAIAvailable = () => Boolean(OPENAI_API_KEY);

export const generateSimpleSummary = async (technicalText: string): Promise<string> => {
  if (!isOpenAIAvailable()) {
    return "AI summarization requires API configuration. This is a placeholder summary of the technical content above.";
  }

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
            content: "You are a medical expert who explains complex research in simple, patient-friendly language. Keep summaries under 100 words. Use clear, everyday language."
          },
          {
            role: "user",
            content: `Simplify this medical research abstract for a patient to understand: ${technicalText}`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "This research explores new approaches to treatment. For a detailed explanation, please consult with your healthcare provider.";
  }
};

export const summarizeClinicalTrial = async (description: string): Promise<string> => {
  if (!isOpenAIAvailable()) {
    return "This trial is testing a new treatment approach. Contact the study coordinator for more information.";
  }

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
            content: "Summarize clinical trials in clear, accessible language focusing on what patients need to know: what's being tested, who can participate, and potential benefits."
          },
          {
            role: "user",
            content: `Summarize this clinical trial for a patient: ${description}`
          }
        ],
        max_tokens: 120,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing trial:", error);
    return "This study is exploring new treatment options. Please review the full details or contact the research team.";
  }
};

export const getChatResponse = async (message: string, conversationHistory: any[] = []): Promise<string> => {
  if (!isOpenAIAvailable()) {
    // Provide intelligent fallback responses
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("expert") || lowerMessage.includes("researcher") || lowerMessage.includes("doctor")) {
      return "I can help you find experts! Try using the 'Find Experts' page to search for researchers by specialty or disease area.";
    } else if (lowerMessage.includes("trial") || lowerMessage.includes("clinical")) {
      return "You can find clinical trials on the 'Clinical Trials' page. Use filters to find trials near your location or for specific conditions.";
    } else if (lowerMessage.includes("publication") || lowerMessage.includes("research") || lowerMessage.includes("paper")) {
      return "Check out the 'Publications' section to find the latest research papers. You can search by keywords, disease, or author.";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm your CuraLink AI Assistant. I can help you navigate the platform, find experts, discover clinical trials, and access research publications. What would you like to know?";
    } else {
      return "I'm here to help you navigate CuraLink! You can search for medical experts, explore clinical trials, read research publications, or connect with the research community. What are you interested in?";
    }
  }

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
            content: "You are CuraLink AI Assistant, helping patients and researchers navigate a medical research platform. You can help them find medical experts, clinical trials, publications, and answer questions about medical research. Be helpful, concise, empathetic, and encouraging. When suggesting actions, mention specific platform features like 'Find Experts', 'Clinical Trials', 'Publications', 'Forums', and 'Favourites' pages. Keep responses under 100 words."
          },
          ...conversationHistory,
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I'm having trouble connecting to my AI service right now. Please try again in a moment, or use the navigation menu to explore the platform.";
  }
};
