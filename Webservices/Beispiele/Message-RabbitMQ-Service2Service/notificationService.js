const messageBus = require('./messageBus');
const express = require('express');

class NotificationService {
    constructor() {
        this.app = express();
        this.notifications = [];
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.get('/api/v1/notifications', (req, res) => {
            res.json(this.notifications);
        });

        this.app.get('/api/v1/notifications/:id', (req, res) => {
            const notification = this.notifications.find(n => n.id === parseInt(req.params.id));
            if (!notification) {
                return res.status(404).json({ error: 'Notification not found' });
            }
            res.json(notification);
        });
    }

    async start() {
        try {
            // Verbindung zum Message Bus herstellen
            await messageBus.connect();

            // Event Handler für verschiedene Kontakt-Events
            await messageBus.subscribe('contact.created', this.handleContactCreated.bind(this));
            await messageBus.subscribe('contact.updated', this.handleContactUpdated.bind(this));
            await messageBus.subscribe('contact.deleted', this.handleContactDeleted.bind(this));

            // REST API starten
            const PORT = process.env.NOTIFICATION_PORT || 3001;
            this.app.listen(PORT, () => {
                console.log(`Notification Service läuft auf http://localhost:${PORT}`);
                console.log('Verfügbare Endpunkte:');
                console.log('GET /api/v1/notifications');
                console.log('GET /api/v1/notifications/:id');
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

    async handleContactCreated(contact) {
        const notification = {
            id: this.notifications.length + 1,
            type: 'contact_created',
            contact: contact,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        // Simuliere das Senden von Benachrichtigungen
        console.log(`Sende Benachrichtigung für neuen Kontakt: ${contact.firstName} ${contact.lastName}`);
        console.log('Simuliere E-Mail-Versand...');
        console.log('Simuliere SMS-Versand...');

        this.notifications.push(notification);
        console.log('Benachrichtigung erfolgreich verarbeitet');
    }

    async handleContactUpdated(contact) {
        const notification = {
            id: this.notifications.length + 1,
            type: 'contact_updated',
            contact: contact,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        console.log(`Sende Benachrichtigung für aktualisierten Kontakt: ${contact.firstName} ${contact.lastName}`);
        console.log('Simuliere E-Mail-Versand...');

        this.notifications.push(notification);
        console.log('Benachrichtigung erfolgreich verarbeitet');
    }

    async handleContactDeleted(contactId) {
        const notification = {
            id: this.notifications.length + 1,
            type: 'contact_deleted',
            contactId: contactId,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        console.log(`Sende Benachrichtigung für gelöschten Kontakt mit ID: ${contactId}`);
        console.log('Simuliere E-Mail-Versand...');

        this.notifications.push(notification);
        console.log('Benachrichtigung erfolgreich verarbeitet');
    }
}

// Service starten
const notificationService = new NotificationService();
notificationService.start().catch(console.error); 