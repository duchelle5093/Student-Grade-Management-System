import { Button } from 'antd';
import notFoundImage from '../images/404.png';


export default function NotFoundView() {

    const handleBack = () => {
        window.history.back();
    }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
         <img src={notFoundImage} alt="Page not found"/>
        <div className="text-center">
            <p className="mt-10 text-gray-500">La page que vous recherchez n'existe pas.</p>
            <Button onClick={handleBack} className='mt-10 !px-10 !py-5'>Retour</Button>
        </div>
       
    </div>
  )
}
