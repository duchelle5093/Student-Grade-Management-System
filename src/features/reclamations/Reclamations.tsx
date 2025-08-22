import { Input, Select, Form} from "antd";
import { useContext} from "react";
import { studentResDto, Topic } from "../../../api/reponse-dto/user.res.dto";
import { StepperContext, StepperProvider } from "../../../contexts";
import { AppButton, Stepper } from "../../../components";
import { ReclamationValuesProps } from "./GradesTable";
import {ReclamationsDetails} from "./ReclamtionDetails.tsx";


export default function Reclamations({
  student,
  handleOk,
  handleCancel,
  currentTopic,
  formValues,
  setFormValues,
  hasClaimed
  
}: {
  student: studentResDto;
  handleOk: () => void;
  handleCancel: () => void;
  currentTopic: Topic | null;
  formValues: ReclamationValuesProps;
  setFormValues: (payload: ReclamationValuesProps) => void;
  hasClaimed: (code: string) => boolean;
}) {
 

  const ReclamationForm = () => {
  const { handleNext } = useContext(StepperContext);


    const onFinish = (values: any) => {
      const payload = {
        reclamationType: values.reclamationType,
        expectedGrade: values.expectedGrade,
        reclamationReason: values.reclamationReason,
        description: values.description,
      };
      setFormValues(payload);
      handleNext?.();
    };

    return (
      <Form
        layout="vertical"
        className="px-2"
        onFinish={onFinish}
      >
        <div className="text-lg font-semibold text-center -mt-5 mb-15">
          Formulaire de revendication
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Type de note contestée
              </span>
            }
            name="reclamationType"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner le type de note.",
              },
            ]}
            className="!-mt-4"
          >
            <Select
              placeholder="Sélectionnez le type de note"
              size="large"
              options={[
                { value: "cc", label: "CC" },
                { value: "sn", label: "SN" },
              ]}
            />
          </Form.Item>  
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Note souhaitée
              </span>
            }
            name="expectedGrade"
            rules={[
              { required: true, message: "Veuillez entrer la note souhaitée." },
            ]}
            className="mb-0 !-mt-4"
          >
            <Input
              type="number"
              size="large"
              min={0}
              placeholder="Entrez la note souhaitée"
              className="!w-full"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">
                Cause de la revendication
              </span>
            }
            name="reclamationReason"
            rules={[
              {
                required: true,
                message: "Veuillez préciser le type de revendication.",
              },
            ]}
            className="md:col-span-2 mb-0 !-mt-2"
          >
            <Input
              size="large"
              placeholder="Ex: Erreur de saisie, Correction oubliée, etc."
              className="!w-full"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
            name="description"
            rules={[
              {
                required: true,
                message: "Veuillez décrire votre revendication.",
              },
            ]}
            className="md:col-span-2 !-mt-4"
          >
            <Input.TextArea
              rows={3}
              size="large"
              placeholder="Décrivez votre revendication..."
              className="!w-full"
            />
          </Form.Item>
        </div>
        <div className="flex justify-between gap-2 w-full mt-10 ">
          <AppButton
            btnType="button"
            label={"Annuler"}
            className="w-1/2 !bg-red-400 !text-white !font-bold !border !py-4 "
            onClick={handleCancel}
          />
          <AppButton
            htmlType={"submit"}
            label={"Suivant"}
            className="w-1/2 !font-bold !py-4"
          />
        </div>
      </Form>
    );
  };




  interface ItemsProps {
    label: string;
    content: React.ReactNode;
  }

  const stepItems: ItemsProps[] = [
    { label: "", content: <ReclamationForm /> },
    { 
      label: "", 
      content: (
        <ReclamationsDetails 
          handleOk={handleOk} 
          student={student} 
          currentTopic={currentTopic} 
          formValues={formValues}
          hasClaimed={hasClaimed}
        />
      ) 
    },
  ];

  return (
    <div className=" mt-10 h-[550px]">
      <StepperProvider>
        <Stepper stepItems={stepItems} horizontal>
          {(currentStepIndex) => (
            <div>
              {stepItems[currentStepIndex].content}
            </div>
          )}
        </Stepper>
      </StepperProvider>
    </div>
  );
}

