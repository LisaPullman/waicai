import { WORDS, GuessResponse } from '@/types/game';

export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export async function guessDrawing(imageData: string): Promise<GuessResponse> {
  try {
    const response = await fetch('/api/guess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    if (!response.ok) {
      throw new Error('AI猜测失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('猜测失败:', error);
    throw error;
  }
}

export function checkGuess(userInput: string, targetWord: string): boolean {
  // 简单的相似度检查，可以扩展为更复杂的算法
  return userInput.toLowerCase().includes(targetWord.toLowerCase()) ||
         targetWord.toLowerCase().includes(userInput.toLowerCase());
}