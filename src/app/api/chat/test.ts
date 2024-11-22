const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const dataset = require("../../data.json");

export async function generateContent(query: string): Promise<string> {
  try {
    const query = "My vin number is 1HGCM82633A123456 and my air quality in the car is bad, how do i fix this"
    const prompt = `Given this dataset: ${JSON.stringify(dataset)} \n ${query}\n What are my vehicle specifications`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  } catch (error:any) {
    console.error("Error:", error.message);
    throw new Error(error.message); // Forward the error to the caller
  }
}

