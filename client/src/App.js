import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { FaFootballBall, FaTrophy, FaChartLine, FaNewspaper } from 'react-icons/fa';

import Scores from './components/Scores';
import Standings from './components/Standings';
import Stats from './components/Stats';
import News from './components/News';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

const theme = {
  colors: {
    primary: '#1976d2',
    secondary: '#757575',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '8px',
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.primary};
      opacity: 0.8;
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
  }

  input, select {
    outline: none;
    border: 1px solid #ddd;
    border-radius: ${props => props.theme.borderRadius};
    padding: ${props => props.theme.spacing.sm};
    transition: border-color 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius};
  transition: background-color 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  &.active {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const Main = styled.main`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
  width: 100%;
`;

const Footer = styled.footer`
  background: ${props => props.theme.colors.surface};
  border-top: 1px solid #eee;
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: auto;
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [window.location.pathname]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Loading />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        <Router>
          <AppContainer>
            <Header>
              <Nav>
                <Logo>
                  <FaFootballBall />
                  NFL Aggregator
                </Logo>
                <NavLinks>
                  <NavLink 
                    to="/" 
                    className={currentPath === '/' ? 'active' : ''}
                  >
                    <FaFootballBall />
                    Scores
                  </NavLink>
                  <NavLink 
                    to="/standings" 
                    className={currentPath === '/standings' ? 'active' : ''}
                  >
                    <FaTrophy />
                    Standings
                  </NavLink>
                  <NavLink 
                    to="/stats" 
                    className={currentPath === '/stats' ? 'active' : ''}
                  >
                    <FaChartLine />
                    Stats
                  </NavLink>
                  <NavLink 
                    to="/news" 
                    className={currentPath === '/news' ? 'active' : ''}
                  >
                    <FaNewspaper />
                    News
                  </NavLink>
                </NavLinks>
              </Nav>
            </Header>

            <Main>
              <Routes>
                <Route path="/" element={<Scores />} />
                <Route path="/standings" element={<Standings />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/news" element={<News />} />
              </Routes>
            </Main>

            <Footer>
              <p>&copy; 2023 NFL Aggregator. Built with React and Node.js</p>
            </Footer>
          </AppContainer>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

