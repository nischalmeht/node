const amqp = require("amqplib");

const consumeLiveStreamNotifications = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchangeName = "notfication_exchange";
        const queueName = 'lazy_queue';
        const routingKey = "notification.key"
        await channel.assertQueue(queueName,{
            durable:true,
            arguments: {
                'x-queue-mode': 'lazy'
            }
        });
        console.log("Waiting for message");
        channel.consume(queueName, (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log("Received live stream notification", message);
                // Process the notification
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

consumeLiveStreamNotifications();