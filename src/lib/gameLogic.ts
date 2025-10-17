import { WORDS, GuessResponse } from '@/types/game';

export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export async function guessDrawing(imageData: string): Promise<GuessResponse> {
  try {
    console.log('开始发送AI猜测请求...');
    
    const response = await fetch('/api/guess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    });

    console.log('API响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', errorText);
      throw new Error(`AI猜测失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('AI猜测成功:', data);
    return data;
  } catch (error) {
    console.error('猜测过程中出错:', error);
    throw error;
  }
}

export function checkGuess(userInput: string, targetWord: string): boolean {
  // 简单的相似度检查，可以扩展为更复杂的算法
  return userInput.toLowerCase().includes(targetWord.toLowerCase()) ||
         targetWord.toLowerCase().includes(userInput.toLowerCase());
}