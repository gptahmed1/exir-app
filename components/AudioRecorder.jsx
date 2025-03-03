// components/AudioRecorder.jsx - مكون تسجيل الصوت
import { useState, useRef } from 'react';

export default function AudioRecorder({ onRecordingComplete, isAnalyzing }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg' });
        onRecordingComplete(audioBlob);
        
        // إيقاف كل المسارات
        stream.getTracks().forEach(track => track.stop());
      };

      // بدء التسجيل
      mediaRecorder.start();
      setIsRecording(true);
      
      // بدء المؤقت
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('لا يمكن الوصول إلى الميكروفون. يرجى التأكد من منح الإذن.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // إيقاف المؤقت
      clearInterval(timerRef.current);
    }
  };

  // تنسيق الوقت (ثانية:دقيقة)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-700 p-6 rounded-full mb-4 relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
          className={`w-16 h-16 rounded-full transition-all ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-purple-600 hover:bg-purple-700'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <span className="h-6 w-6 bg-white block mx-auto rounded-sm"></span>
          ) : (
            <span className="h-6 w-6 bg-white block mx-auto rounded-full"></span>
          )}
        </button>
        
        {isRecording && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
      
      <p className="text-center text-gray-300">
        {isRecording 
          ? 'جارِ التسجيل... اضغط مرة أخرى للإنهاء' 
          : isAnalyzing 
            ? 'جارِ تحليل التسجيل...' 
            : 'اضغط للتسجيل'}
      </p>
    </div>
  );
}