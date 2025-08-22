import {ChangePwdForm} from "./views/ChangePwdForm.tsx";
import pwdIcon from '../../../images/reset-password.png'

export const ChangePwdPage = () => {
    return (
        <div className={' h-full flex flex-col justify-around my-20'}>
            <div className={'w-40 h-40 mx-auto'}><img src={pwdIcon} alt="" className={'w-full'}/></div>
            <div className={' flex flex-col gap-5 justify-around'}>
                <h1 className={'text-2xl text-primary font-bold'}>Sécurisez votre compte</h1>
                <span className={'text-gray-400 '}>Créez un nouveau mot de passe fort et unique</span>
            </div>
            <ChangePwdForm/>
        </div>
    )
};