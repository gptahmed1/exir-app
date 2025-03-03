// pages/api/analyze.js - نقطة نهاية API لتحليل الموقف
import { analyzeSituation } from '../../lib/geminiAPI';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { situation, userId, previousInteractions } = req.body;
    
    if (!situation) {
      return res.status(400).json({ error: 'Situation is required' });
    }

    // تحليل الموقف باستخدام Gemini API
    const analysis = await analyzeSituation(situation, previousInteractions);
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error in analyze API:', error);
    res.status(500).json({ error: 'Failed to analyze situation' });
  }
}