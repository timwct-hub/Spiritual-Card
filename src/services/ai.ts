export async function getSpiritualReading(
  userQuestion: string,
  cardTitle: string,
  cardTheme: string,
  cardMessage: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("請先在設定中輸入 OPENROUTER_API_KEY");
  }

  const prompt = `
你是一個溫柔、安靜、帶有宇宙感與詩意的靈性嚮導。
使用者抽到了「${cardTitle}」這張卡。卡牌主題是「${cardTheme}」。
卡牌原本的訊息是：「${cardMessage}」。

${userQuestion ? `使用者心中的問題是：「${userQuestion}」` : '使用者沒有提供具體問題，請給予一般性的指引。'}

請根據卡牌的訊息，為使用者的問題提供一段專屬的靈性解讀（約 150-200 字）。要讓她看完是會更有希望的
解讀結束後，請提供 3 個引導使用者自我覺察的提問（請以「✧」作為項目符號開頭）。

請不要說教、不要販賣焦慮、語氣要溫暖且具啟發性。
請直接輸出解讀內容與提問，不需要加上額外的開場白。
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== "undefined"
        ? window.location.href
        : "https://timwct-hub.github.io/Spiritual-Card/",
      "X-Title": "Spiritual Message Cards",
    },
    body: JSON.stringify({
      model: "qwen/qwen3.6-plus:free",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || JSON.stringify(data.error) || "無法連接到 OpenRouter API";
    console.error("OpenRouter API Error:", data);
    throw new Error(`API 錯誤: ${errorMsg}`);
  }

  if (!data.choices || !data.choices[0]) {
    console.error("OpenRouter API Invalid Response:", data);
    throw new Error(`API 回傳格式異常: ${JSON.stringify(data)}`);
  }

  // 過濾掉 Qwen3 的 <think>...</think> 思考區塊
  const rawContent = data.choices[0].message.content;
  const content = rawContent.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return content;
}
