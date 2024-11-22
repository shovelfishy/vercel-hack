const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCSOtHMDIYNOJYuFBXTUOWAA7_s9Lxpe2w");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const dataset = require("./data.json");

async function generateContent() {
  try {x
    const query = "My vin number is 1HGCM82633A123456 and my air quality in the car is bad, how do i fix this"
    const prompt = `Given this dataset: ${JSON.stringify(dataset)} \n ${query}\n What are my vehicle specifications`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the async function
generateContent();
