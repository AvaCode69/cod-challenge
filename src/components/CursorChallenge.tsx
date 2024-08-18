//  CursorChallenge.tsx

import ChallengeService from "../services/ChallengeService";

function CursorChallenge(): JSX.Element {
  const { loading, error, messages, finalMessage, startChallenge } =
    ChallengeService();

  return (
    <div className="container">
      <h1>Data Booster Challenge</h1>
      <button onClick={startChallenge} disabled={loading}>
        Start Challenge
      </button>

      {loading && <div className="spinner"></div>}

      {error && <div className="error">{error}</div>}

      {messages.length > 0 && (
        <div>
          <h2>Messages:</h2>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                {index} {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {finalMessage && (
        <div className="final-message">
          <h2>Flag Found:</h2>
          <div>{finalMessage}</div>
        </div>
      )}
    </div>
  );
}

export default CursorChallenge;
