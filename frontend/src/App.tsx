import { GamePage } from './pages/GamePage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <GamePage />
    </ErrorBoundary>
  );
}

export default App;
