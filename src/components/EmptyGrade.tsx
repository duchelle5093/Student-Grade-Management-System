import { AppButton } from "./AppButton";

export const EmptyGrade = ({setShowTable} : {setShowTable : (val: boolean)=> void })=> {
  return (
    <div className=" bg-gray-50 flex items-center justify-center p-4 h-[600px]">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune note enregistrée</h2>
          <p className="text-gray-600 mb-6">Vous n'avez encore saisi aucune note pour vos étudiants. Commencez par ajouter des notes.</p>
        </div>
        <AppButton label="Ajouter des notes" className="!font-semibold !py-5 !px-5" onClick={()=> setShowTable(true)}/>
      </div>
    </div>
  );
}

