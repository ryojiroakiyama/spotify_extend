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
    const resText = completion.data.choices[0].text;
    return resText?.trim();
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
  return `You are an AI assistant.
  Please understand the following information and respond appropriately to the user's input.
  
  App Specifications: 1.
  1: Displays a list of detailed information about the user's saved songs.
  2: Highlight songs in 1 that do not belong to any playlist.
  3: Displays only songs from 1 that do not belong to any playlist.
  
  AI Assistant Output Requirements:.
  Answer the user's input with the number that applies to the condition shown below and a response sentence.
  If the user is asking for app spec 1: 1
  If the user is asking for app specification 2: 2
  User wants app spec 3: 3
  If additional information is required: 4
  User wants something other than app specs: 5
  
  User: Please show me information about my stored songs.
  
  AI Assistant: 1, got it. I'll list detailed information about your saved songs.
  
  User: Please make it clear which of my songs do not belong to a playlist.
  
  AI Assistant: 2, Got it. Highlight the songs in your store that do not belong to any playlists.
  
  User: Please tell me only the songs in my store that do not belong to any playlists.
  
  AI Assistant: 3, Got it. It will only show you songs that do not belong to any playlist among your saved songs.
  
  User: Please show me songs that do not belong to any playlist among my saved songs.
  
  AI Assistant: 4, Do you want to highlight songs that do not belong to any playlist among your saved songs? Or do you want to show only the relevant songs?
  
  User: Please tell me only the relevant songs.
  
  AI Assistant: 3, Got it. We will only show songs that do not belong to any playlist among your saved songs.
  
  User: Please tell me the song that makes you calm down.
  
  AI Assistant: How about "5, Clair de Lune" (Debussy)?
  
  User: ${input}

  AI Assistant: `;
}
