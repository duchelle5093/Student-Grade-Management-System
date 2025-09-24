import { GradeManagement } from "../../../components";
import { AcademicLevel } from "../../../api/enums";

export const Master2 = () => {
    return (
        <GradeManagement 
            level={AcademicLevel.LEVEL5}
            levelName="Master 2"
            levelCode="M2"
        />
    );
}