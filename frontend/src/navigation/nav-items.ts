import { BiGridAlt } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";

export const navigationItems = [
    { id: 1, name: 'Properties', icon: BiGridAlt, t: '/properties' },
    { id: 2, name: 'Menus', icon: BiGridAlt, t: '/menus' }
];

export const secondaryNavigationItems = [
    { id: 1, name: 'Users & Group', icon: FaFolder, t: '/users-and-groups' },
    { id: 2, name: 'Competition', icon: FaFolder, t: '/competition' }
];