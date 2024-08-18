//  ChallengeService.ts
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { apiUrl, bearerToken } from "../utils/constants";

export interface ApiResponse {
  message: string;
  nextCursor?: string;
}

const ChallengeService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [finalMessage, setFinalMessage] = useState<string | null>(null);

  const startChallenge = async () => {
    setLoading(true);
    setError(null);
    setMessages([]);
    setFinalMessage(null);

    let currentCursor: string | null = null;

    while (true) {
      try {
        const response: AxiosResponse<ApiResponse> =
          await axios.post<ApiResponse>(
            apiUrl,
            { cursor: currentCursor },
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
              },
            }
          );

        const data = response.data;
        setMessages((prevMessages) => [...prevMessages, data.message]);

        if (!data.nextCursor) {
          setFinalMessage(data.message);
          break;
        }

        currentCursor = data.nextCursor;
      } catch (err: any) {
        setError(`Failed to get response. ${err.message}`);
        break;
      }
    }

    setLoading(false);
  };

  return {
    loading,
    error,
    messages,
    finalMessage,
    startChallenge,
  };
};

export default ChallengeService;
