# TypeScript für React-Entwickler
## Eine praktische Einführung anhand einer Chat-Anwendung

---

## 0. TypeScript Grundlagen und Geschichte

### 0.1 Was ist TypeScript?

#### Definition und Konzepte
- **Superset von JavaScript**: 
  - Alle JavaScript-Syntax ist gültiges TypeScript
  - Beispiel aus unserer App: Die ursprüngliche React-App funktionierte bereits in JavaScript
  ```javascript
  // Original JavaScript-Code aus App.jsx
  const [messages, setMessages] = useState([]);
  ```

- **Statische Typisierung**:
  - Typen werden zur Kompilierzeit überprüft
  - Beispiel aus unserer App:
  ```typescript
  // TypeScript-Version in App.tsx
  const [messages, setMessages] = useState<Message[]>([]);
  // Kompilierungsfehler, wenn versucht wird, einen String hinzuzufügen
  setMessages("Hallo"); // Fehler: Type 'string' is not assignable to type 'Message[]'
  ```

- **Open Source Entwicklung**:
  - Entwickelt von Microsoft unter der Leitung von Anders Hejlsberg
  - Aktive Community und regelmäßige Updates
  - Beispiel: Unsere App nutzt die neuesten TypeScript-Features wie:
    - Strict Null Checks
    - Union Types
    - Generic Types

### 0.2 Warum TypeScript in unserer Chat-App?

#### Vorteile in der Praxis
1. **Frühes Erkennen von Fehlern**:
   ```typescript
   // In unserer Chat-App
   interface Message {
     role: 'user' | 'bot';
     content: string;
   }

   // TypeScript erkennt sofort, wenn wir versuchen:
   const invalidMessage: Message = {
     role: 'admin', // Fehler: Type '"admin"' is not assignable to type '"user" | "bot"'
     content: 'Hallo'
   };
   ```

2. **Bessere Code-Dokumentation**:
   ```typescript
   // In FileUpload.tsx
   interface FileUploadProps {
     uploadedFiles: Map<string, UploadedFile>;
     onFileUpload: (files: FileList) => Promise<void>;
     onRemoveFile: (fileId: string) => Promise<void>;
   }
   // Die Props sind selbst-dokumentierend
   ```

3. **Verbesserte IDE-Unterstützung**:
   - Autovervollständigung für Message-Properties
   - Refactoring-Sicherheit bei Änderungen
   - Beispiel aus unserer App:
   ```typescript
   // Beim Umbenennen einer Property im Message-Interface
   interface Message {
     role: 'user' | 'bot';
     content: string;
     // Umbenennen von 'loading' zu 'isLoading'
     isLoading?: boolean;
   }
   // TypeScript findet alle Verwendungen und bietet automatische Korrekturen an
   ```

### 0.3 Grundlegende TypeScript-Konzepte in unserer App

#### Primitive Typen
```typescript
// In unserer App verwendet
const currentModel: string = 'local';
const messageCount: number = messages.length;
const isUploading: boolean = false;

// Spezielle Typen
const error: null = null;
const initialValue: undefined = undefined;
// Vermeiden von any in unserer App
// ❌ const data: any = response.json();
// ✅ const data: ApiResponse = response.json();
```

#### Arrays und Tuples
```typescript
// In unserer App
const messages: Message[] = []; // Array von Message-Objekten
const fileIds: string[] = Array.from(uploadedFiles.keys());

// Tuple für API-Response
type ChatResponse = [Message, number]; // [Nachricht, Timestamp]
```

#### Enums für Status
```typescript
// In unserer App könnten wir verwenden
enum MessageStatus {
  Sending = "SENDING",
  Sent = "SENT",
  Error = "ERROR"
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  status?: MessageStatus;
}
```

#### Type Aliases
```typescript
// In unserer App
type Role = 'user' | 'bot';
type FileId = string;
type Timestamp = number;

interface Message {
  role: Role;
  content: string;
  timestamp: Timestamp;
}
```

### 0.4 TypeScript und JavaScript in unserer App

#### Kompatibilität
```typescript
// Original JavaScript-Code
function handleSendMessage(prompt) {
  setMessages([...messages, { role: 'user', content: prompt }]);
}

// TypeScript-Version mit Typen
function handleSendMessage(prompt: string): void {
  const newMessage: Message = {
    role: 'user',
    content: prompt,
    timestamp: Date.now()
  };
  setMessages([...messages, newMessage]);
}
```

### 0.5 TypeScript-Compiler in unserem Projekt

