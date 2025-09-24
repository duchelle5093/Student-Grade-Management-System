import { GradeManagement } from "../../../components";
import { AcademicLevel } from "../../../api/enums";

export const Licence2 = () => {
    return (
        <GradeManagement 
            level={AcademicLevel.LEVEL2}
            levelName="Licence 2"
            levelCode="L2"
        />
    );
};
