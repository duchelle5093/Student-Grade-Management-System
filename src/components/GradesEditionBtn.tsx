import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "antd";

interface GradesEditionProps {
    editGrades?: () => void;
    confirmGrades?: () => void;
    setIsTableEditable: (value: boolean) => void;
}
 
export const GradesEdition = ({
  confirmGrades,
  setIsTableEditable
}: GradesEditionProps) => {


  return (
    <div className="flex gap-2">
      <Button
        className="!bg-white !text-primary w-[150px] border border-gray-300"
        icon={<XCircleIcon width={20} />}
        onClick={()=> setIsTableEditable(false)}
      >
        Annuler
      </Button>
      <Button
        className=" w-[150px]"
        icon={<PencilSquareIcon width={20} className="text-white" />}
        onClick={confirmGrades}
      >
        Confirmer
      </Button>
    </div>
  );
};
