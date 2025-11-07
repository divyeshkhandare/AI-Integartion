import express from 'express';
import { OpenAI } from 'openai';   
import cors from 'cors'; 

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

const openai = new OpenAI({
    baseURL: 'https://api.aimlapi.com/v1',
    apiKey: '4e8db7bec6bc450182ee177994a254ec',
})

app.post('/', async (req, res) => {
   try {
     const message = req.body.message || 'Hello, how are you?';
  const completion = await openai.chat.completions.create({
    model: "google/gemma-3-12b-it",
    messages: [ 
        {
            role: "user",
            content : message
        }
    ]
})
    res.json({
      reply: completion.choices[0]?.message?.content?.trim(),
      model: completion.model,
      usage: completion.usage
    });
   } catch (error) {
        console.error('Error generating completion:', error);
   }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});