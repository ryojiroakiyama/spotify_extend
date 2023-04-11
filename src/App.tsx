import './App.css';
import { useEffect, useState } from 'react';
import Profile from './components/profile';
import { redirectToAuthCodeFlow, getAccessToken } from './utils/auth';

const clientId = "fe1e589d3d40496ba962cfb76cbe6ca0"; // Replace with your client id

const menu = {
  profile: "Profile",
  tracks: "Tracks",
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [select, setSelect] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(window.location.search); // Get query params from URL
      const code = params.get("code");

      if (code == null) {
        redirectToAuthCodeFlow(clientId);
      } else if (token === null) {
        checkAccessToken(code);
      }
    }

    fetchData();
  }, []);

  async function checkAccessToken(code: string) {
    const accessToken = await getAccessToken(clientId, code);
    
    // TODO: strictModeによって、useEffectが重複して呼ばれると、getAccessTokenが失敗し、accessTokenがundefinedになる
    // そのため、accessTokenがundefinedの場合は、何もしない, もっと良い方法があるはず。
    if (accessToken) {
      setToken(accessToken);
    }
  }

  if (token === null) {
    return <div>Loading...</div>;
  }

  if (select === null) {
    return (
      <div>
        <button onClick={() => setSelect(menu.profile)}>Profile</button>
        <button onClick={() => setSelect(menu.tracks)}>Tracks</button>
      </div>
    )
  }

  return (
    <>
      {select === menu.profile && <Profile token={token} />}
      {select === menu.tracks && <div>Tracks</div>}
    </>
  );
}

export default App;
