import {LoginForm} from "./views";
import {Link} from "react-router";

export const LoginPage = () => {

    return (
        <>
            <div>
                <p className={'text-primary text-6xl md:text-[6rem] 2xl:text-7xl lg:text-5xl'}>Gestion <br/>des notes</p>
            </div>
            <div className={'w-full xl:-mt-15 md:-mt-52 mb-10'}>
                <h2 className={' text-gray-500 font-bold text-3xl'}>Bonjour !</h2>
                <p className={'my-4 text-gray-400'}>Connectez vous pour commencer a travailler </p>
                <LoginForm/>
                <div className={'flex items-center justify-between text-gray-400 mt-5'}>
                    <p>Vous n'avez pas de compte ?</p>
                    <Link to={'/auth/register'} className={'text-primary'}>S'inscrire</Link>
                </div>
            </div>
        </>
    )
}