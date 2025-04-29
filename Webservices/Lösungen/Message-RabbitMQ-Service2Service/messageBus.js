const amqp = require('amqplib');

class MessageBus {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchange = 'message_events';
        this.queues = {
            messageReceived: 'message.received'
        };
    }

    async connect() {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect('amqp://localhost');
                this.channel = await this.connection.createChannel();
                
                // Exchange deklarieren
                await this.channel.assertExchange(this.exchange, 'topic', {
                    durable: true
                });

                console.log('Exchange erfolgreich erstellt');

                // Queue deklarieren und binden
                const queue = this.queues.messageReceived;
                await this.channel.assertQueue(queue, { durable: true });
                await this.channel.bindQueue(queue, this.exchange, queue);
                console.log(`Queue ${queue} erfolgreich erstellt und gebunden`);

                console.log('Message Bus erfolgreich verbunden');
            }
        } catch (error) {
            console.error('Fehler beim Verbinden mit dem Message Bus:', error);
            this.connection = null;
            this.channel = null;
            throw error;
        }
    }

    async publishMessage(message) {
        try {
            const queue = this.queues.messageReceived;
            await this.channel.publish(
                this.exchange,
                queue,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );

            console.log('Nachricht veröffentlicht:', message);
        } catch (error) {
            console.error('Fehler beim Veröffentlichen der Nachricht:', error);
            throw error;
        }
    }

    async subscribeToMessages(callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            
            const queue = this.queues.messageReceived;
            await this.channel.consume(queue, async (message) => {
                if (message) {
                    try {
                        const content = JSON.parse(message.content.toString());
                        console.log('Nachricht empfangen:', content);
                        await callback(content);
                        this.channel.ack(message);
                    } catch (error) {
                        console.error('Fehler bei der Verarbeitung der Nachricht:', error);
                        this.channel.nack(message);
                    }
                }
            });
            
            console.log('Erfolgreich für Nachrichten angemeldet');
        } catch (error) {
            console.error('Fehler beim Abonnieren der Nachrichten:', error);
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