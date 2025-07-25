import { FakeStudents } from "../features/user/data";

interface LicenceHeaderProps {
    period: string;
    topic? : string;
    code?: string;
    level: string;
    NC : string
    CANT : string;
    title? : string;
    
};


export const GradesHeader = ({ period , topic , code , level , NC , CANT  , title  }: LicenceHeaderProps) => {
  

  return (
    <div className="flex flex-col justify-between h-1/4 w-full">
        <div className="flex">
            <div className=" flex items-center text-gray-500 justify-center w-[30%] text-[8rem]">{title}</div>
            <div className="flex gap-2 w-full  justify-between">
                <div className="flex flex-col justify-between">
                    <div>
                        <p><b>Periode :</b> {period}</p>
                        <p className="text-secondary"><b>Revendications :</b> 0 </p>
                        
                    </div>
                    <div>
                        {
                            code && (
                                <><p><b>Matiere :</b> {topic}</p>
                                <p><b>Code :</b> {code}</p>
                               
                                </>
                            )
                        }
                         <p><b>Niveau :</b> {level}</p>
                    </div>
                </div>
                <div>
                    {
                        code && (<p><b>Nombre d'étudiants :</b> {FakeStudents.length}</p>)
                    }
                    <p><b>NC:</b> {NC}</p>
                    <p><b>CANT :</b> {CANT}</p>
                    <p className="text-secondary"><b>Total revendictions :</b> 0</p>
                </div>
            </div>
        </div>
        
        
    </div>
  )
} 
