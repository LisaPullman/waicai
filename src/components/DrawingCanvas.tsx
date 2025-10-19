'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { optimizeForVercel, getImageDataSize } from '@/lib/imageUtils';

interface DrawingCanvasProps {
  onImageChange?: (imageData: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function DrawingCanvas({ onImageChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState('#000000');
  const [isEraserMode, setIsEraserMode] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  // 保存画布状态到历史记录
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    
    setCanvasHistory(prev => {
      const newHistory = [...prev];
      // 如果当前不在历史记录的末尾，删除后面的记录
      const currentIndex = historyIndex;
      if (currentIndex < newHistory.length - 1) {
        newHistory.splice(currentIndex + 1);
      }
      newHistory.push(dataURL);
      
      // 限制历史记录数量
      if (newHistory.length > 20) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      return newIndex > 19 ? 19 : newIndex;
    });
  };

  useEffect(() => {
    if (isInitialized) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布背景为白色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置画笔属性
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 保存初始状态
    const dataURL = canvas.toDataURL();
    setCanvasHistory([dataURL]);
    setHistoryIndex(0);
    setIsInitialized(true);
  }, [isInitialized]);

  // 撤销功能
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const prevIndex = historyIndex - 1;
    const prevState = canvasHistory[prevIndex];
    
    if (prevState) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // 触发图像变化事件
        if (onImageChange) {
          const optimizedImageData = optimizeForVercel(canvas);
          onImageChange(optimizedImageData);
        }
      };
      img.src = prevState;
      setHistoryIndex(prevIndex);
    }
  }, [historyIndex, canvasHistory, onImageChange]);

  // 获取坐标的通用函数
  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      // 触摸事件
      if (e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      }
    } else {
      // 鼠标事件
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    return null;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCoordinates(e);
    if (point) {
      setLastPoint(point);
      draw(e);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPoint = getCoordinates(e);
    if (!currentPoint) return;

    // 设置绘画模式：普通绘画或橡皮擦
    if (isEraserMode) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 1.5; // 橡皮擦稍大一些
    } else {
      ctx.strokeStyle = brushColor;
      ctx.fillStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.globalCompositeOperation = 'source-over';
    }

    if (lastPoint) {
      // 绘制平滑线条
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else {
      // 绘制点
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, (isEraserMode ? brushSize * 1.5 : brushSize) / 2, 0, Math.PI * 2);
      if (isEraserMode) {
        ctx.fill();
      } else {
        ctx.fill();
      }
    }

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();

    // 保存当前状态到历史记录
    saveCanvasState();

    // 触发图像变化事件 - 使用优化的图像压缩
    if (onImageChange) {
      const optimizedImageData = optimizeForVercel(canvas);
      const imageSize = getImageDataSize(optimizedImageData);
      console.log(`图像已压缩，大小: ${imageSize}KB`);
      onImageChange(optimizedImageData);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布并重新设置背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    
    // 重新设置画笔属性
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = brushColor;

    // 保存清空后的状态
    saveCanvasState();

    // 触发图像变化事件 - 使用优化的图像压缩
    if (onImageChange) {
      const optimizedImageData = optimizeForVercel(canvas);
      const imageSize = getImageDataSize(optimizedImageData);
      console.log(`画布已清空，图像大小: ${imageSize}KB`);
      onImageChange(optimizedImageData);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">画笔:</label>
          <input
            type="range"
            min="2"
            max="25"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 sm:w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-gray-600 min-w-[35px]">{brushSize}px</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">颜色:</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            disabled={isEraserMode}
            className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* 橡皮擦按钮 */}
        <button
          onClick={() => setIsEraserMode(!isEraserMode)}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm font-medium ${
            isEraserMode 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
          }`}
        >
          {isEraserMode ? '🖌️ 画笔' : '🧽 橡皮擦'}
        </button>

        {/* 撤销按钮 */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm font-medium"
        >
          ↶ 撤销
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm font-medium"
        >
          🗑️ 清空
        </button>
      </div>

      {/* 画布容器 - 优化iPad适配 */}
      <div className="relative w-full max-w-5xl">
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          className={`w-full h-auto border-2 border-gray-300 rounded-xl bg-white shadow-lg touch-none ${
            isEraserMode ? 'cursor-grab' : 'cursor-crosshair'
          }`}
          style={{ touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* 移动端提示 */}
        <div className="absolute top-2 left-2 sm:hidden">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
            ✋ 用手指绘画
          </div>
        </div>
      </div>
      
      {/* 绘画提示 */}
      <div className="text-center text-xs sm:text-sm text-gray-500 max-w-md">
        💡 提示：在画布上绘制你想要表达的物品，AI会尝试识别你的画作
      </div>
    </div>
  );
}