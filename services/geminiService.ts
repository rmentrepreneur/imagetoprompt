import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // remove the prefix 'data:image/jpeg;base64,'
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};


export const generatePromptFromImage = async (imageFile: File, style: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = await fileToGenerativePart(imageFile);
    
    const textPart = {
        text: `You are an AI assistant that creates detailed image generation prompts. Based on the image provided, generate a creative prompt that captures the essence, style, and mood. The prompt should be suitable for use with an AI image generator like Midjourney or DALL-E.
        
        Crucially, the generated prompt must incorporate the style or keyword: '${style}'. Make the prompt concise but descriptive. 
        
        For example, if the style is 'Ultra HD', a good prompt would be: 'Ultra HD, a cute, smiling banana character holding a sparkling magic wand, surrounded by colorful stars and hearts, cinematic lighting, detailed texture.'
        If the style is 'Realistic', a good prompt would be: 'Realistic photo of a cheerful banana with a magic wand, soft lighting, detailed skin texture, surrounded by dreamy, bokeh stars and hearts.'`
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] }
        });

        const text = response.text;
        if (!text) {
            throw new Error("The AI did not return a valid prompt. Please try a different image.");
        }
        return text;
    } catch (error) {
        console.error("Error generating prompt from Gemini:", error);
        throw new Error("Failed to generate prompt. The AI model might be unavailable or the image could not be processed.");
    }
};