// components/MagicPlan.jsx - مكون عرض خطة التفاعل
export default function MagicPlan({ plan }) {
  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-6 border-r-4 border-purple-500">
      <h3 className="text-xl font-bold mb-4 text-purple-300">خطة إكسير</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-300">الجملة الافتتاحية:</h4>
          <p className="text-white">{plan.openingLine}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-300">الحركة الذكية:</h4>
          <p className="text-white">{plan.smartMove}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-300">رد الفعل المتوقع:</h4>
          <p className="text-white">{plan.expectedReaction}</p>
        </div>
      </div>
    </div>
  );
}