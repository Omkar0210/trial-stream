// n8n Webhook Integration
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/ca5d7c57-8e03-4009-ba66-c5d493488908";

export interface N8nEventPayload {
  eventType: string;
  payload: any;
  timestamp?: string;
  userId?: string;
}

export async function sendToN8n(eventType: string, payload: any): Promise<void> {
  try {
    const data: N8nEventPayload = {
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem("userId") || "anonymous"
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.warn(`n8n webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending to n8n:", error);
    // Fail silently to not disrupt user experience
  }
}

// Helper functions for common events
export const n8nEvents = {
  userSignup: (userData: any) => sendToN8n("user_signup", userData),
  expertFollowed: (expertId: string, expertName: string) => sendToN8n("expert_followed", { expertId, expertName }),
  trialFavorited: (trialId: string, trialTitle: string) => sendToN8n("trial_favorited", { trialId, trialTitle }),
  publicationSaved: (publicationId: string, publicationTitle: string) => sendToN8n("publication_saved", { publicationId, publicationTitle }),
  meetingRequested: (expertId: string, expertName: string, requestDetails: any) => sendToN8n("meeting_requested", { expertId, expertName, requestDetails }),
  forumPostCreated: (postId: string, postTitle: string, category: string) => sendToN8n("forum_post_created", { postId, postTitle, category }),
  searchPerformed: (searchType: string, query: string, resultsCount: number) => sendToN8n("search_performed", { searchType, query, resultsCount }),
  aiChatMessage: (message: string, response: string) => sendToN8n("ai_chat_message", { message, response }),
  accountTypeChanged: (fromType: string, toType: string) => sendToN8n("account_type_changed", { fromType, toType })
};
