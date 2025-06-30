"use client";
import React from "react";

function MainComponent() {
  const { useState, useEffect } = React;
  const [expandedFolders, setExpandedFolders] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExpandedFolders({
      "hyam-movement-portal": true,
      app: true,
      lib: true,
    });
  }, []);

  const fileStructure = {
    name: "hyam-movement-portal",
    type: "folder",
    children: [
      { name: "package.json", type: "file" },
      {
        name: "app",
        type: "folder",
        children: [
          { name: "globals.css", type: "file" },
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file", description: "(main portal)" },
        ],
      },
      {
        name: "lib",
        type: "folder",
        children: [{ name: "supabase.ts", type: "file" }],
      },
      { name: "next.config.js", type: "file" },
    ],
  };

  const toggleFolder = (folderPath) => {
    if (!mounted) return;
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const downloadStructure = () => {
    if (!mounted) return;
    const content = JSON.stringify(fileStructure, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hyam-movement-portal-structure.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderItem = (item, level = 0, path = "") => {
    const currentPath = path ? `${path}.${item.name}` : item.name;
    const paddingLeft = `${level * 20}px`;

    if (!mounted) {
      return (
        <div key={currentPath} className="py-2" style={{ paddingLeft }}>
          <span className="font-roboto">{item.name}</span>
        </div>
      );
    }

    return (
      <div key={currentPath}>
        <div
          className="flex items-center py-2 hover:bg-gray-100 cursor-pointer"
          style={{ paddingLeft }}
        >
          {item.type === "folder" && (
            <i
              className={`fas ${
                expandedFolders[currentPath] ? "fa-folder-open" : "fa-folder"
              } text-yellow-500 mr-2`}
              onClick={() => toggleFolder(currentPath)}
            />
          )}
          {item.type === "file" && (
            <i className="fas fa-file text-blue-500 mr-2" />
          )}
          <span className="font-roboto">{item.name}</span>
          {item.description && (
            <span className="text-gray-500 ml-2 text-sm">
              {item.description}
            </span>
          )}
        </div>
        {item.type === "folder" &&
          expandedFolders[currentPath] &&
          item.children && (
            <div>
              {item.children.map((child) =>
                renderItem(child, level + 1, currentPath)
              )}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-roboto font-bold text-gray-800">
            Project Structure
          </h1>
          <button
            onClick={downloadStructure}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={!mounted}
          >
            <i className="fas fa-download mr-2" />
            Download Structure
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderItem(fileStructure)}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;