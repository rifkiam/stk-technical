import { useEffect, useState } from "react";

const useWindowResize = () => {
    const [windowWidthSize, setWindowWidthSize] = useState<number | null>(1024);
    const [windowHeightSize, setWindowHeightSize] = useState<number | null>(null);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidthSize(window.innerWidth);
            setWindowHeightSize(window.innerHeight);
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, [])
    return { windowWidthSize, windowHeightSize };
}

export default useWindowResize;