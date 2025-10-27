import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import HiveGuide from "./pages/HiveGuide";
import Home from "./pages/Home";
import IdeaBoard from "./pages/IdeaBoard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import IdeaDetail from "./pages/IdeaDetail";
import CodeTalks from "./pages/CodeTalks";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import DevCards from "./pages/DevCards";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { startTokenRefresh } from "./lib/tokenRefresh";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const onScroll = () => {
      const navbars = document.querySelectorAll('.navbar');
      const scrolled = window.scrollY > 8;
      navbars.forEach((el) => {
        if (scrolled) el.classList.add('scrolled');
        else el.classList.remove('scrolled');
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Start token refresh if user is logged in
    startTokenRefresh();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="peve-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/hive-guide" element={<HiveGuide />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/ideas" element={
                <ProtectedRoute>
                  <IdeaBoard />
                </ProtectedRoute>
              } />
              <Route path="/ideas/:id" element={
                <ProtectedRoute>
                  <IdeaDetail />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/codetalks" element={
                <ProtectedRoute>
                  <CodeTalks />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile/:userId" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/devcards" element={
                <ProtectedRoute>
                  <DevCards />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              } />
              
              {/* 404 Page - Also Protected */}
              <Route path="*" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
