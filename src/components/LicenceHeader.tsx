interface LicenceHeaderProps {
  period: string;
  topic?: string;
  code?: string;
  level: string;
  NC: string;
  CANT: string;
  title?: string;
  studentCount?: number;
  claimsCount?: number;
}

export const GradesHeader = ({
  period,
  topic,
  code,
  level,
  NC,
  CANT,
  title,
  studentCount,
  claimsCount = 0,
}: LicenceHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Titre principal */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-2xl">
            {title}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{topic}</h1>
            <p className="text-sm text-gray-500">Code: {code}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Période active</div>
          <div className="text-lg font-medium text-blue-600">{period}</div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{studentCount || 0}</div>
          <div className="text-sm text-gray-500">Étudiants</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{claimsCount}</div>
          <div className="text-sm text-gray-500">Revendications</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{NC}</div>
          <div className="text-sm text-gray-500">Note sur</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{CANT}</div>
          <div className="text-sm text-gray-500">Contrôle sur</div>
        </div>
      </div>
    </div>
  );
};
