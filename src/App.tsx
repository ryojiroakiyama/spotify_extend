import './App.css';
import { useEffect, useState } from 'react';
import { redirectToAuthCodeFlow, getAccessToken } from './utils/auth';
import Home from './containers/home';

const clientId = "fe1e589d3d40496ba962cfb76cbe6ca0"; // Replace with your client id

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(window.location.search); // Get query params from URL
      const code = params.get("code");

      if (code == null) {
        redirectToAuthCodeFlow(clientId);
      } else {
        checkAccessToken(code);
      }
    }

    fetchData();
  }, []);

  async function checkAccessToken(code: string) {
    const accessToken = await getAccessToken(clientId, code);
    
    // MEMO: strictModeによって二度レンダリングが行われる->重複してリクエストを送ると二度目が失敗する。
    //       そのため、undefinedのaccessTokenのsetを防ぐためにこうしているが、リクエスト自体を一回にしたい。
    //       レンダリング自体が二度行われるので、既に取得したかどうかのステートを用意しても一度目と二度目でそのステートを共有できないので(二度目はステートが再定義される)、判定する術がわからない。
    if (accessToken) {
      setToken(accessToken);
    }
  }

  return (
    <>
      {token === null ? 
        <div>Loading ...</div>
        :
        <Home token={token} />
      }
    </>
  );
}

export default App;
