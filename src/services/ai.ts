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
      "HTTP-Referer": window.location.href,
      "X-Title": "Spiritual Message Cards",
    },
    body: JSON.stringify({
      model: "qwen/qwen-2.5-72b-instruct:free",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "無法連接到 OpenRouter API，請稍後再試。");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
