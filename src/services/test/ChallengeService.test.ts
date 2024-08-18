//  useChallenge.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import ChallengeService from "../ChallengeService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ChallengeService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => ChallengeService());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.messages).toEqual([]);
    expect(result.current.finalMessage).toBe(null);
  });

  it("should handle successful API call with multiple pages", async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        data: {
          message: "Page 1",
          nextCursor: "cursor-2",
        },
      } as any)
      .mockResolvedValueOnce({
        data: {
          message: "Page 2",
          nextCursor: null,
        },
      } as any);

    const { result } = renderHook(() => ChallengeService());

    await act(async () => {
      await result.current.startChallenge();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.messages).toEqual(["Page 1", "Page 2"]);
    expect(result.current.finalMessage).toBe("Page 2");
  });

  it("should handle API call failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => ChallengeService());

    await act(async () => {
      await result.current.startChallenge();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to get response. Network Error");
    expect(result.current.messages).toEqual([]);
    expect(result.current.finalMessage).toBe(null);
  });

  it("should handle API call with no nextCursor", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: "Final Page",
        nextCursor: null,
      },
    } as any);

    const { result } = renderHook(() => ChallengeService());

    await act(async () => {
      await result.current.startChallenge();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.messages).toEqual(["Final Page"]);
    expect(result.current.finalMessage).toBe("Final Page");
  });
});
