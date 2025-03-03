// components/InputForm.jsx - نموذج إدخال النص
export default function InputForm({ situation, setSituation, handleSubmit, isAnalyzing }) {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="اكتب وصف الموقف هنا (مثال: بنت لابسة شيك، بتبص في الأرض، في مترو زحمة)"
          className="w-full bg-gray-700 border border-gray-600 text-white p-4 rounded-lg"
          rows="4"
          disabled={isAnalyzing}
        />
      </div>
      
      <button
        type="submit"
        className={`w-full ${
          isAnalyzing
            ? 'bg-purple-800 cursor-wait'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white py-3 px-4 rounded-lg transition`}
        disabled={isAnalyzing || !situation.trim()}
      >
        {isAnalyzing ? 'جارِ التحليل...' : 'سحرني'}
      </button>
    </form>
  );
}