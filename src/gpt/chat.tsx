import { useState } from "react";
import Generate from "./generate";

//MEMO: chatの組み込む手順
//      1. 新たにそれ用のコンポーネントを作成する
//      2. コンポーネント内では、chatの入力フォーム, chatの返り値をパースする処理, パース結果から特定の処理を行う処理を記述する
export default function Chat() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const reqText = JSON.stringify({ animal: animalInput });
      const resText = await Generate(reqText);

      if (!resText) {
        throw new Error("Failed to generate names");
      }

      setResult(resText);
      setAnimalInput("");
    } catch(error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div>result: {result}</div>
    </>
  );
}
