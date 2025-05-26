import words from './words.json';

export async function getRandomWord(): Promise<string> {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const data = await response.json();
    if (Array.isArray(data) && data[0]) {
      // Ensure all lowercase for comparison
      return data[0].toLowerCase();
    }
    throw new Error('Invalid response');
  } catch {
    // Fallback to local word list
    const rand = Math.floor(Math.random() * words.length);
    return words[rand].toLowerCase();
  }
}
