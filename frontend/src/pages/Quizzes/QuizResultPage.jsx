const StatCard = ({ icon, label, value, green, red }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`text-xl font-bold ${green ? "text-emerald-400" : red ? "text-red-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);
