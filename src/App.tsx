import React, { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import NewAnalysis from "./components/NewAnalysis";
import { AuthState, Analysis } from "./types";
import { mockUser, mockAnalyses } from "./data/mockData";
import { AnalysisDetail } from "./components/AnalysisDetail";
type ViewState = "login" | "dashboard" | "analysis" | "new-analysis";

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(
    null
  );
  const [analyses, setAnalyses] = useState<Analysis[]>(mockAnalyses);

  // Handle login
  const handleLogin = (email: string, password: string) => {
    // Simple demo authentication
    if (email === "demo@contentai.com" && password === "demo123") {
      setAuthState({
        isAuthenticated: true,
        user: mockUser,
      });
      setCurrentView("dashboard");
    } else {
      alert("Invalid credentials. Use demo@contentai.com / demo123");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    setCurrentView("login");
    setSelectedAnalysis(null);
  };

  // Handle view analysis
  const handleViewAnalysis = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setCurrentView("analysis");
  };

  // Handle create new analysis
  const handleCreateNew = () => {
    setCurrentView("new-analysis");
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentView("dashboard");
    setSelectedAnalysis(null);
  };

  // Render appropriate view based on current state
  const renderCurrentView = () => {
    if (!authState.isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            user={authState.user!}
            analyses={analyses}
            onViewAnalysis={handleViewAnalysis}
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
          />
        );
      case "analysis":
        return selectedAnalysis ? (
          <AnalysisDetail analysis={selectedAnalysis} onBack={handleBack} />
        ) : (
          <Dashboard
            user={authState.user!}
            analyses={analyses}
            onViewAnalysis={handleViewAnalysis}
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
          />
        );
      case "new-analysis":
        return <NewAnalysis onBack={handleBack} />;
      default:
        return (
          <Dashboard
            user={authState.user!}
            analyses={analyses}
            onViewAnalysis={handleViewAnalysis}
            onCreateNew={handleCreateNew}
            onLogout={handleLogout}
          />
        );
    }
  };

  return <div className="App">{renderCurrentView()}</div>;
}

export default App;
