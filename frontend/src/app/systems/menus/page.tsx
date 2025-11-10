import SystemsPageTemplate from "@/components/SystemsPageTemplate"
import MenusContainer from "@/containers/menus/MenusContainer"
import { FaFolder } from "react-icons/fa"

export default function Menus() {
    return (
        <SystemsPageTemplate pageTitle="Menus">
            <MenusContainer />
        </SystemsPageTemplate>
    )
}