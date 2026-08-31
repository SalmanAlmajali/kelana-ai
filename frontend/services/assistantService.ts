const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AssistantResponse {
  status: boolean;
  message: string;
  data: {
    query: string;
    response: {
      content: {
        text: string;
      };
      location: {
        type: string;
        s3Location?: {
          uri: string;
        };
      };
      score: number;
    };
  };
}

export class AssistantService {
  static async askQuestion(query: string, serverToken?: string): Promise<AssistantResponse> {
    const token = serverToken || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);

    const response = await fetch(`${apiUri}/api/v1/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw this.buildError(errorData, response);
    }

    return response.json();
  }

  static buildError(errorData: any, response: Response): Error {
    const errorMessage = errorData?.detail || errorData?.message || `Server returned ${response.status}`;
    return new Error(errorMessage);
  }

  static handleError(error: unknown): string {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error instanceof Error) {
      return error.message || "Unable to get an answer. Please try again.";
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  }
}
