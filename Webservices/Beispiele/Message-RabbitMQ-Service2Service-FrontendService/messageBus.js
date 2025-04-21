const amqp = require('amqplib');

class MessageBus {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchange = 'contact_events';
        this.queues = {
            contactCreated: 'contact.created',
            contactUpdated: 'contact.updated',
            contactDeleted: 'contact.deleted'
        };
    }

    async connect() {
        try {
            if (!this.connection) {
                // Verbindung mit expliziten Credentials
                this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');
                this.channel = await this.connection.createChannel();
                
                // Exchange deklarieren
                await this.channel.assertExchange(this.exchange, 'topic', {
                    durable: true
                });

                // Queues deklarieren
                for (const [key, queue] of Object.entries(this.queues)) {
                    await this.channel.assertQueue(queue, { durable: true });
                    await this.channel.bindQueue(queue, this.exchange, queue);
                }

                console.log('Message Bus erfolgreich verbunden');
            }
        } catch (error) {
            console.error('Fehler beim Verbinden mit dem Message Bus:', error);
            this.connection = null;
            this.channel = null;
            throw error;
        }
    }

    async publish(eventType, message) {
        try {
            const routingKey = this.queues[eventType];
            if (!routingKey) {
                throw new Error(`Unbekannter Event-Typ: ${eventType}`);
            }

            await this.channel.publish(
                this.exchange,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );

            console.log(`Event ${eventType} veröffentlicht:`, message);
        } catch (error) {
            console.error('Fehler beim Veröffentlichen der Nachricht:', error);
            throw error;
        }
    }

    async subscribe(queue, callback) {
        try {
            // Warten bis die Verbindung hergestellt ist
            if (!this.channel) {
                await this.connect();
            }
            
            // Sicherstellen, dass die Queue existiert
            await this.channel.assertQueue(queue, { durable: true });
            
            // Jetzt erst consume aufrufen
            await this.channel.consume(queue, (message) => {
                if (message) {
                    const content = JSON.parse(message.content.toString());
                    callback(content);
                    this.channel.ack(message);
                }
            });
            console.log(`Erfolgreich an Queue ${queue} angemeldet`);
        } catch (error) {
            console.error('Fehler beim Abonnieren der Queue:', error);
            throw error;
        }
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log('Message Bus Verbindung geschlossen');
        }
    }
}

module.exports = new MessageBus(); 