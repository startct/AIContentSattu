import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface TopicInputProps {
  onAddTopics: (topics: string[], blogCount: number, specialInstruction: string) => void;
  isGenerating: boolean;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  onAddTopics,
  isGenerating,
}) => {
  const [currentTopic, setCurrentTopic] = useState("");
  const [specialInstruction , setSpecialInstruction] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [blogCount, setBlogCount] = useState(1);

  const addTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
      setTopics([...topics, currentTopic.trim()]);
      setCurrentTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTopic.trim()) {
      addTopic();
    }
    if (topics.length > 0 || currentTopic.trim()) {
      const allTopics = currentTopic.trim()
        ? [...topics, currentTopic.trim()]
        : topics;
      onAddTopics(allTopics, blogCount , specialInstruction);
      setTopics([]);
      setCurrentTopic("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Blog Topics</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter a blog topic
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="topic"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              placeholder="e.g., Machine Learning, Sustainable Living, Digital Marketing..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isGenerating}
            />
            <button
              type="button"
              onClick={addTopic}
              disabled={!currentTopic.trim() || isGenerating}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="blogCount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Number of blogs per topic
          </label>
          <input
            type="number"
            id="blogCount"
            value={blogCount}
            onChange={(e) =>
              setBlogCount(Math.max(1, Number(e.target.value) || 1))
            }
            min="1"
            max="50"
            placeholder="Enter number of blogs per topic"
            disabled={isGenerating}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total blogs to generate:{" "}
            {(topics.length + (currentTopic.trim() ? 1 : 0)) * blogCount} (Max
            recommended: 20 per session)
          </p>
        </div>
        <div>
          <label
            htmlFor="blogCount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Special Instructions
          </label>
          <input
            type="text"
            id="blogInstructions"
            placeholder="Please enter any special instructions"
            disabled={isGenerating}
            onChange={(e) => setSpecialInstruction(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total blogs to generate:{" "}
            {(topics.length + (currentTopic.trim() ? 1 : 0)) * blogCount} (Max
            recommended: 20 per session)
          </p>
        </div>

        {topics.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Topics to generate:
            </h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200"
                >
                  <span className="text-sm font-medium">{topic}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    disabled={isGenerating}
                    className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {blogCount} blog{blogCount !== 1 ? "s" : ""} will be generated for
              each topic
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={
            (topics.length === 0 && !currentTopic.trim()) || isGenerating
          }
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isGenerating
            ? "Generating Blogs..."
            : `Generate ${
                (topics.length + (currentTopic.trim() ? 1 : 0)) * blogCount
              } Blog${
                (topics.length + (currentTopic.trim() ? 1 : 0)) * blogCount !==
                1
                  ? "s"
                  : ""
              }`}
        </button>
      </form>
    </div>
  );
};
