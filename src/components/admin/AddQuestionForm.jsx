import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useLevels } from "../../context/LevelContext";
import SuccessModal from "../SuccessModal";
import MarkdownEditor from "./MarkdownEditor";

export default function AddQuestionForm() {
  const [levelData, setLevelData] = useState({
    question: "",
    answer: "",
    explanation: "",
    hint: "",
    options: [],
    category: "MATH",
  });
  const { user } = useAuth();
  const { levels, setLevels } = useLevels();
  const navigate = useNavigate();
  const params = useParams();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = ["MATH", "PHYSICS", "CHEMISTRY", "BIOLOGY", "ENGLISH"];

  useEffect(() => {
    if (params?.id) {
      const currentLevel = levels?.find((level) => level?._id === params?.id);
      if (currentLevel) {
        setLevelData({
          question: currentLevel.question,
          answer: currentLevel.answer,
          explanation: currentLevel.explanation,
          hint: currentLevel.hint,
          options: currentLevel?.options || [],
          category: currentLevel.category,
        });
      }
    } else {
      setLevelData({
        question: "",
        answer: "",
        explanation: "",
        hint: "",
        options: [],
        category: "MATH",
      });
    }
  }, [params?.id, levels]);

  function handleOptionChange(e, index) {
    const newOptions = [...levelData.options];
    newOptions[index] = e.target.value;
    setLevelData((prev) => ({ ...prev, options: newOptions }));
  }

  function resetForm() {
    setLevelData({
      question: "",
      answer: "",
      explanation: "",
      hint: "",
      options: [],
      category: "MATH",
    });
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      const response = await api.delete(`/api/levels/${params?.id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 200) {
        setLevels(levels?.filter((level) => level._id !== params?.id));
        resetForm();
        setSuccessMessage("Question deleted successfully!");
        setSuccessModalOpen(true);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete level:", error);
    }
  }

  async function addLevel() {
    try {
      const dataToSend = {
        ...levelData,
        options: levelData.options.filter((option) => option.trim() !== ""),
      };
      const response = await api.post("/api/levels", dataToSend, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 201) {
        setLevels([...levels, response.data]);
        resetForm();
        setSuccessMessage("Question added successfully!");
        setSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to add level:", error);
    }
  }

  async function updateLevel() {
    try {
      const dataToSend = {
        ...levelData,
        options: levelData.options.filter((option) => option.trim() !== ""),
      };
      const response = await api.put(`/api/levels/${params?.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.status === 200) {
        setLevels(
          levels?.map((level) =>
            level._id === params?.id ? response.data : level
          )
        );
        setSuccessMessage("Question updated successfully!");
        setSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  }

  return (
    <div className="p-8 bg-[--primary-bg] text-[--text-color]">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-[--accent-blue] mb-6">
          {params?.id ? "Edit Question" : "Add New Question"}
        </h1>
        <div className="space-y-6">
          <MarkdownEditor
            label="Question"
            value={levelData.question}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, question: e.target.value }))
            }
          />
          <div>
            <label className="block text-sm font-bold mb-2">Options</label>
            {levelData.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <MarkdownEditor
                  value={opt}
                  onChange={(e) => handleOptionChange(e, idx)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setLevelData((prev) => ({
                      ...prev,
                      options: prev.options.filter((_, i) => i !== idx),
                    }))
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setLevelData((prev) => ({
                  ...prev,
                  options: [...prev.options, ""],
                }))
              }
              className="btn btn-secondary"
            >
              Add Option
            </button>
          </div>
          <MarkdownEditor
            label="Answer"
            value={levelData.answer}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, answer: e.target.value }))
            }
          />
          <MarkdownEditor
            label="Hint"
            value={levelData.hint}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, hint: e.target.value }))
            }
          />
          <MarkdownEditor
            label="Explanation"
            value={levelData.explanation}
            onChange={(e) =>
              setLevelData((prev) => ({ ...prev, explanation: e.target.value }))
            }
          />
          <div>
            <label className="block text-sm font-bold mb-2">Category</label>
            <select
              value={levelData.category}
              onChange={(e) =>
                setLevelData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            {params?.id ? (
              <>
                <button onClick={updateLevel} className="btn btn-primary">
                  Update Question
                </button>
                <button
                  onClick={handleDelete}
                  className="btn bg-red-500 text-white"
                >
                  Delete Question
                </button>
              </>
            ) : (
              <button onClick={addLevel} className="btn btn-primary">
                Add Question
              </button>
            )}
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={successModalOpen}
        message={successMessage}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}
