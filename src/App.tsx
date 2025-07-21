// Main React application component for Steward AI assistant
import { ThemeProvider } from './contexts/ThemeContext';
import MainWindow from './windows/MainWindow';

function App() {
  return (
    <ThemeProvider>
      <MainWindow />
    </ThemeProvider>
  );
}

export default App;
