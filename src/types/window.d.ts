// Extend the Window interface to include gtag for Google Analytics
interface Window {
  gtag?: (...args: unknown[]) => void;
}
