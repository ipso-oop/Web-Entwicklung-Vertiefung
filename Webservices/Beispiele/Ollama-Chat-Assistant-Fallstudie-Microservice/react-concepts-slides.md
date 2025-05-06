# React Konzepte - Wiederholung mit Ollama Chat Assistant

## 1. React Grundlagen
- React ist eine JavaScript-Bibliothek für die Erstellung von Benutzeroberflächen
- Komponenten-basierte Architektur
- Virtuelles DOM für effiziente Updates
- JSX-Syntax für deklarative UI-Beschreibung
- Beispiel aus unserer App: `App.jsx` als Hauptkomponente
```jsx
function App() {
  return (
    <div className="app">
      <div className="sidebar">
        <ModelSelector />
        <FileUpload />
      </div>
      <div className="main-content">
        <ChatInterface />
      </div>
    </div>
  );
}
```

## 2. Komponenten und Props
- Komponenten sind wiederverwendbare UI-Elemente
- Props sind Eigenschaften, die an Komponenten übergeben werden
- Props sind read-only (unveränderlich)
- Beispiel: `ModelSelector` Komponente
```jsx
function ModelSelector({ currentModel, onModelChange }) {
  return (
    <div className="model-selector">
      <h3>Select Model</h3>
      <div className="model-buttons">
        <button
          className={`model-button ${currentModel === 'local' ? 'active' : ''}`}
          onClick={() => onModelChange('local')}
        >
          Local Model
        </button>
        <button
          className={`model-button ${currentModel === 'external' ? 'active' : ''}`}
          onClick={() => onModelChange('external')}
        >
          External Model
        </button>
      </div>
    </div>
  );
}
```

## 3. State Management mit Hooks
- `useState`: Lokaler State in Komponenten
- State-Updates sind asynchron
- State sollte nicht direkt mutiert werden
- Beispiel aus `App.jsx`:
```jsx
// State für das aktuelle Modell
const [currentModel, setCurrentModel] = useState('local');

// State für die Chat-Nachrichten
const [messages, setMessages] = useState([]);

// State für hochgeladene Dateien
const [uploadedFiles, setUploadedFiles] = useState(new Map());

// State-Update mit vorherigem State
setMessages(prev => [...prev, newMessage]);
```

## 4. Lifecycle und useEffect
- `useEffect` für Seiteneffekte
- Dependencies Array für kontrollierte Ausführung
- Cleanup-Funktionen für Ressourcen
- Beispiele aus unserer App:
```jsx
// Einmaliges Laden beim Mount
useEffect(() => {
  loadChatHistory();
}, []);

// Ausführung bei Änderung der Nachrichten
useEffect(() => {
  scrollToBottom();
}, [messages]);

// Cleanup Beispiel
useEffect(() => {
  const timer = setInterval(() => {
    // Periodische Aktion
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

## 5. Event Handling
- Events in React sind camelCase
- Event-Handler sind Funktionen
- Event-Objekt enthält nützliche Informationen
- Beispiele aus `ChatInterface.jsx`:
```jsx
// Formular-Submit
const handleSubmit = (e) => {
  e.preventDefault();
  if (inputValue.trim()) {
    onSendMessage(inputValue);
    setInputValue('');
  }
};

// Tastatur-Events
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
};

// Datei-Upload
const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    onFileUpload(e.target.files);
    e.target.value = ''; // Reset input
  }
};
```

## 6. Formular-Handling
- Kontrollierte Komponenten
- Unkontrollierte Komponenten
- Formular-Validierung
- Beispiele aus unserer App:
```jsx
// Kontrollierte Textarea
<textarea
  ref={textareaRef}
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Type your message here..."
  className="chat-input"
/>

// Dynamische Höhenanpassung
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
  }
}, [inputValue]);
```

## 7. Refs und DOM-Zugriff
- `useRef` für direkten DOM-Zugriff
- Refs behalten ihren Wert zwischen Renders
- Beispiele aus unserer App:
```jsx
// Ref für Scroll-Position
const messagesEndRef = useRef(null);

// Ref für Textarea
const textareaRef = useRef(null);

// Verwendung der Refs
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

## 8. Komponenten-Kommunikation
- Props Down, Events Up
- Context API für tief verschachtelte Komponenten
- Beispiele aus unserer App:
```jsx
// Parent zu Child (Props)
<ChatInterface 
  messages={messages}
  onSendMessage={handleSendMessage}
  messagesEndRef={messagesEndRef}
/>

// Child zu Parent (Events)
const handleSendMessage = (prompt) => {
  if (!prompt.trim()) return;
  onSendMessage(prompt);
};
```

## 9. Styling in React
- CSS-Module
- Tailwind CSS
- Inline-Styles
- Beispiele aus unserer App:
```css
/* Global Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Komponenten-spezifische Styles */
.app {
  display: flex;
  height: 100vh;
}

.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}
```

## 10. Best Practices
- Komponenten-Struktur
- State Management
- Performance
- Beispiele aus unserer App:
```jsx
// Kleine, fokussierte Komponenten
function FileUpload({ uploadedFiles, onFileUpload, onRemoveFile }) {
  // ...
}

// Klare Props-Dokumentation
function ChatInterface({ 
  messages,        // Array von Nachrichten
  onSendMessage,   // Callback für neue Nachrichten
  messagesEndRef   // Ref für Scroll-Position
}) {
  // ...
}

// State auf der richtigen Ebene
// App.jsx hält den globalen State
const [messages, setMessages] = useState([]);
```

## 11. Performance-Optimierung
- Memoization
- Lazy Loading
- Code Splitting
- Beispiele aus unserer App:
```jsx
// Optimierte useEffect Dependencies
useEffect(() => {
  scrollToBottom();
}, [messages]); // Nur bei neuen Nachrichten

// Vermeidung unnötiger Renders
const handleSendMessage = useCallback((prompt) => {
  if (!prompt.trim()) return;
  onSendMessage(prompt);
}, [onSendMessage]);
```

## 12. Error Handling
- Try-Catch für API-Aufrufe
- Error Boundaries
- Benutzerfreundliche Fehlermeldungen
- Beispiele aus unserer App:
```jsx
// API-Fehlerbehandlung
try {
  const response = await fetch(`${API_BASE_URL}/api/chat/${currentModel}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // Verarbeitung der Daten
} catch (error) {
  console.error('Error:', error);
  setMessages(prev => [...prev, {
    role: 'bot',
    content: 'Sorry, I encountered an error. Please try again.'
  }]);
}

// Datei-Upload Fehlerbehandlung
try {
  const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  // Erfolgreicher Upload
} catch (error) {
  console.error('Error uploading files:', error);
  alert('Failed to upload files. Please try again.');
}
```

## 13. Testing
- Unit Tests
- Integration Tests
- E2E Tests
- Beispiel aus unseren Tests:
```javascript
// Integration Test für File Upload
test('should handle file upload', async () => {
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  const response = await request(app)
    .post('/api/files/upload')
    .attach('files', file);
  
  expect(response.status).toBe(200);
  expect(response.body.files).toHaveLength(1);
});
```

## 14. Deployment und Build
- Build-Prozess
- Environment Variablen
- Performance-Optimierung
- Beispiel aus unserer `package.json`:
```json
{
  "scripts": {
    "dev:frontend": "vite",
    "dev:backend": "nodemon server.js",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "build": "vite build",
    "preview": "vite preview"
  }
}
``` 