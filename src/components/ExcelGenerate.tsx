import React from "react";

import { GeneratedBlog } from "../types/blog";
// Function to properly escape CSV values
const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const convertToCSV = (data: any): string => {
  if (data.length === 0) return "";

  // Create headers
  const headers = ["ID", "Topic", "Title", "Content", "Word Count"];

  // Create rows
  const rows = data.map(
    (blog: {
      id: string;
      topic: string;
      title: string;
      content: string;
      summary: string;
      wordCount: { toString: () => any };
      generatedAt: string;
    }) => [
      escapeCSV(blog.id),
      escapeCSV(blog.topic),
      escapeCSV(blog.title),
      escapeCSV(blog.content),
      blog.wordCount.toString(),
    ]
  );

  // Combine headers and rows
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};

const handleExport = (generatedBlogs: GeneratedBlog[]) => {
  try {
    const csvData = convertToCSV(generatedBlogs);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "blog_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

interface ExcelGenerateProps {
  generatedBlogs: GeneratedBlog[];
  disabled : boolean
}

export const ExcelGenerate: React.FC<ExcelGenerateProps> = ({
  generatedBlogs,disabled
}) => {
  return (
    <button
    disabled={disabled}
      onClick={() => handleExport(generatedBlogs)}
      className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      Export to CSV
    </button>
  );
};
