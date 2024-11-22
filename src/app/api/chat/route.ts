import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const dataset = require('../../data.json'); // Adjust path based on your project structure

export const runtime = 'edge';

// Helper function for Google Generative AI
async function generateGoogleContent(query: string): Promise<string> {
  try {
    const prompt = `Given this dataset: ${JSON.stringify(dataset)} \n ${query}\n What are my vehicle specifications?`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Error with GoogleGenerativeAI:', error.message);
    throw new Error(error.message);
  }
}

export async function POST(req: Request) {
  try {
    const { data } = await req.json(); // Expecting data from the request body
    const { vin, userQuery } = data;

    // Build the query for the Google Generative AI
    const query = vin
      ? `The user's car VIN is ${vin}. ${userQuery || ''}. Please provide information about this car, including general info, part numbers, and repair schemes. Format your response as a JSON object.`
      : userQuery;

    // Call Google Generative AI
    const googleResponse = await generateGoogleContent(query);
    return new Response(googleResponse, { status: 200 });
  } catch (error) {
    console.error('Error handling AI request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
