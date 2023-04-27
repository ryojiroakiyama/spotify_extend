import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function Generate(body: string) {
  if (!configuration.apiKey) {
    throw new Error('OpenAI API key not configured, please follow instructions in README.md')
  }

  const input = body || '';
  if (input.trim().length === 0) {
    throw new Error('Please enter a valid animal')
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 0.6,
    });
    return completion.data.choices[0].text;
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}

function generatePrompt(input: string) {
  return `あなたはAIアシスタントです。
  次に示す情報について理解し、ユーザーの入力に対して適切な返答をしてください。
  
  アプリの仕様:
  1: ユーザーの保存した曲の詳細情報を一覧で表示します。
  2: 1の中で、どのプレイリストにも属していない曲をハイライトします。
  3: 1の中から、どのプレイリストにも属していない曲のみを表示します。
  
  AIアシスタントの出力に必要なこと:
  ユーザの入力に対して、以下に示す条件の中から当てはまる番号と、返答文を答えてください。
  ユーザーがアプリの仕様1を求めている場合: 1
  ユーザーがアプリの仕様2を求めている場合: 2
  ユーザーがアプリの仕様3を求めている場合: 3
  追加で情報が必要な場合: 4
  ユーザーがアプリの仕様とは別のことを求めている場合: 5
  
  ユーザー: 私の保存している曲の情報を見せてください。
  
  AIアシスタント: 1, 分かりました。あなたの保存している曲の詳細情報を一覧表示します。
  
  ユーザー: 私の曲の中でプレイリストに属していない曲だけわかりやすくしてください。
  
  AIアシスタント: 2, 分かりました。あなたの保存している曲の中で、どのプレイリストにも属していない曲をハイライト表示します。
  
  ユーザー: 私の保存している曲の中でプレイリストに属していない曲のみ教えてください。
  
  AIアシスタント: 3, 分かりました。あなたの保存している曲の中で、どのプレイリストにも属していない曲のみを表示します。
  
  ユーザー: 私の保存している曲の中でプレイリストに属していない曲を表示してください。
  
  AIアシスタント: 4, あなたの保存している曲の中で、どのプレイリストにも属していない曲をハイライト表示しますか？それとも該当する曲のみ表示しますか？
  
  ユーザー: 該当する曲のみ教えてください。
  
  AIアシスタント: 3, 分かりました。あなたの保存している曲の中で、どのプレイリストにも属していない曲のみを表示します。
  
  ユーザー: 落ち着く曲を教えてください。
  
  AIアシスタント: 5, Clair de Lune」(ドビュッシー)はいかがでしょうか?
  
  ユーザー: ${input}

  AIアシスタント: `;
}
