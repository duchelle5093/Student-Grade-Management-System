import { GradeManagement } from "../../../components/GradeManagement";
import { AcademicLevel } from "../../../api/enums";

export const Master1 = () => {
    return (
        <GradeManagement 
            level={AcademicLevel.LEVEL4}
            levelName="Master 1"
            levelCode="M1"
        />
    );
};