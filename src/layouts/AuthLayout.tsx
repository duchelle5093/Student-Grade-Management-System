import { Outlet} from "react-router";

export const AuthLayout = () => {

    return (
        <div>
            <div  className="md:bg-[url(./images/Frame.png)] bg-center bg-cover w-full h-screen fixed left-0 right-0 z-1 blur-3xl"/>
            <section className={' w-screen h-screen bg-inherit flex items-center md:justify-center  '}>
                <div className={'shadow-2xl w-full 2xl:w-1/2 lg:w-3/4 md:h-[75%] h-[65%] flex items-center justify-center relative z-100 rounded-lg bg-bgColor'}>
                    <div className={`hidden lg:block w-1/2 h-full bg-[url(./images/Frame.png)] bg-center bg-cover`}/>
                    <div className={'w-full lg:w-1/2 h-full flex flex-col justify-around px-7 md:px-20 lg:px-10 '}>
                        <Outlet/>
                    </div>
                </div>
            </section>
        </div>
    )
}

