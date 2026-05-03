const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY as string | undefined;
const chatModel = import.meta.env.VITE_HUGGINGFACE_CHAT_MODEL || 'openai/gpt-oss-20b:fastest';

export const isHuggingFaceConfigured = Boolean(apiKey);

const fallbackAnswers = [
  'Start with the smallest working example, then add one idea at a time. For web development, that usually means HTML structure first, CSS layout second, then JavaScript behavior.',
  'A good debugging habit is to describe what you expected, what happened, and the exact line where the two split. That narrows most beginner bugs very quickly.',
  'For React, think in state and props: state is what changes inside a component, props are what a parent gives it. When the UI looks wrong, ask which state value should be different.',
];

export async function askHuggingFace(question: string) {
  if (!isHuggingFaceConfigured) {
    return `${fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)]}\n\nDemo mode: add your Hugging Face token to .env to get real AI answers.`;
  }

  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: chatModel,
      messages: [
        {
          role: 'system',
          content:
            'You are DevConnect AI, a friendly web development tutor for beginners. Answer clearly, use short practical examples, and stay focused on web development.',
        },
        { role: 'user', content: question },
      ],
      max_tokens: 520,
      temperature: 0.55,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Hugging Face request failed');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  return 'I received a response, but could not read the generated text. Try again in a moment.';
}

export async function generateRoadmap(path: string, level: string) {
  const fallback = JSON.stringify({
    title: `${level} ${path} roadmap`,
    estimatedTime: 'Estimated time: 4-8 months',
    summary: 'A practical phase-by-phase roadmap for building real skills.',
    phases: [
      {
        phase: 1,
        title: 'Foundation',
        goal: 'Strengthen the core concepts needed for this path.',
        items: ['Review fundamentals', 'Practice small exercises', 'Study common patterns', 'Build a mini project'],
        project: 'Create a small starter project that demonstrates the fundamentals.',
      },
    ],
  });

  if (!isHuggingFaceConfigured) return fallback;

  const prompt = `Create a ${level} learning roadmap for a ${path} developer.
You are a JSON API. Return ONLY valid JSON. No markdown. No table. No explanation before or after.
Use this exact shape:
{
  "title": "Roadmap title",
  "estimatedTime": "time estimate",
  "summary": "one short summary",
  "phases": [
    {
      "phase": 1,
      "title": "phase title",
      "goal": "one sentence goal",
      "items": ["item 1", "item 2", "item 3", "item 4"],
      "project": "one practical project"
    }
  ]
}
Include exactly 5 phases and exactly 4 items per phase. Do not wrap the JSON in markdown.`;

  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: chatModel,
      messages: [
        {
          role: 'system',
          content:
            'You output strict JSON only. Never use markdown, tables, prose, code fences, or commentary.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1100,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Hugging Face roadmap request failed');
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  return fallback;
}
