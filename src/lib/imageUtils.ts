/**
 * 图像处理工具函数
 * 用于优化 Canvas 图像数据，减少传输大小
 */

export interface ImageCompressionOptions {
  quality: number; // 0-1 之间
  maxWidth: number;
  maxHeight: number;
  format: 'jpeg' | 'png' | 'webp';
}

/**
 * 压缩 Canvas 图像数据
 */
export function compressCanvasImage(
  canvas: HTMLCanvasElement,
  options: Partial<ImageCompressionOptions> = {}
): string {
  const {
    quality = 0.8,
    maxWidth = 800,
    maxHeight = 600,
    format = 'jpeg'
  } = options;

  // 创建临时 canvas 进行缩放
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    return canvas.toDataURL();
  }

  // 计算缩放比例
  const scale = Math.min(
    maxWidth / canvas.width,
    maxHeight / canvas.height,
    1 // 不放大
  );

  tempCanvas.width = canvas.width * scale;
  tempCanvas.height = canvas.height * scale;

  // 设置高质量缩放
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'high';

  // 绘制缩放后的图像
  tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  // 返回压缩后的数据
  return tempCanvas.toDataURL(`image/${format}`, quality);
}

/**
 * 获取图像数据大小（KB）
 */
export function getImageDataSize(dataUrl: string): number {
  // Base64 编码大小约为原始大小的 4/3
  const base64Length = dataUrl.split(',')[1]?.length || 0;
  return Math.round((base64Length * 3) / 4 / 1024);
}

/**
 * 验证图像数据是否有效
 */
export function validateImageData(dataUrl: string): boolean {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return false;
  }
  
  // 检查是否是有效的 data URL
  const dataUrlPattern = /^data:image\/(png|jpeg|jpg|webp);base64,/;
  return dataUrlPattern.test(dataUrl);
}

/**
 * 为 Vercel 优化的图像处理
 */
export function optimizeForVercel(canvas: HTMLCanvasElement): string {
  // Vercel 推荐的图像优化设置 - 适配更大画布
  return compressCanvasImage(canvas, {
    quality: 0.85,
    maxWidth: 900,
    maxHeight: 600,
    format: 'jpeg' // JPEG 通常比 PNG 小
  });
}
