import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameTestingProvider } from './context/GameTestingContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GameList from './components/game/GameList';
import GamePage from './components/game/GamePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameTestingProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<GameList />} />
                <Route path="/game/:gameId" element={<GamePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </GameTestingProvider>
    </AuthProvider>
  );
};

export default App;