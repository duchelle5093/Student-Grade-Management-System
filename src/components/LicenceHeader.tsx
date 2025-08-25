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
    <div className="px-4 md:px-0 flex flex-col justify-between h-1/4 w-full">
      <div className="flex">
        <div className=" hidden md:block items-center text-gray-500 justify-center w-[30%] text-[8rem]">
          {title}
        </div>
        <div className="flex gap-2 w-full  justify-between">
          <div className="flex flex-col justify-between">
            <div>
              <p>
                Periode : <span className="text-gray-500">{period}</span>
              </p>
              <p className="text-secondary"> Revendications : {claimsCount} </p>
            </div>
            <div>
              {code && (
                <>
                  <p>
                    Matiere : <span className="text-gray-500">
                      {topic}
                    </span>
                  </p>
                  <p>
                    {" "}
                    Code : <span className="text-gray-500">{code}</span>
                  </p>
                </>
              )}
              <p>
                {" "}
                Niveau : <span className="text-gray-500">{level}</span>
              </p>
            </div>
          </div>
          <div>
            {code && (
              <p>
                Nombre d'étudiants :{" "}
                <span className="text-gray-500">{studentCount || 0}</span>
              </p>
            )}
            <p>
              {" "}
              NC: <span className="text-gray-500">{NC}</span>
            </p>
            <p>
              CANT : <span className="text-gray-500">{CANT}</span>
            </p>
            <p className="text-secondary"> Total revendications : {claimsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
