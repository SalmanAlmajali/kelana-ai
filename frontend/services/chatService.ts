const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Conversation {
  id: number;
  title: string;
  user_id: number;
}

export interface ChatMessage {
  id?: number;
  content: string;
  role: 'user' | 'assistant';
  conversation_id?: number;
  created_at?: string;
}

export class ChatService {
  static async createConversation(title: string, serverToken?: string): Promise<Conversation> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }

  static async getConversations(serverToken?: string): Promise<Conversation[]> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }

  static async getConversation(id: number, serverToken?: string): Promise<Conversation> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }

  static async updateConversation(id: number, title: string, serverToken?: string): Promise<Conversation> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }

  static async deleteConversation(id: number, serverToken?: string): Promise<void> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }
  }

  static async sendMessage(conversationId: number, content: string, serverToken?: string): Promise<ChatMessage> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }
  
  static async getMessages(conversationId: number, serverToken?: string): Promise<ChatMessage[]> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/conversations/${conversationId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    const json = await response.json();
    return json.data;
  }

  static buildError(errorData: any, response: Response): Error {
    const errorMessage = errorData?.detail || errorData?.message || `Server returned ${response.status}`;
    return new Error(errorMessage);
  }

  static handleError(error: unknown): string {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error instanceof Error) {
      return error.message || "Unable to send message. Please try again.";
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  }
}
