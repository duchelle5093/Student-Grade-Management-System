import { PencilSquareIcon } from "@heroicons/react/24/solid"
import { Button } from "antd"

export const EditPvButton = ({setIsTableEditable , onEdit} : {setIsTableEditable: (value: boolean) => void , onEdit: () => void}) => {


    const onClick = () => {
        setIsTableEditable(true);
        onEdit();
    }
    
  return (
    <Button
      onClick={onClick}
      icon={<PencilSquareIcon width={20} className="text-white" />}
    >
      Editer le PV
    </Button>
  )
}
