export async function fetchWebApi(url: string, token: string) {
    const res = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();  
}

export function spotifyUrl(endpoint: string) {
    return `https://api.spotify.com/${endpoint}`;
}

export async function fetchAllItems(endpoint: string, token: string) {
  let url: string | null = spotifyUrl(endpoint) + "?offset=0&limit=50";
  let items: any[] = [];

  while (url !== null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));//TODO: 調節またはロジック変更
      const response: any = await fetchWebApi(url, token);
      items = items.concat(response.items);
      url = response.next;
  }

  return items;
}
