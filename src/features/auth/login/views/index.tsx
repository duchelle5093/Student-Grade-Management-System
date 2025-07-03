import {Form, Input} from "antd";
import {PasswordInputFormItem} from "../../../../components/PasswordInputField.tsx";
import {AppButton} from "../../../../components/AppButton.tsx";

export const LoginForm = ()=>{

    type SubmissionForm = {
        username: string;
        password: string;
    };

    const onFinish = ({username, password}: SubmissionForm) => {
        console.log(username, password);
    }

    return (
        <div>

            <Form name={'login'} onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Champ obligatoire',
                        },
                    ]}
                >
                    <Input size={'large'} placeholder='Entrez votre nom'/>
                </Form.Item>
                <PasswordInputFormItem/>
                <AppButton
                    className={'w-full'}
                    label={'Se connecter'}
                />
            </Form>
        </div>

    )
}