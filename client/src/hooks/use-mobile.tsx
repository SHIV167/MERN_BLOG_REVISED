import { useState, useEffect } from "react";

interface MobileState {
  isMobile: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isMedium: false,
    isLarge: true,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setState({
        isMobile: width < 768,
        isMedium: width >= 768 && width < 1024,
        isLarge: width >= 1024,
      });
    }

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return state;
}
