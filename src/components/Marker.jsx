export default function Marker({ mark }) {
  return (
    <div className="text-center mt-[-200px] py-8 animate-bounce-in">
      <div
        className={`text-6xl sm:text-7xl font-bold ${
          mark === "✔️"
            ? "text-green-600 animate-pulse-pop"
            : "text-red-600 animate-shake"
        }`}
      >
        {mark}
      </div>
      <p className="text-responsive-sm text-gray-600 mt-2">
        {mark === "✔️" ? "Correct! Well done!" : "Try again!"}
      </p>
    </div>
  );
}
