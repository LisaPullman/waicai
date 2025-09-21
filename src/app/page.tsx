'use client';

import { useState, useEffect } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import { GameState, GuessResponse } from '@/types/game';
import { getRandomWord, guessDrawing } from '@/lib/gameLogic';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: '',
    aiGuess: '',
    isGuessing: false,
    score: 0,
    round: 1,
    gameStatus: 'waiting'
  });

  const [imageData, setImageData] = useState<string>('');
  const [showWord, setShowWord] = useState(false);

  // 开始新游戏
  const startNewGame = () => {
    const newWord = getRandomWord();
    setGameState({
      currentWord: newWord,
      aiGuess: '',
      isGuessing: false,
      score: 0,
      round: 1,
      gameStatus: 'waiting'
    });
    setShowWord(true);
    setTimeout(() => setShowWord(false), 3000); // 3秒后隐藏词汇
  };

  // 开始下一轮
  const startNextRound = () => {
    const newWord = getRandomWord();
    setGameState(prev => ({
      ...prev,
      currentWord: newWord,
      aiGuess: '',
      isGuessing: false,
      round: prev.round + 1,
      gameStatus: 'waiting'
    }));
    setShowWord(true);
    setTimeout(() => setShowWord(false), 3000);
  };

  // 处理图像变化
  const handleImageChange = (newImageData: string) => {
    setImageData(newImageData);
    if (gameState.gameStatus === 'waiting') {
      setGameState(prev => ({ ...prev, gameStatus: 'drawing' }));
    }
  };

  // 让AI猜测
  const handleGuess = async () => {
    if (!imageData) return;

    setGameState(prev => ({ ...prev, isGuessing: true, gameStatus: 'guessing' }));

    try {
      const result: GuessResponse = await guessDrawing(imageData);
      setGameState(prev => ({
        ...prev,
        aiGuess: result.guess,
        isGuessing: false,
        gameStatus: 'result',
        score: prev.score + (result.guess.includes(prev.currentWord) ? 10 : 0)
      }));
    } catch (error) {
      console.error('猜测失败:', error);
      setGameState(prev => ({
        ...prev,
        aiGuess: '识别失败，请重试',
        isGuessing: false,
        gameStatus: 'result'
      }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI 你画我猜</h1>
          <p className="text-gray-600">让AI来猜猜你画的是什么！</p>
        </div>

        {/* 游戏状态栏 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">回合</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.round}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">得分</p>
                <p className="text-2xl font-bold text-green-600">{gameState.score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">状态</p>
                <p className="text-lg font-semibold text-purple-600">{
                  gameState.gameStatus === 'waiting' ? '等待开始' :
                  gameState.gameStatus === 'drawing' ? '绘画中' :
                  gameState.gameStatus === 'guessing' ? 'AI思考中' : '结果显示'
                }</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {gameState.gameStatus === 'waiting' && (
                <button
                  onClick={startNewGame}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  开始游戏
                </button>
              )}
              {gameState.gameStatus === 'result' && (
                <button
                  onClick={startNextRound}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  下一轮
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 显示词汇 */}
        {showWord && gameState.currentWord && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">请画这个：</h2>
              <p className="text-3xl font-bold text-yellow-900">{gameState.currentWord}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 绘画区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">绘画区域</h2>
            <DrawingCanvas onImageChange={handleImageChange} />
            <div className="mt-4 text-center">
              {gameState.gameStatus === 'drawing' && (
                <button
                  onClick={handleGuess}
                  disabled={gameState.isGuessing}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {gameState.isGuessing ? 'AI思考中...' : '让AI猜测'}
                </button>
              )}
            </div>
          </div>

          {/* AI猜测结果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">AI猜测结果</h2>
            <div className="min-h-[300px] flex items-center justify-center">
              {gameState.gameStatus === 'waiting' && (
                <div className="text-center text-gray-500">
                  <p>点击"开始游戏"按钮开始游戏</p>
                </div>
              )}
              {gameState.gameStatus === 'drawing' && (
                <div className="text-center text-gray-500">
                  <p>正在绘画中...</p>
                  <p className="text-sm mt-2">画完后点击"让AI猜测"按钮</p>
                </div>
              )}
              {gameState.gameStatus === 'guessing' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-purple-600">AI正在分析你的画作...</p>
                </div>
              )}
              {gameState.gameStatus === 'result' && (
                <div className="text-center">
                  <div className="mb-6">
                    <p className="text-lg text-gray-600 mb-2">AI猜的是：</p>
                    <p className="text-2xl font-bold text-purple-600 mb-4">{gameState.aiGuess}</p>
                    <p className="text-lg">
                      正确答案是：<span className="font-bold text-green-600">{gameState.currentWord}</span>
                    </p>
                  </div>
                  {gameState.aiGuess.includes(gameState.currentWord) ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      <p className="font-semibold">🎉 AI猜对了！+10分</p>
                    </div>
                  ) : (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      <p className="font-semibold">😅 AI没猜对，继续加油！</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 游戏说明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">游戏说明</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>点击"开始游戏"按钮开始新游戏</li>
            <li>记住显示的词汇，然后在画布上画出这个物品</li>
            <li>画完后点击"让AI猜测"按钮</li>
            <li>如果AI猜对了，你将获得10分</li>
            <li>点击"下一轮"继续游戏</li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            💡 提示：请在.env.local文件中设置GEMINI_API_KEY环境变量
          </p>
        </div>
      </div>
    </main>
  );
}