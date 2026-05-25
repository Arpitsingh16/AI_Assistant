import OpenAI from "openai"

const geminiResponse = async (command, assistantName, userName) => {

  try {

    console.log("GROQ KEY:", process.env.GROQ_API_KEY)

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })

    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.

You behave like a smart voice assistant.

Return ONLY valid JSON.

Format:
{
  "type":"general",
  "userInput":"cleaned input",
  "response":"short voice response"
}

Available types:
- general
- google-search
- youtube-search
- youtube-play
- get-time
- get-date
- get-day
- get-month
- calculator-open
- instagram-open
- facebook-open
- weather-show

Rules:
- Remove assistant name from userInput.
- If it is a Google or YouTube search, only keep searchable text.
- Return ONLY JSON.
- No markdown.
- No explanation text.
- response should be short and voice-friendly.
- If someone asks who created you, answer with ${userName}.

User command:
${command}
`

    const completion = await client.chat.completions.create({
model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.3
    })

    const text = completion.choices[0].message.content

    console.log("RAW AI RESPONSE:", text)

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    try {

      const parsedData = JSON.parse(cleanedText)

      return parsedData

    } catch (parseError) {

      console.log("PARSE ERROR:", parseError)
      console.log("CLEANED TEXT:", cleanedText)

      return {
        type: "general",
        userInput: command,
        response: cleanedText
      }
    }

  } catch (error) {

    console.log("GROQ ERROR:", error)

    return {
      type: "general",
      userInput: command,
      response: "AI service is unavailable."
    }
  }
}

export default geminiResponse