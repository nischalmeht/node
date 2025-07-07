// const amqp = require("amqplib");

// const sendNotification = async (headers, message) => {
//     try {
//         const connection = await amqp.connect("amqp://localhost");
//         const channel = await connection.createChannel();

//         const exchange = "header_exchange";
//         const exchangeType = "headers";

//         await channel.assertExchange(exchange, exchangeType, { durable: true });

//         channel.publish(exchange, "", Buffer.from(message), 
// {
//             persistent: true,
//             headers
//         });

//         console.log(" Sent notification with headers");

//         setTimeout(() => {
//             connection.close();
//         }, 500);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };

// // Example usage
// sendNotification({ "x-match": "all", "notification-type": "new_video", "content-type": "video" }, "New music video uploaded");
// sendNotification({ "x-match": "all", "notification-type": "live_stream", "content-type": "gaming" }, "Gaming live stream started");
// sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" }, "New comment on your vlog");
// sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" }, "New comment on your Video");
// sendNotification({ "x-match": "any", "notification-type-like": "like", "content-type": "vlog" }, "Someone liked your comment");


const amqp = require('amqplib');

(async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = "notification_exchange"; // ✅ fixed spelling
        const queueName = 'lazy_queue';
        const routingKey = "notification.key";

        // 1. Declare exchange (IMPORTANT)
        await channel.assertExchange(exchangeName, 'direct', { durable: true });

        // 2. Declare lazy queue
        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-queue-mode': 'lazy'
            }
        });

        // 3. Bind the lazy queue to the exchange
        await channel.bindQueue(queueName, exchangeName, routingKey);
        // 4. Publish message to the exchange
        channel.publish(exchangeName, routingKey, Buffer.from('Hello Lazy Queue!'), {
            persistent: true
        });

        console.log(`✅ Message published to lazy queue "${queueName}" via exchange "${exchangeName}"`);

        // 5. Close connection after a short delay
        setTimeout(async () => {
            await channel.close();
            await connection.close();
        }, 500);
    } catch (err) {
        console.error('❌ Error:', err);
    }
})();
