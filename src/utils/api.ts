export async function fetchWebApi(url: string, token: string) {
    const res = await fetch(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();  
}

export async function fetchWebApiEndpoint(endpoint: string, token: string) {
  const url = spotifyUrl(endpoint);
  const res = await fetch(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();  
}

export async function postWebApiEndpoint(endpoint: string, token: string, data: object) {
  const url = spotifyUrl(endpoint);
  const res = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
  });

  return await res.json();
}

function spotifyUrl(endpoint: string) {
    return `https://api.spotify.com/${endpoint}`;
}

export async function fetchAllItems(endpoint: string, token: string) {
  let url: string | null = spotifyUrl(endpoint) + "?offset=0&limit=50";
  let items: any[] = [];

  while (url !== null) {
      const response: any = await fetchWebApi(url, token);
      if (response.error && response.error.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (response.error) {
        throw new Error(response.error.message);
      }
      items = items.concat(response.items);
      url = response.next;
  }

  return items;
}
