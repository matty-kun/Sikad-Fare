export default function Header() {
  return (
    <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl">🚲</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Sikad Fare</h1>
              <p className="text-xs text-gray-500">Midsayap, Cotabato</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Ordinance</div>
            <div className="text-sm font-semibold">No. 536</div>
          </div>
        </div>
      </div>
    </div>
  );
}