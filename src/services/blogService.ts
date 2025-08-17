import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { GeneratedBlog } from '../types/blog';

export const generateBlog = async (topic: string, blogNumber?: number, specialInstruction?:string): Promise<GeneratedBlog> => {
  const deploymentName = import.meta.env.VITE_AZURE_DEPLOYMENT_NAME;
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;

  // const prompt = `Write a detailed blog post on the topic "${topic}". Include introduction, benefits, implementation strategies, challenges, and future trends.`;
  const prompt = `Write a detailed blog post on the topic "${topic}". Include introduction, benefits, implementation strategies, challenges, and future trends.please provide all the content with sutable html tags only.remove html, header and body tags.${specialInstruction ? specialInstruction : ''}`;
  const response = await axios.post(
    `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=2024-03-01-preview`,
    {
      messages: [
        { role: 'system', content: 'You are a professional blog writer.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    }
  );

  const content = response.data.choices[0].message.content;
  const wordCount = content.split(/\s+/).length;

  return {
    id: uuidv4(),
    topic,
    title: `Blog on ${topic}`,
    content,
    summary: content.slice(0, 300) + '...',
    wordCount,
    generatedAt: new Date()
  };
};