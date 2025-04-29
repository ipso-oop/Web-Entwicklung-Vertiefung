const express = require('express');
const messageBus = require('./messageBus');

class NotificationService {
    constructor() {
        this.app = express();
        this.messages = [];
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.get('/api/v1/messages', (req, res) => {
            res.json(this.messages);
        });
    }

    async start() {
        try {
            // Verbindung zum Message Bus herstellen
            await messageBus.connect();
            
            // Für Nachrichten anmelden
            await messageBus.subscribeToMessages(this.handleMessage.bind(this));

            // REST API starten
            const PORT = process.env.NOTIFICATION_PORT || 3001;
            this.app.listen(PORT, () => {
                console.log(`Notification Service läuft auf http://localhost:${PORT}`);
                console.log('Verfügbare Endpunkte:');
                console.log('GET /api/v1/messages');
            });

            // Graceful Shutdown
            process.on('SIGTERM', async () => {
                console.log('SIGTERM Signal empfangen. Notification Service wird heruntergefahren...');
                await messageBus.close();
                process.exit(0);
            });
        } catch (error) {
            console.error('Fehler beim Starten des Notification Services:', error);
            process.exit(1);
        }
    }

    async handleMessage(message) {
        console.log('Neue Nachricht empfangen:', message);
        
        // Nachricht speichern
        this.messages.push({
            ...message,
            receivedAt: new Date().toISOString()
        });
        
        console.log('Nachricht erfolgreich verarbeitet');
    }
}

// Service starten
const notificationService = new NotificationService();
notificationService.start().catch(console.error); 