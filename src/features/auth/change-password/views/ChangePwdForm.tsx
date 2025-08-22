import {Form,} from "antd";
import {AppButton, PasswordInputFormItem} from "../../../../components";
import {changePassword } from "../../actions.ts";
import {useState} from "react";
import {useAppDispatch} from "../../../../store";
import {useAppNavigation} from "../../../../hooks";


export const ChangePwdForm = ()=>{

    const dispatch = useAppDispatch();

    const {navigateTo} = useAppNavigation();

    type SubmissionForm = {
        newPassword: string;
        confirmPassword: string;
    };

    const [isProcessing, setIsProcessing] = useState(false);

    const onFinish = async ({
                                newPassword,
                                confirmPassword,
                            }: SubmissionForm) => {
        setIsProcessing(true);
        await dispatch(
            changePassword({
                req: {
                    newPassword,
                    confirmPassword,
                },
                navigate: navigateTo
            })
        );
        setIsProcessing(false)
    };

    return (
        <Form name={'change-password'} onFinish={onFinish}>
            <PasswordInputFormItem name={'newPassword'} placeholder={'Nouveau mot de passe'}/>
            <PasswordInputFormItem name={'confirmPassword'} placeholder={'Confirmer le mot de passe'}/>
            <AppButton
                htmlType={'submit'}
                loading={isProcessing}
                className={'w-full'}
                label={'Confirmer'}
            />
        </Form>

    )
}