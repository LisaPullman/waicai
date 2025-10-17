import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('收到AI猜测请求');
    const { imageData, prompt } = await request.json();

    if (!imageData) {
      console.error('缺少图像数据');
      return NextResponse.json({ error: '缺少图像数据' }, { status: 400 });
    }

    if (!process.env.SILICONFLOW_API_KEY) {
      console.error('未配置SILICONFLOW_API_KEY');
      return NextResponse.json({ error: '未配置硅基流动API密钥' }, { status: 500 });
    }

    console.log('API Key 存在，图像数据长度:', imageData.length);

    // 构建硅基流动API请求体
    const requestBody = {
      model: "Qwen/Qwen3-VL-30B-A3B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "请观察这幅手绘图，告诉我这是什么物品或生物？请用中文回答，直接说出你猜测的结果，不要解释原因。"
            },
            {
              type: "image_url",
              image_url: {
                url: imageData
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    };

    console.log('开始调用硅基流动 API...');
    
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时
    
    try {
      // 调用硅基流动 API
      const response = await fetch(
        'https://api.siliconflow.cn/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      console.log('硅基流动 API 响应状态:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('硅基流动 API 调用失败:', response.status, response.statusText, errorData);
        return NextResponse.json({ 
          error: `AI识别失败: ${response.status} ${response.statusText}`,
          details: errorData 
        }, { status: 500 });
      }

      const data = await response.json();
      console.log('硅基流动 API 响应数据:', JSON.stringify(data, null, 2));

      // 提取AI的回答
      const aiResponse = data.choices?.[0]?.message?.content || '无法识别图像';
      console.log('AI识别结果:', aiResponse);

      return NextResponse.json({
        guess: aiResponse,
        confidence: data.choices?.[0]?.finish_reason === 'stop' ? 'high' : 'medium'
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('API 调用超时或网络错误:', fetchError);
      return NextResponse.json({ 
        error: 'AI识别超时，请稍后重试' 
      }, { status: 408 });
    }

  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}