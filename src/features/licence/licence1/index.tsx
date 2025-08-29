import { GradeManagement } from "../../../components/GradeManagement";
import { AcademicLevel } from "../../../api/enums";

export const Licence1 = () => {
    return (
        <GradeManagement 
            level={AcademicLevel.LEVEL1}
            levelName="Licence 1"
            levelCode="L1"
        />
    );
};
