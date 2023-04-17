import './App.css';
import { useEffect, useState } from 'react';
import Profile from './components/profile';
import { redirectToAuthCodeFlow, getAccessToken } from './utils/auth';
import Tracks from './components/tracks';
import Chat from './components/chat';

const clientId = "fe1e589d3d40496ba962cfb76cbe6ca0"; // Replace with your client id

const menu = {
  home: "Home",
  profile: "Profile",
  tracks: "Tracks",
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [select, setSelect] = useState<string>(menu.home);

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

  if (token === null) {
    return <div>Loading token ...</div>;
  }

  if (select === menu.home) {
    return (
      <div>
        <button onClick={() => setSelect(menu.profile)}>Profile</button>
        <button onClick={() => setSelect(menu.tracks)}>Tracks</button>
        <Chat />
      </div>
    )
  }

  return (
    <>
      {select === menu.profile && <Profile token={token} />}
      {select === menu.tracks && <Tracks token={token} />}
    </>
  );
}

export default App;
