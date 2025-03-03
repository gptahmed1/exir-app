// pages/api/feedback.js - معالجة ردود الأفعال وتوليد القواعد
import { generateLongTermRules } from '../../lib/geminiAPI';
import { saveInteraction, saveLongTermRules } from '../../lib/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, situation, magicPlan, reactionType, reactionDetails } = req.body;
    
    if (!userId || !situation || !magicPlan || !reactionType) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // حفظ التفاعل في قاعدة البيانات
    await saveInteraction(userId, {
      situation,
      magicPlan,
      reactionType,
      reactionDetails: reactionDetails || '',
      createdAt: new Date().toISOString()
    });
    
    // توليد قواعد طويلة المدى
    const rules = await generateLongTermRules(
      { situation, magicPlan },
      reactionType,
      reactionDetails || ''
    );
    
    // إنشاء معرّف للشخص بناءً على الموقف
    // ملاحظة: في تطبيق حقيقي، يمكن استخدام نظام أكثر تعقيدًا لتحديد هوية الأشخاص
    const personId = Buffer.from(situation).toString('base64').substring(0, 10);
    
    // حفظ القواعد الطويلة المدى
    await saveLongTermRules(userId, personId, rules);
    
    res.status(200).json({ success: true, rules });
  } catch (error) {
    console.error('Error in feedback API:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
}