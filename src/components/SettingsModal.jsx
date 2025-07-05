import { useCallback } from "react";

// SVG ICONS
const SoundOnIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const SoundOffIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
const MusicOnIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
const MusicOffIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
  </svg>
);
const YoutubeIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M34.5 24.5L20.5 32.5V16.5L34.5 24.5Z" fill="white" />
  </svg>
);
const TikTokIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="12" fill="#000" />
    <path
      d="M32 18.5V28C32 32.1421 28.6421 35.5 24.5 35.5C20.3579 35.5 17 32.1421 17 28C17 23.8579 20.3579 20.5 24.5 20.5C25.3284 20.5 26 21.1716 26 22V28C26 29.1046 25.1046 30 24 30C22.8954 30 22 29.1046 22 28C22 26.8954 22.8954 26 24 26"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const InstagramIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="12" fill="#E1306C" />
    <rect
      x="14"
      y="14"
      width="20"
      height="20"
      rx="6"
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2" />
    <circle cx="32" cy="16" r="2" fill="white" />
  </svg>
);
const FacebookIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="12" fill="#1877F3" />
    <path
      d="M28 24h3.5l.5-4H28v-2c0-1.1.9-2 2-2h2v-4h-2c-3.3 0-6 2.7-6 6v2h-4v4h4v12h4V24z"
      fill="white"
    />
  </svg>
);

export default function SettingsModal({
  onClose,
  bgMusicOn,
  setBgMusicOn,
  buttonSoundOn,
  setButtonSoundOn,
  notificationOn,
  setNotificationOn,
  totalHintPoints,
  language = "English",
  setLanguage,
}) {
  const handleSoundToggle = useCallback(() => {
    setButtonSoundOn(!buttonSoundOn);
  }, [buttonSoundOn, setButtonSoundOn]);
  const handleMusicToggle = useCallback(() => {
    setBgMusicOn(!bgMusicOn);
  }, [bgMusicOn, setBgMusicOn]);

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-md mx-4 animate-bounce-in relative rounded-2xl shadow-2xl border border-blue-200 bg-white/95">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold w-10 h-10 rounded-full hover:bg-blue-100 transition-colors flex items-center justify-center"
          aria-label="Close settings modal"
        >
          <CloseIcon />
        </button>
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wider bg-gradient-to-r from-blue-500 to-purple-500 ">
          ⚙️ সেটিংস
        </h2>
        {/* Language Selector */}
        <div className="flex items-center justify-center mb-6 gap-3">
          <GlobeIcon />
          <span className="font-bold text-lg text-gray-700">ভাষা</span>
          <select
            className="input text-base bg-white border-2 border-blue-200 focus:border-blue-400 rounded-lg ml-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select language"
          >
            <option value="english">English</option>
            <option value="bangla">বাংলা</option>
            <option value="hindi">हिंदी</option>
          </select>
        </div>
        {/* Audio Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  bgMusicOn
                    ? "bg-blue-500 text-white scale-110"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {bgMusicOn ? <MusicOnIcon /> : <MusicOffIcon />}
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-800">
                  ব্যাকগ্রাউন্ড মিউজিক
                </h3>
                <p className="text-xs text-gray-600">
                  মনোযোগের জন্য ব্যাকগ্রাউন্ড সঙ্গীত
                </p>
              </div>
            </div>
            <button
              onClick={handleMusicToggle}
              className={`px-5 py-2 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                bgMusicOn
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label={
                bgMusicOn
                  ? "Turn off background music"
                  : "Turn on background music"
              }
            >
              {bgMusicOn ? "চালু করো" : "বন্ধ করো"}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  buttonSoundOn
                    ? "bg-green-500 text-white scale-110"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {buttonSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-800">
                  বাটনের শব্দ
                </h3>
                <p className="text-xs text-gray-600">বাট ক্লিক প্রতিক্রিয়া</p>
              </div>
            </div>
            <button
              onClick={handleSoundToggle}
              className={`px-5 py-2 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                buttonSoundOn
                  ? "bg-green-500 text-white shadow-lg shadow-green-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label={
                buttonSoundOn
                  ? "Turn off button sounds"
                  : "Turn on button sounds"
              }
            >
              {buttonSoundOn ? "চালু করো" : "বন্ধ করো"}
            </button>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-yellow-400  font-bold text-lg shadow-md hover:scale-105 transition-transform"
            aria-label="Try other games"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14.31 8l5.74 9.94" />
              <path d="M9.69 8h11.48" />
              <path d="M7.38 12l5.74-9.94" />
              <path d="M9.69 16H2.21" />
              <path d="M14.31 16l-5.74 9.94" />
            </svg>
            Try Other Games
          </button>
          <div className="flex w-full gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400  font-bold text-base shadow-md hover:scale-105 transition-transform"
              aria-label="Get support"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="10" />
                <path d="M11 15v2" />
                <path d="M11 7v4" />
              </svg>
              mojnu6 Primary
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-400  font-bold text-base shadow-md hover:scale-105 transition-transform"
              aria-label="Share the game"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              mojnu6 BCS
            </button>
          </div>
        </div>
        {/* Social Media */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className="relative group"
            aria-label="Visit our YouTube channel"
          >
            <YoutubeIcon />
            <span className="absolute -bottom-2 -right-3 bg-yellow-200 rounded-full px-2 text-xs font-bold border border-yellow-400 shadow">
              +50
            </span>
          </button>
          <button className="group" aria-label="Follow us on TikTok">
            <TikTokIcon />
          </button>
          <button className="group" aria-label="Follow us on Instagram">
            <InstagramIcon />
          </button>
          <button className="group" aria-label="Follow us on Facebook">
            <FacebookIcon />
          </button>
        </div>
        {/* Footer Links */}
        <div className="flex justify-between text-xs mt-2">
          <a
            href="#"
            className="text-blue-700 underline hover:text-blue-900 transition-colors"
            aria-label="Read privacy policy"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-blue-700 underline hover:text-blue-900 transition-colors"
            aria-label="Read terms of use"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
}
