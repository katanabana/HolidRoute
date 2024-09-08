import { useEffect, useState } from 'react';

function useKeyboardStatus() {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [initialViewportHeight, setInitialViewportHeight] = useState(window.visualViewport.height);

    useEffect(() => {
        const handleResize = () => {
            const currentViewportHeight = window.visualViewport.height;
            
            // Compare the initial viewport height with the current one
            if (currentViewportHeight < initialViewportHeight) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
            }
        };

        // Set the initial viewport height
        setInitialViewportHeight(window.visualViewport.height);

        // Listen to the resize event on the visual viewport
        window.visualViewport.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        // Clean up the event listener
        return () => window.visualViewport.removeEventListener('resize', handleResize);
    }, [initialViewportHeight]);

    return isKeyboardOpen;
}

export default useKeyboardStatus;
