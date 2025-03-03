import { GoogleGenerativeAI } from "@google/generative-ai";

// تهيئة Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// تكوين التوليد
const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 2048,
};

// تحليل الموقف باستخدام Gemini
export async function analyzeSituation(situationText, previousInteractions = []) {
  try {
    const prompt = `
    أنت مساعد متخصص في تحليل المواقف الاجتماعية وتقديم استراتيجيات تواصل ذكية.
    
    تحليل الموقف التالي وتوليد خطة تفاعل ذكية:
    "${situationText}"
    
    قم بإنشاء رد على شكل JSON بالتنسيق التالي:
    {
      "openingLine": "جملة افتتاحية مناسبة للموقف",
      "smartMove": "حركة أو إجراء ذكي يمكن اتخاذه",
      "expectedReaction": "رد الفعل المتوقع ونصيحة للاستجابة"
    }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error analyzing situation with Gemini:", error);
    throw error;
  }
}

// تحليل ردود الفعل وتوليد قواعد طويلة المدى
export async function generateLongTermRules(situationData, reactionType) {
  try {
    const prompt = `
    تم تحليل موقف اجتماعي وتقديم استراتيجية، والآن لدينا رد فعل يجب تحليله.
    
    الموقف: "${situationData.situation}"
    الخطة المقدمة:
    - جملة افتتاحية: "${situationData.magicPlan.openingLine}"
    - حركة ذكية: "${situationData.magicPlan.smartMove}"
    
    رد الفعل الفعلي: ${reactionType}
    
    من فضلك، قم بتوليد 3 قواعد طويلة المدى للتفاعلات المستقبلية.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();
    // نعالج النص لاستخراج القواعد (لتبسيط العملية، سنفترض أن الردود منسقة بشكل جيد)
    const rules = responseText.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s+/, '').trim())
      .slice(0, 3);
    
    return rules.length ? rules : ["تكلم ببطء أكثر", "استخدم المجاملات بشكل مدروس", "كن مستمعاً جيداً"];
  } catch (error) {
    console.error("Error generating rules with Gemini:", error);
    // نعيد قواعد افتراضية في حالة الخطأ
    return ["تكلم ببطء أكثر", "استخدم المجاملات بشكل مدروس", "كن مستمعاً جيداً"];
  }
}

export default {
  analyzeSituation,
  generateLongTermRules,
};