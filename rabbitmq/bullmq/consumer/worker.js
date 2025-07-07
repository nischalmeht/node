// const { Worker } = require("bullmq");
// const IORedis = require("ioredis");

// // Create an ioredis connection
// const connection = new IORedis({
//     host: "127.0.0.1",
//     port: 6379,
//     maxRetriesPerRequest: null,
// });

// async function sendEmailHelper(n) {
//     return new Promise((res) => setTimeout(res, n * 1000));
// }

// async function sendEmail(job) {
//     const { email, subject, body } = job.data;
//     console.log(`Job ID: ${job.id}`);
//     console.log(`Sending email to: ${email}`);
//     await sendEmailHelper(5);
//     console.log(`Email sent to: ${email}`);
// }

// const worker = new Worker("email-queue", sendEmail, { connection });

// worker.on("completed", (job) => {
//     console.log(`✅ Job ${job.id} has completed`);
// });

// worker.on("failed", (job, err) => {
//     console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
// });

const { Worker } = require('bullmq');

const IORedis = require("ioredis");
const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
});
async function sendEmailHelper(n){
    return new Promise((res, rej) => setTimeout(() => res(), n * 1000))
}

async function sendBatchEmails(job){
    const { batch } = job.data;
    batch.map(async (userDetail) => {
        console.log(`job id: ${job.id}`);
        console.log(`Sending email to: ${userDetail.email}`);
        await sendEmailHelper(5);
        console.log(`Email sent successfully ${userDetail.name}`) 
    })
}

const worker1 = new Worker("batch-email-queue", sendBatchEmails,{connection})
worker1.on('completed', job => {
    console.log(`${job.id} has completed in worker1!`);
  });

const worker2 = new Worker("batch-email-queue", sendBatchEmails,{connection})
worker2.on('completed', job => {
    console.log(`${job.id} has completed in worker2!`);
});
