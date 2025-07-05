import { useCallback, useEffect, useState } from "react";
import playSound from "../utils/playSound.jsx";

export default function WelcomeToGame({ setBgMusicOn, setWelcome }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: "📚",
      title: "HSC ভর্তি পরীক্ষার প্রস্তুতি",
      description:
        "mojnu6 এর সাথে পদার্থ বিজ্ঞান, রসায়ন, উচ্চতর গণিত, বায়োলজি ও ইংরেজি বিষয়ে প্রস্তুতি নিন।",
    },
    {
      icon: "📅",
      title: "প্রতিদিন প্রাকটিস",
      description:
        "নিয়মিত প্রাকটিস করো, বেশি বেশি পয়েন্ট কালেক্ট করে পুরুষ্কার বুঝে নাও।",
    },
    {
      icon: "🧑‍💻",
      title: "mojnu6 এর বিশেষজ্ঞ নির্দেশনা",
      description:
        "তোমার মেন্টর mojnu6 থেকে প্রতিটি চ্যালেঞ্জ সমাধানের টিপস ও হিন্ট পাও।",
    },
    {
      icon: "🚀",
      title: "লেভেল আপ করে ভর্তি পরীক্ষার জন্য প্রস্তুত হও",
      description:
        "লেভেল অতিক্রম করে ভর্তি পরীক্ষার জন্য তোমার আত্মবিশ্বাস গড়ে তোলো।",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleStartGame = useCallback(() => {
    playSound("/sounds/button-sound.mp3");
    setBgMusicOn(true);
    setWelcome(false);
    // Scroll to top when starting the game
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setBgMusicOn, setWelcome]);

  return (
    <div
      className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-white font-sans"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Main Content Container */}
      <div
        className={`w-full max-w-2xl mx-auto px-2 sm:px-6 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 mb-2 leading-tight tracking-tight">
              HSC ভর্তি প্রস্তুতি
              <span className="text-gray-700 ml-2 sm:ml-4">
                বিজ্ঞান শিক্ষার্থীদের জন্য
              </span>
            </h1>
            <div className="w-16 h-1 bg-blue-400 mx-auto rounded-full"></div>
          </div>

          <p className="text-base sm:text-lg text-gray-700 font-light max-w-xl mx-auto leading-relaxed">
            স্বাগতম{" "}
            <span className="font-bold text-blue-600">
              mojnu6 HSC ভর্তি প্রস্তুতিতে!
            </span>
            ! দৈনিক HSC ভর্তি পরীক্ষার প্রশ্ন অনুশীলন করে, মাথা চালু রাখো।
            মেন্টর <span className="font-bold text-pink-600">mojnu6</span> এর
            নির্দেশনায়, বাস্তব চ্যালেঞ্জ এবং স্মার্ট হিন্ট দিয়ে লেভেল পার করো।
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-md bg-gray-50 border border-gray-200 transition-all duration-500 ${
                currentFeature === index ? "ring-2 ring-blue-400/50" : ""
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-3xl sm:text-4xl mb-2 transition-all duration-300 ${
                    currentFeature === index ? "animate-bounce" : ""
                  }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-blue-700 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mb-6">
          <button
            onClick={handleStartGame}
            className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-md transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-opacity-70"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🚀</span>
              এখন অনুশীলন শুরু করো
              <span className="ml-2">💡</span>
            </span>
          </button>
          <p className="mt-3 text-sm text-gray-500 font-light">
            mojnu6 এর সাথে তোমার HSC ভর্তি প্রস্তুতির যাত্রা শুরু করতে ক্লিক
            করো! 🚀
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-4">
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
              100+
            </div>
            <div className="text-xs text-gray-600">প্রশ্ন</div>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
              5
            </div>
            <div className="text-xs text-gray-600">কঠিনতার স্তর</div>
          </div>
          <div className="text-center p-3 rounded-md bg-gray-50 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">
              ∞
            </div>
            <div className="text-xs text-gray-600">মজার সময়</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <span>✨</span>
            <span className="font-light">
              তুমি কি তোমার সম্ভাবনা উন্মোচন করতে প্রস্তুত?
            </span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
