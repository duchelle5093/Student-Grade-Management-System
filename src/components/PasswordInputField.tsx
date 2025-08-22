import { useState } from 'react';
import {
    EyeInvisibleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import {Form, Input} from 'antd';



interface PasswordInputFormItemProps {
    name?: string;
    placeholder?: string;
}



export const PasswordInputFormItem = ({name , placeholder }:PasswordInputFormItemProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handlePwdVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Form.Item
            name={name ? name : 'password'}
            rules={[
                {
                    required: true,
                    message: 'Champ obligatoire',
                },
            ]}
        >
            <Input
                size={'large'}
                suffix={
                    showPassword ? (
                        <EyeOutlined
                            onClick={handlePwdVisibility}
                            aria-label={'show password icon'}
                        />
                    ) : (
                        <EyeInvisibleOutlined
                            onClick={handlePwdVisibility}
                            aria-label={'hide password icon'}
                        />
                    )
                }
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder ? placeholder : 'Mot de passe'}
            />
        </Form.Item>
    );
};
