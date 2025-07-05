import { NavLink } from "react-router";
import { useLevels } from "../../context/LevelContext";

// Zenith Icons
const HomeIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const AddIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);
const LevelIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);
const TransactionIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const SurveyIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

export default function Sidebar() {
  const { levels } = useLevels();

  const activeLinkStyle = {
    backgroundColor: "var(--accent-blue)",
    color: "white",
  };

  return (
    <aside className="w-full md:w-64 bg-[--secondary-bg] text-[--text-color] h-auto md:h-full overflow-y-auto flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 p-4">
      {/* Mobile Header */}
      <div className="md:hidden text-center mb-4">
        <h3 className="text-2xl font-bold text-[--accent-blue]">Admin</h3>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden md:block text-center mb-8">
        <h3 className="text-3xl font-bold text-[--accent-blue]">Admin</h3>
      </div>
      
      {/* Mobile Navigation - Horizontal */}
      <nav className="md:hidden flex flex-wrap gap-2 justify-center">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/dashboard/add"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <AddIcon />
          <span>Add</span>
        </NavLink>
        <NavLink
          to="/dashboard/transactions"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <TransactionIcon />
          <span>Transactions</span>
        </NavLink>
        <NavLink
          to="/dashboard/survey"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <SurveyIcon />
          <span>Survey</span>
        </NavLink>
      </nav>

      {/* Desktop Navigation - Vertical */}
      <nav className="hidden md:flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/dashboard/add"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <AddIcon />
          <span>Add Level</span>
        </NavLink>
        <NavLink
          to="/dashboard/transactions"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <TransactionIcon />
          <span>Transactions</span>
        </NavLink>
        <NavLink
          to="/dashboard/survey"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <SurveyIcon />
          <span>Survey</span>
        </NavLink>

        <div className="mt-4">
          <h4 className="px-4 text-sm font-bold text-gray-500 uppercase">
            Levels
          </h4>
          <ul className="mt-2 space-y-1">
            {levels?.map((level, i) => (
              <li key={level._id}>
                <NavLink
                  to={`/dashboard/edit/${level._id}`}
                  style={({ isActive }) =>
                    isActive ? activeLinkStyle : undefined
                  }
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <LevelIcon />
                  <span>{`Level ${i + 1}`}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