#### Konfiguration für unsere Chat-App
```json
{
  "compilerOptions": {
    "target": "ES2020",           // Moderne JavaScript-Features
    "module": "ESNext",           // Moderne Module
    "strict": true,              // Strikte Typüberprüfung
    "jsx": "react-jsx",          // React JSX Unterstützung
    "moduleResolution": "bundler", // Vite-Kompatibilität
    "esModuleInterop": true,     // Bessere Import-Kompatibilität
    "skipLibCheck": true,        // Schnellere Kompilierung
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./src/*"]         // Alias für Imports
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 0.6 TypeScript-Ökosystem in unserer App

#### Tools und Integrationen
- **Vite**: Moderne Build-Tool mit TypeScript-Unterstützung
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    // TypeScript-spezifische Konfiguration
  });
  ```

- **ESLint**: TypeScript-Linting
  ```json
  // .eslintrc.json
  {
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended"
    ]
  }
  ```

- **Jest**: TypeScript-Testing
  ```typescript
  // tests/App.test.tsx
  import { render, screen } from '@testing-library/react';
  import App from '../src/App';

  describe('App', () => {
    it('renders chat interface', () => {
      render(<App />);
      // TypeScript unterstützt die Test-Utilities
    });
  });
  ```

---

## 1. Grundlegende TypeScript-Konzepte

### 1.1 Statische Typisierung vs. Dynamische Typisierung

#### JavaScript (Dynamisch)
```javascript
let message = "Hallo";  // Typ wird zur Laufzeit bestimmt
message = 42;          // Kein Fehler, aber potenziell problematisch
```

#### TypeScript (Statisch)
```typescript
let message: string = "Hallo";  // Explizite Typdeklaration
message = 42;                   // Kompilierungsfehler: Type 'number' is not assignable to type 'string'
```

#### Vorteile der statischen Typisierung
- **Frühes Erkennen von Fehlern**: Fehler werden zur Kompilierzeit entdeckt
- **Bessere Code-Dokumentation**: Typen dienen als Dokumentation
- **Verbesserte IDE-Unterstützung**: Bessere Autovervollständigung und Refactoring
- **Reduzierte Laufzeitfehler**: Weniger unerwartete Typkonvertierungen

### 1.2 Interface-Definition

#### Definition von Datenstrukturen
```typescript
// types/index.ts
export interface Message {
  role: 'user' | 'bot';    // Union Type für mögliche Werte
  content: string;         // Pflichtfeld
  loading?: boolean;       // Optionales Feld
}
```

#### Verwendung in der Anwendung
```typescript
// App.tsx
const [messages, setMessages] = useState<Message[]>([]);

// Typisierte Funktion
const saveMessageToHistory = async (role: 'user' | 'bot', content: string): Promise<void> => {
  // ...
}
```

#### Vorteile von Interfaces
- **Klar definierte Datenstrukturen**
- **Wiederverwendbare Typdefinitionen**
- **Typsicherheit bei der Verwendung**
- **Bessere IDE-Unterstützung**

---

## 2. TypeScript mit React

### 2.1 Props-Typisierung

#### Funktional Components mit Props
```typescript
// types/index.ts
export interface ChatInterfaceProps {
  messages: Message[];                    // Array von Message-Objekten
  onSendMessage: (message: string) => Promise<void>;  // Asynchrone Callback-Funktion
  messagesEndRef: React.RefObject<HTMLDivElement>;    // React Ref
}

// ChatInterface.tsx
const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  messagesEndRef 
}) => {
  // ...
}
```

#### Vorteile der Props-Typisierung
- **Klar definierte Schnittstellen**
- **Typsicherheit bei der Komponentenverwendung**
- **Automatische Dokumentation**
- **Frühes Erkennen von Props-Fehlern**

### 2.2 State-Typisierung

#### useState mit Generics
```typescript
// App.tsx
const [currentModel, setCurrentModel] = useState<string>('local');
const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFile>>(new Map());
const [messages, setMessages] = useState<Message[]>([]);
```

#### Komplexe State-Typen
```typescript
// Map mit typisierten Keys und Values
const [uploadedFiles, setUploadedFiles] = useState<Map<string, UploadedFile>>(new Map());

// Array von typisierten Objekten
const [messages, setMessages] = useState<Message[]>([]);
```

---

## 3. Fortgeschrittene TypeScript-Konzepte

### 3.1 Union Types

#### Definition und Verwendung
```typescript
// Union Type für mögliche Rollen
type Role = 'user' | 'bot';

// Verwendung in Interface
interface Message {
  role: Role;
  content: string;
}

// Verwendung in Funktion
const saveMessageToHistory = async (role: Role, content: string): Promise<void> => {
  // ...
}
```

