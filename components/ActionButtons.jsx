// components/ActionButtons.jsx - مكون أزرار الاستجابة
import { useState } from 'react';

export default function ActionButtons({ onButtonClick }) {
  const [showDetails, setShowDetails] = useState(false);
  const [reactionDetails, setReactionDetails] = useState('');
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (reactionType) => {
    setActiveButton(reactionType);
    setShowDetails(true);
  };

  const handleSubmitDetails = () => {
    onButtonClick(activeButton, reactionDetails);
    setShowDetails(false);
    setReactionDetails('');
    setActiveButton(null);
  };

  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3 text-purple-300">اختر رد الفعل:</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => handleButtonClick('rejection')}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition"
        >
          مش عايزة
        </button>
        
        <button
          onClick={() => handleButtonClick('acceptance')}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition"
        >
          حبتني
        </button>
        
        <button
          onClick={() => handleButtonClick('other')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg transition"
        >
          مش واضحة
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 bg-gray-700 p-4 rounded-lg">
          <textarea
            value={reactionDetails}
            onChange={(e) => setReactionDetails(e.target.value)}
            placeholder="اكتب تفاصيل رد الفعل هنا..."
            className="w-full bg-gray-800 border border-gray-600 text-white p-3 rounded-lg mb-3"
            rows="3"
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmitDetails}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              تأكيد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}