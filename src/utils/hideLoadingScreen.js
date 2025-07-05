/**
 * Utility function to hide the initial loading screen
 * Can be called from React components when the app is fully loaded
 */
export const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById('initial-loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
};

/**
 * Utility function to show the loading screen again (if needed)
 */
export const showLoadingScreen = () => {
    const loadingScreen = document.getElementById('initial-loading');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
}; 