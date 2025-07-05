import { useCallback, useEffect, useState } from "react";
import { useLevels } from "../context/LevelContext";
import Confetti from "./Confetti";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Explanation({ onNext, levelIndex, onRestart, isLastLevel }) {
  // levelIndex is the completed level's index, not the next one
  const { levels } = useLevels();
  const [isVisible, setIsVisible] = useState(false);

  // Motivational sentences
  const motivationalSentences = [
    "Keep pushing your limits!",
    "You're on fire!",
    "Every step forward is progress.",
    "Your dedication is inspiring!",
    "Success is built on persistence.",
    "You're mastering this!",
    "Greatness is in your reach.",
    "You're unstoppable!",
    "Keep up the amazing work!",
    "Your hard work is paying off!",
    "You're making it look easy!",
    "Every challenge makes you stronger.",
    "You're a problem-solving machine!",
    "Your skills are leveling up!",
    "You're a true frontend wizard!",
    "Keep breaking those barriers!",
    "You're building your future!",
    "Your effort is your superpower.",
    "You're a coding rockstar!",
    "You're closer to your goals every day.",
    "Keep the momentum going!",
    "You're turning dreams into reality.",
    "You're a champion of learning!",
    "Your progress is impressive!",
    "You're making waves!",
    "You're a star in the making!",
    "You're crushing it!",
    "You're a step ahead!",
    "You're a code conqueror!",
    "You're a trailblazer!",
    "You're a frontend hero!",
    "You're a puzzle master!",
    "You're a logic legend!",
    "You're a UI/UX superstar!",
    "You're a creative thinker!",
    "You're a solution seeker!",
    "You're a tech explorer!",
    "You're a learning machine!",
    "You're a future leader!",
    "You're a code innovator!",
    "You're a frontend architect!",
    "You're a design dynamo!",
    "You're a challenge crusher!",
    "You're a knowledge builder!",
    "You're a skill sharpener!",
    "You're a growth champion!",
    "You're a perseverance pro!",
    "You're a detail detective!",
    "You're a bug buster!",
    "You're a syntax superstar!",
    "You're a code craftsman!",
    "You're a frontend force!",
    "You're a UI magician!",
    "You're a CSS artist!",
    "You're a JavaScript genius!",
    "You're a React ranger!",
    "You're a DOM dominator!",
    "You're a web warrior!",
    "You're a digital dreamer!",
    "You're a pixel perfectionist!",
    "You're a code champion!",
    "You're a frontend phenom!",
    "You're a user experience expert!",
    "You're a component creator!",
    "You're a state management master!",
    "You're a responsive design guru!",
    "You're a performance optimizer!",
    "You're a testing titan!",
    "You're a deployment dynamo!",
    "You're a version control virtuoso!",
    "You're a documentation devotee!",
    "You're a code reviewer extraordinaire!",
    "You're a lifelong learner!",
    "You're a team player!",
    "You're a mentor in the making!",
    "You're a frontend inspiration!",
    "You're a code community contributor!",
    "You're a feedback enthusiast!",
    "You're a project pioneer!",
    "You're a bug squasher!",
    "You're a sprint sprinter!",
    "You're a release rockstar!",
    "You're a roadmap ruler!",
    "You're a backlog boss!",
    "You're a feature finisher!",
    "You're a codebase caretaker!",
    "You're a merge master!",
    "You're a pull request pro!",
    "You're a CI/CD champion!",
    "You're a frontend finisher!",
    "You're a UI/UX unicorn!",
    "You're a web wizard!",
    "You're a digital dynamo!",
    "You're a code crusader!",
    "You're a frontend fanatic!",
    "You're a solution superstar!",
    "You're a code collaborator!",
    "You're a frontend friend!",
    "You're a code confidant!",
    "You're a web wonder!",
    "You're a frontend favorite!",
    "You're a code champion!",
    "You're a UI/UX up-and-comer!",
    "You're a frontend future star!",
  ];
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    setIsVisible(true);
    // Pick a random motivational sentence
    setMotivation(motivationalSentences[Math.floor(Math.random() * motivationalSentences.length)]);
  }, []);

  const handleNextClick = useCallback(() => {
    onNext();
  }, [onNext]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 font-sans" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Confetti celebration */}
      <Confetti trigger={true} />

      {/* Main Container */}
      <div
        className={`w-full bg-white rounded-lg p-3 sm:p-6 border border-green-200 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header */}
        <div className="text-center mb-4">
          {motivation && (
            <div className="text-base font-semibold text-green-700 italic mb-2">
              {motivation}
            </div>
          )}
          {isLastLevel ? (
            <>
              <p className="text-lg text-green-700 font-bold mb-2">You finished all levels!</p>
              <p className="text-base text-gray-700 mb-3">Congratulations! Do you want to restart from level 1? <span className='font-semibold text-emerald-600'>Your progress is saved!</span></p>
            </>
          ) : (
            <p className="text-lg text-gray-700 font-medium">
              Level {levelIndex + 1} Completed Successfully
            </p>
          )}
          <div className="w-16 h-1 bg-green-400 mx-auto mt-2"></div>
        </div>
        {/* Next Level Button */}
        <div className="text-center mt-2 mb-4">
          {isLastLevel ? (
            <button
              onClick={onRestart}
              className="w-full py-3 text-lg font-bold text-white bg-green-600 rounded-md border border-green-300 hover:bg-green-700 transition-all duration-200"
            >
              <span className="mr-2">🔄</span>
              Restart from Level 1
            </button>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2" style={{ minHeight: '36px', padding: '0.25rem 0.75rem' }}>
                <span className="text-lg">💡</span>
                <span className="text-sm text-blue-700 font-medium">
                  Ready for the next challenge? <span className="font-bold text-blue-500">Keep the momentum!</span> 💪
                </span>
              </div>
              <button
                onClick={handleNextClick}
                className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-md border border-blue-300 hover:bg-blue-700 transition-all duration-200 mb-2"
              >
                <span className="mr-2">🚀</span>
                Continue to Level {levelIndex + 2}
                <span className="ml-2">→</span>
              </button>
            </>
          )}
        </div>

        {/* Explanation Content */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-md p-3 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-lg">💡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                Solution Explanation
              </h3>
            </div>
            <MarkdownRenderer
              content={
                levels[levelIndex]?.explanation ||
                "Great job solving this puzzle! Your logical thinking and problem-solving skills are impressive. Keep up the excellent work!"
              }
              className="text-base text-gray-700 leading-relaxed"
              proseClassName="prose prose-base max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:text-gray-800"
            />
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          <div className="bg-yellow-50 rounded-md p-2 border border-yellow-200 text-center">
            <div className="text-xl font-bold text-yellow-600 mb-1">+1</div>
            <div className="text-xs text-yellow-700 font-medium">
              Point Earned
            </div>
          </div>
          <div className="bg-purple-50 rounded-md p-2 border border-purple-200 text-center">
            <div className="text-xl font-bold text-purple-600 mb-1">🔥</div>
            <div className="text-xs text-purple-700 font-medium">
              Streak Active
            </div>
          </div>
          <div className="bg-green-50 rounded-md p-2 border border-green-200 text-center">
            <div className="text-xl font-bold text-green-600 mb-1">⭐</div>
            <div className="text-xs text-green-700 font-medium">
              Perfect Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
