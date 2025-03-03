// pages/index.js - الصفحة الرئيسية للتطبيق
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../lib/userManager';
import InputForm from '../components/InputForm';
import AudioRecorder from '../components/AudioRecorder';
import MagicPlan from '../components/MagicPlan';
import ActionButtons from '../components/ActionButtons';
import LongTermRules from '../components/LongTermRules';
import Header from '../components/Header';

export default function Home() {
  const { user, loading } = useAuth();
  const [situation, setSituation] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [magicPlan, setMagicPlan] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [longTermRules, setLongTermRules] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [responseHistory, setResponseHistory] = useState([]);

  // تحميل التاريخ السابق عند بدء الجلسة
  useEffect(() => {
    if (user && !loading) {
      // جلب تاريخ التفاعلات السابقة من قاعدة البيانات
      fetch(`/api/history?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setResponseHistory(data.history || []);
        })
        .catch(err => console.error('Error fetching history:', err));
    }
  }, [user, loading]);

  // معالجة تقديم النموذج وتحليل الموقف
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          situation,
          userId: user?.uid,
          previousInteractions: responseHistory.slice(-5) // آخر 5 تفاعلات لتوفير السياق
        }),
      });
      
      const data = await response.json();
      
      setMagicPlan({
        openingLine: data.openingLine,
        smartMove: data.smartMove,
        expectedReaction: data.expectedReaction
      });
      
      setShowButtons(true);
      
    } catch (error) {
      console.error('Error analyzing situation:', error);
      alert('حدث خطأ أثناء تحليل الموقف، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // معالجة رد الفعل باستخدام الأزرار
  const handleReactionButton = async (reactionType, details = '') => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          situation,
          magicPlan,
          reactionType,
          reactionDetails: details,
        }),
      });
      
      const data = await response.json();
      setLongTermRules(data.rules);
      
      // إضافة التفاعل الجديد إلى التاريخ
      setResponseHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        situation,
        magicPlan,
        reaction: reactionType,
        details,
        rules: data.rules
      }]);
      
      // إعادة تعيين الواجهة للتفاعل التالي
      setTimeout(() => {
        setSituation('');
        setMagicPlan(null);
        setShowButtons(false);
      }, 5000); // عرض القواعد لمدة 5 ثوان قبل إعادة الضبط
      
    } catch (error) {
      console.error('Error handling reaction:', error);
      alert('حدث خطأ أثناء معالجة رد الفعل، يرجى المحاولة مرة أخرى.');
    }
  };

  // التبديل بين وضع النص والصوت
  const toggleInputMode = () => {
    setIsAudioMode(!isAudioMode);
    setSituation('');
  };

  // معالجة تسجيل الصوت
  const handleAudioInput = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    try {
      setIsAnalyzing(true);
      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setSituation(data.transcription);
      
      // تحليل تلقائي بعد الحصول على النص
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} });
      }, 500);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('حدث خطأ أثناء معالجة التسجيل الصوتي، يرجى المحاولة مرة أخرى.');
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جارٍ التحميل...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
      <Head>
        <title>إكسير | نظام تواصل ذكي</title>
        <meta name="description" content="نظام ذكاء تفاعلي لتحسين المهارات الاجتماعية" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-300">إكسير - نظام ذكاء تفاعلي</h1>
          
          <div className="mb-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleInputMode}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm"
              >
                {isAudioMode ? 'وضع الكتابة' : 'وضع الصوت'}
              </button>
            </div>

            {isAudioMode ? (
              <AudioRecorder onRecordingComplete={handleAudioInput} isAnalyzing={isAnalyzing} />
            ) : (
              <InputForm
                situation={situation}
                setSituation={setSituation}
                handleSubmit={handleSubmit}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
          
          {magicPlan && (
            <MagicPlan plan={magicPlan} />
          )}
          
          {showButtons && (
            <ActionButtons onButtonClick={handleReactionButton} />
          )}
          
          {longTermRules.length > 0 && (
            <LongTermRules rules={longTermRules} />
          )}
        </div>
      </main>
    </div>
  );
}