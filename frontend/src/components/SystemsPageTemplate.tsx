import { BiGridAlt } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import { GrGrid } from "react-icons/gr";

interface SystemsPageTemplateProps {
    pageTitle: string;
    children: React.ReactNode;
}

export default function SystemsPageTemplate({ pageTitle, children }: SystemsPageTemplateProps) {
    return (
        <div className="flex flex-col space-y-8">
            <div className="flex flex-row items-center gap-2 mb-6">
                <FaFolder className="text-gray-300 scale-125" />
                <p><span className="text-gray-300">/</span> {pageTitle}</p>
            </div>
            <div className="flex flex-row items-center space-x-4">
                <div className="bg-blue-800 w-10 h-10 flex items-center justify-center rounded-full">
                    <BiGridAlt className="w-6 h-6 rounded-full text-white"/>
                </div>
                <p className="text-2xl font-semibold">{pageTitle}</p>
            </div>
            {children}
        </div>
    )
}