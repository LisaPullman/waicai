'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import MobileOptimized from '@/components/MobileOptimized';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AIGuessLoader } from '@/components/LoadingSpinner';
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
    <ErrorBoundary>
      <MobileOptimized>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto game-container">
        {/* 品牌标题 */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide shadow-lg">
              🦊 FOXAI
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            AI 你画我猜
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            让 AI 来猜猜你画的是什么！体验智能识别的魅力
          </p>
        </div>

        {/* 游戏状态栏 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 min-w-[80px]">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">回合</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{gameState.round}</p>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 min-w-[80px]">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">得分</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{gameState.score}</p>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 min-w-[100px]">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">状态</p>
                <p className="text-sm sm:text-lg font-semibold text-purple-600">{
                  gameState.gameStatus === 'waiting' ? '等待开始' :
                  gameState.gameStatus === 'drawing' ? '绘画中' :
                  gameState.gameStatus === 'guessing' ? 'AI思考中' : '结果显示'
                }</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {gameState.gameStatus === 'waiting' && (
                <button
                  onClick={startNewGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  🎮 开始游戏
                </button>
              )}
              {gameState.gameStatus === 'result' && (
                <button
                  onClick={startNextRound}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  ➡️ 下一轮
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 显示词汇 */}
        {showWord && gameState.currentWord && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg animate-pulse">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">🎯 请画这个：</h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">{gameState.currentWord}</p>
              <p className="text-xs sm:text-sm text-yellow-600 mt-2">💡 词汇将在3秒后消失</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* 绘画区域 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">🎨 绘画区域</h2>
            <DrawingCanvas onImageChange={handleImageChange} />
            <div className="mt-4 text-center">
              {gameState.gameStatus === 'drawing' && (
                <button
                  onClick={handleGuess}
                  disabled={gameState.isGuessing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  {gameState.isGuessing ? '🤖 AI思考中...' : '🔍 让AI猜测'}
                </button>
              )}
            </div>
          </div>

          {/* AI猜测结果 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">🤖 AI猜测结果</h2>
            <div className="min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
              {gameState.gameStatus === 'waiting' && (
                <div className="text-center text-gray-500">
                  <div className="text-4xl sm:text-6xl mb-4">🎮</div>
                  <p className="text-sm sm:text-base">点击 &ldquo;开始游戏&rdquo; 按钮开始游戏</p>
                </div>
              )}
              {gameState.gameStatus === 'drawing' && (
                <div className="text-center text-gray-500">
                  <div className="text-4xl sm:text-6xl mb-4">🎨</div>
                  <p className="text-sm sm:text-base">正在绘画中...</p>
                  <p className="text-xs sm:text-sm mt-2">画完后点击 &ldquo;让AI猜测&rdquo; 按钮</p>
                </div>
              )}
              {gameState.gameStatus === 'guessing' && (
                <AIGuessLoader />
              )}
              {gameState.gameStatus === 'result' && (
                <div className="text-center">
                  <div className="mb-6">
                    <p className="text-sm sm:text-lg text-gray-600 mb-2">🤖 AI猜的是：</p>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 sm:p-4 mb-4">
                      <p className="text-lg sm:text-2xl font-bold text-purple-600">{gameState.aiGuess}</p>
                    </div>
                    <p className="text-sm sm:text-lg">
                      ✅ 正确答案是：<span className="font-bold text-green-600 text-lg sm:text-xl">{gameState.currentWord}</span>
                    </p>
                  </div>
                  {gameState.aiGuess.includes(gameState.currentWord) ? (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 shadow-md">
                      <p className="font-semibold text-sm sm:text-base">🎉 恭喜！AI猜对了！+10分</p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 shadow-md">
                      <p className="font-semibold text-sm sm:text-base">😅 AI没猜对，继续加油！</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 游戏说明和品牌信息 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-4 sm:p-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🎮 游戏说明</h3>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li className="flex items-start gap-2"><span className="text-blue-500">1️⃣</span> 点击 &ldquo;开始游戏&rdquo; 按钮开始新游戏</li>
                <li className="flex items-start gap-2"><span className="text-blue-500">2️⃣</span> 记住显示的词汇，然后在画布上画出这个物品</li>
                <li className="flex items-start gap-2"><span className="text-blue-500">3️⃣</span> 画完后点击 &ldquo;让AI猜测&rdquo; 按钮</li>
                <li className="flex items-start gap-2"><span className="text-blue-500">4️⃣</span> 如果AI猜对了，你将获得10分</li>
                <li className="flex items-start gap-2"><span className="text-blue-500">5️⃣</span> 点击 &ldquo;下一轮&rdquo; 继续游戏</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🦊 关于 FOXAI</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm sm:text-base mb-2">
                  FOXAI 致力于创造有趣的 AI 交互体验，让人工智能更贴近生活。
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  💡 本游戏使用硅基流动 Qwen3-VL-30B-A3B-Instruct 提供智能识别服务
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
        </main>
      </MobileOptimized>
    </ErrorBoundary>
  );
}