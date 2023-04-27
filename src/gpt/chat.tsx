import { useState } from "react";
import Generate from "./generate";

export default function Chat() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const reqText = JSON.stringify({ input });
      const resText = await Generate(reqText);

      if (!resText) {
        throw new Error("Failed to chat with AI assistant");
      }

      setResult(resText);
      setInput("");
    } catch(error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
        <h3>Chat with an AI Assistant</h3>
        <form onSubmit={onSubmit}>
          <div>
            <textarea
              name="animal"
              style={{ height: 100, width: 300 }}
              placeholder="Ask me anything or just say hi!"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div>
            <input type="submit" value="submit" />
          </div>
        </form>
        <div style={{margin: '10px'}}>response:</div>
        <div style={{margin: '5px'}}>{result}</div>
    </>
  );
}
