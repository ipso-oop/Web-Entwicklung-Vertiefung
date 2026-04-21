// Importiert das FileSystem-Modul (fs) in seiner Promise-basierten Version für asynchrone Dateizugriffe
import fs from 'fs/promises';

// Importiert das path-Modul für Plattform-unabhängige Dateipfad-Manipulation
import path from 'path';

// Importiert eine Funktion, um eine file URL (import.meta.url) in einen Dateipfad umzuwandeln
import { fileURLToPath } from 'url';

// Bestimmt das Verzeichnisnamen (__dirname) dieser Datei
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Definiert den Pfad zur Datei, in der der Chatverlauf gespeichert werden soll
const HISTORY_FILE = path.join(__dirname, '../../data/chat_history.json');

// Definiert die Klasse ChatHistoryService zur Verwaltung des Chatverlaufs
export class ChatHistoryService {
    
    // Konstruktor der Klasse; wird aufgerufen, wenn eine neue Instanz erstellt wird
    constructor() {
        this.history = []; // Initialisiert den Chatverlauf als leeres Array
        this.loadHistory(); // Lädt den bestehenden Verlauf (falls vorhanden) aus der Datei
    }

    // Asynchrone Methode, um den Chatverlauf aus der Datei zu laden
    async loadHistory() {
        try {
            // Liest den Inhalt der Verlaufdatei (HISTORY_FILE) als UTF-8 Text
            const data = await fs.readFile(HISTORY_FILE, 'utf-8');
            
            // Parst die gelesenen JSON-Daten und speichert sie im Verlauf
            this.history = JSON.parse(data);
        } catch (error) {
            // Falls ein Fehler auftritt (Datei existiert nicht oder ist ungültig)
            this.history = []; // Initialisiert den Verlauf als leer
            await this.saveHistory(); // Speichert den leeren Verlauf in die Datei
        }
    }

    // Asynchrone Methode, um den aktuellen Chatverlauf in die Datei zu speichern
    async saveHistory() {
        try {
            // Stellt sicher, dass das Verzeichnis, in dem gespeichert werden soll, existiert
            await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
            
            // Schreibt das Verlauf-Array als formatiertes JSON in die Datei
            await fs.writeFile(HISTORY_FILE, JSON.stringify(this.history, null, 2));
        } catch (error) {
            // Gibt einen Fehler aus, wenn das Speichern fehlschlägt
            console.error('Error saving chat history:', error);
            
            // Wirft den Fehler erneut, damit er von der aufrufenden Funktion behandelt werden kann
            throw error;
        }
    }

    // Asynchrone Methode, um eine neue Nachricht zum Chatverlauf hinzuzufügen
    async addMessage(role, content) {
        this.history.push({
            role, // Rolle des Absenders (z.B. 'user' oder 'assistant')
            content, // Textinhalt der Nachricht
            timestamp: new Date().toISOString() // Zeitstempel im ISO-Format
        });
        await this.saveHistory(); // Speichert den aktualisierten Verlauf
    }

    // Methode, um den aktuellen Verlauf zurückzugeben
    getHistory() {
        return this.history; // Gibt das in der Instanz gespeicherte Verlauf-Array zurück
    }

    // Methode, um den Chatverlauf zu löschen (auf leer setzen) und zu speichern
    clearHistory() {
        this.history = []; // Setzt den Verlauf auf ein leeres Array
        return this.saveHistory(); // Speichert die Änderung in der Datei
    }
}

// Erstellt eine sofort einsatzbereite Instanz des ChatHistoryService
export const chatHistoryService = new ChatHistoryService();
