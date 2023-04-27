import { useState } from "react";

import { menu, TrackViewMode } from "../containers/home";

import Generate from "./generate";

interface Props {
  setSelect: React.Dispatch<React.SetStateAction<string | null>>;
  setMode: React.Dispatch<React.SetStateAction<TrackViewMode>>;
}

export default function Chat(props: Props) {
  const { setSelect, setMode } = props;
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

      chatToAction(resText);
      setInput("");
    } catch(error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function parseResponse(resText: string) {
    const regex = /^(\d+),\s+(.*)$/;
    const matches = resText.match(regex);
    if (!matches) {
      return null;
    }
    const number = matches[1];
    const sentence = matches[2];

    return { number, sentence };
  }

  function chatToAction(resText: string) {
    const { number, sentence } = parseResponse(resText)!;

    switch (number) {
      case "1":
        console.log("action: 1");
        setSelect(menu.listTracks);
        setMode(TrackViewMode.DEFAULT);
        break;
      case "2":
        setSelect(menu.listTracks);
        setMode(TrackViewMode.HIGHLIGHT_NOT_IN_PLAYLIST);
        console.log("action: 2");
        break;
      case "3":
        setSelect(menu.listTracks);
        setMode(TrackViewMode.ONLY_NOT_IN_PLAYLIST);
        console.log("action: 3");
        break;
      case "4":
        console.log("action: 4");
        break;
      case "5":
        console.log("action: 5");
        break;
      default:
        console.log("action: default");
        break;
    }
    setResult(sentence);
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
