
interface SideBarHeaderProps {
    title: string;
}

export const SideBarHeader = ({ title }: SideBarHeaderProps) => {
    return (
        <header className="flex  items-center justify-center h-30">
           <span className={'font-bold lg:text-5xl text-primary '}>{title}</span>
        </header>
    );
};
