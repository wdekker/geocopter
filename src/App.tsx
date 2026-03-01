import { GameMap } from './components/Map';
import { LanguageProvider } from './contexts/LanguageContext';


function App() {
  return (
    <LanguageProvider>
      {/*
        Inject pulse animation globally for the target icon.
        In a larger app, this should go in a proper CSS module or global css file.
      */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(255, 0, 0, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
          }
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
          }
          #root {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            max-width: none;
          }
        `}
      </style>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a', // Dark theme background
        color: 'white',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* ... application layer */}
        <GameMap />
      </div>
    </LanguageProvider>
  );
}

export default App;
