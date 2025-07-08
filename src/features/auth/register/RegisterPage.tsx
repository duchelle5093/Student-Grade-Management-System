import {RegisterStepper} from "./views";
import {RegisterCtxProvider} from "./context";
import {Link} from "react-router";

export const RegisterPage = ()=>{
    return (
        <RegisterCtxProvider>
            <div>
                <p className={'text-center text-2xl mb-10'}>Inscrivez-vous!</p>
                <RegisterStepper isHorizontal/>
            </div>
            <div className={'flex items-center justify-between text-gray-400 '}>
                <p>Vous avez deja un compte ?</p>
                <Link to={'/auth/login'} className={'text-primary'}>Se connecter</Link>
            </div>
        </RegisterCtxProvider>
    )
}