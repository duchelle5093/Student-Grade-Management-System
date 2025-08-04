import { GradesHeader } from "../../../components/LicenceHeader";
import GradesTable from "../views/GradesTable";
import { FakeStudents } from "../../user/data";

export default function Semester1() {
    return (
        <div>
          <GradesHeader
            title="L1"
            period={"Controle continu #1"}
            level="1"
            NC="10"
            CANT="20"
          />
          <GradesTable student={FakeStudents[0]} />
        </div>
      );
}



