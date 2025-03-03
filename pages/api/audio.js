// pages/api/audio.js - معالجة تسجيل الصوت
import { IncomingForm } from 'formidable';
import { processAudio, uploadAudioToGemini } from '../../lib/geminiAPI';

// تعطيل تحليل الجسم الافتراضي لـ Next.js لمعالجة ملفات الوسائط
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // استخدام formidable لمعالجة بيانات النموذج المتعددة الأجزاء
    const form = new IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }
      
      if (!files.audio) {
        return res.status(400).json({ error: 'No audio file uploaded' });
      }
      
      try {
        // رفع الملف الصوتي إلى Gemini
        const audioFile = await uploadAudioToGemini(
          files.audio[0].filepath,
          'audio/ogg'
        );
        
        // معالجة الصوت باستخدام Gemini
        const result = await processAudio(audioFile);
        
        res.status(200).json({ transcription: result.transcription });
      } catch (error) {
        console.error('Error processing audio:', error);
        res.status(500).json({ error: 'Failed to process audio' });
      }
    });
  } catch (error) {
    console.error('Error in audio API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}