### 3.2 Generics

#### React.FC Generic
```typescript
// Definition einer funktionalen Komponente mit Props
const App: React.FC<AppProps> = () => {
  // ...
}
```

#### Custom Generic Types
```typescript
// Beispiel für einen generischen Response-Typ
interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}
```

### 3.3 Type Guards

#### typeof Type Guards
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

#### in Type Guards
```typescript
function isMessage(obj: unknown): obj is Message {
  return obj !== null && 
         typeof obj === 'object' && 
         'role' in obj && 
         'content' in obj;
}
```

---

## 4. Event Handling mit TypeScript

### 4.1 Event-Typen

#### Form Events
```typescript
// ChatInterface.tsx
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  // ...
}
```

#### Input Events
```typescript
// ChatInterface.tsx
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setInputValue(e.target.value);
}
```

#### Select Events
```typescript
// ModelSelector.tsx
const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
  onModelChange(e.target.value);
}
```

### 4.2 Event Handler Typisierung

#### Async Event Handler
```typescript
const handleSendMessage = async (prompt: string): Promise<void> => {
  if (!prompt.trim()) return;
  // ...
}
```

#### Void Event Handler
```typescript
const handleRemove = (fileId: string): void => {
  onRemoveFile(fileId);
}
```

---

## 5. TypeScript-Konfiguration

### 5.1 tsconfig.json

#### Wichtige Compiler-Optionen
```json
{
  "compilerOptions": {
    "target": "ES2020",           // JavaScript-Zielversion
    "strict": true,              // Strikte Typüberprüfung
    "jsx": "react-jsx",          // React JSX Unterstützung
    "moduleResolution": "bundler", // Modulauflösung
    "esModuleInterop": true,     // Bessere ES Module Interoperabilität
    "skipLibCheck": true,        // Schnellere Kompilierung
    "forceConsistentCasingInFileNames": true // Konsistente Dateinamen
  }
}
```

### 5.2 TypeScript mit Vite

#### Vite-Konfiguration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ...
});
```

---

## 6. Best Practices

### 6.1 Explizite Rückgabetypen

#### Funktionen mit Rückgabetypen
```typescript
const scrollToBottom = (): void => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

const loadChatHistory = async (): Promise<void> => {
  // ...
};
```

### 6.2 Null-Safety

#### Optional Chaining
```typescript
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
```

#### Non-null Assertion
```typescript
// Nur verwenden, wenn sicher ist, dass der Wert nicht null ist
messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
```

---

## 7. Vorteile der TypeScript-Umwandlung

### 7.1 Code-Qualität

#### Vorher (JavaScript)
```javascript
function handleSendMessage(prompt) {
  // Keine Typüberprüfung
  // Keine Dokumentation der erwarteten Parameter
  // Keine Rückgabetyp-Dokumentation
}
```

#### Nachher (TypeScript)
```typescript
async function handleSendMessage(prompt: string): Promise<void> {
  // Explizite Typisierung
  // Dokumentierte Parameter
  // Klarer Rückgabetyp
}
```

### 7.2 Entwickler-Erfahrung

#### IDE-Unterstützung
- **Autovervollständigung**
- **Inline-Dokumentation**
- **Refactoring-Tools**
- **Fehler-Highlighting**

### 7.3 Team-Kollaboration

#### Vorteile
- **Klar definierte Schnittstellen**
- **Bessere Code-Reviews**
- **Reduzierte Fehleranfälligkeit**
- **Einfachere Wartung**

---

## 8. Praktische Tipps

### 8.1 Migration von JavaScript zu TypeScript

#### Schrittweise Migration
1. **tsconfig.json erstellen**
2. **Dateien von .js zu .tsx umbenennen**
3. **Grundlegende Typen hinzufügen**
4. **Interfaces definieren**
5. **Strikte Typisierung einführen**

### 8.2 Häufige Fallstricke

#### Vermeiden von any
```typescript
// Schlecht
const data: any = response.json();

// Besser
interface ResponseData {
  // ...
}
const data: ResponseData = response.json();
```

#### Korrekte Event-Typisierung
```typescript
// Schlecht
const handleChange = (e) => {
  // ...
};

// Besser
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // ...
};
```

---

## 9. Weiterführende Ressourcen

### 9.1 Offizielle Dokumentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### 9.2 Tools
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [VSCode TypeScript Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

### 9.3 Best Practices
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/) 