import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageData, prompt } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: '缺少图像数据' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: '未配置GEMINI_API_KEY' }, { status: 500 });
    }

    // 构建请求体
    const requestBody = {
      contents: [{
        parts: [
          {
            text: prompt || "请观察这幅手绘图，告诉我这是什么物品或生物？请用中文回答，直接说出你猜测的结果，不要解释原因。"
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: imageData.replace(/^data:image\/png;base64,/, '')
            }
          }
        ]
      }]
    };

    // 调用Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API 调用失败:', errorData);
      return NextResponse.json({ error: 'AI识别失败' }, { status: 500 });
    }

    const data = await response.json();

    // 提取AI的回答
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '无法识别图像';

    return NextResponse.json({
      guess: aiResponse,
      confidence: data.candidates?.[0]?.safetyRatings ? 'high' : 'medium'
    });

  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}