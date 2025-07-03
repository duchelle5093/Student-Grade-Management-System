import {LoginForm} from "./views";
import {Link} from "react-router";

export const LoginPage = () => {

    return (
        <div>
            <div  className="bg-[url(./images/Frame.png)] bg-center bg-cover w-full h-screen fixed left-0 right-0 z-1 blur-3xl"/>
            <section className={' w-screen h-screen bg-inherit flex items-center md:justify-center  '}>
                <div className={'shadow-2xl w-full 2xl:w-1/2 lg:w-3/4 md:h-[75%] h-[65%] flex items-center justify-center relative z-100 rounded-lg bg-bgColor'}>
                    <div className={`hidden lg:block w-1/2 h-full bg-[url(./images/Frame.png)] bg-center bg-cover`}/>
                    <div className={'w-full lg:w-1/2 h-full flex flex-col justify-around px-7 md:px-20 lg:px-10 '}>
                        <div>
                            <p className={'text-primary text-6xl md:text-[6rem] 2xl:text-7xl lg:text-5xl'}>Gestion <br/>des notes</p>
                        </div>
                        <div className={'w-full xl:-mt-15 md:-mt-52 mb-10'}>
                            <h2 className={' text-gray-500 font-bold text-3xl'}>Bonjour !</h2>
                            <p className={'my-4 text-gray-400'}>Connectez vous pour commencer a travailler </p>
                            <LoginForm/>
                            <div className={'flex items-center justify-between text-gray-400 mt-5'}>
                                <p>Vous n'avez pas de compte ?</p>
                                <Link to={'register'} className={'text-primary'}>S'inscrire</Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}