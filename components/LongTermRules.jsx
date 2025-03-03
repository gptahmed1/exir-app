// components/LongTermRules.jsx - مكون عرض القواعد طويلة المدى
export default function LongTermRules({ rules }) {
  if (!rules || rules.length === 0) return null;
  
  return (
    <div className="bg-indigo-900 rounded-lg p-4 mt-6 border-r-4 border-indigo-500 animate-fade-in">
      <h3 className="text-lg font-bold mb-3 text-indigo-300">القواعد الذهبية:</h3>
      
      <ul className="space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start">
            <span className="text-yellow-400 mr-2">✦</span>
            <span className="text-white">{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}