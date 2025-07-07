// const {Queue}=require("bullmq");
// const emailQueue = new Queue("email-queue");
// async function addJobQueue() {
//     const res=await emailQueue.add("email to balaji",{
//         "email":"nish.mehta@gmail",
//         "subject":"welcome to Bullmq",
//         "body":"Hello from BullMq"
//     })
//     console.log(res.id)
// }
// addJobQueue()

const { Queue } = require('bullmq');

const emailQueue = new Queue("batch-email-queue");
async function addJobsToQueue(userDetails){
    const batchSize = 5;
    const totalUsers = userDetails.length;
    let processedCount = 0;
    while(processedCount < totalUsers){
        const batch = userDetails.slice(processedCount, processedCount + batchSize);
        const res = await emailQueue.add("send batch email", { batch })
        console.log("batch added to queue", res.id);
        processedCount += batchSize;
    }
}

const mailData = {
    "subject": "Welcome to roc8 tiny talk",
    "body": "Hello folks welcome to roc8 tiny talk on bullMQ",
}

const userDetails = [
    { ...mailData, "email": "u1@gmail.com", "name": "u1" },
    { ...mailData, "email": "u2@gmail.com", "name": "u2" },
    { ...mailData, "email": "u3@gmail.com", "name": "u3" },
    { ...mailData, "email": "u4@gmail.com", "name": "u4" },
    { ...mailData, "email": "u5@gmail.com", "name": "u5" },
    { ...mailData, "email": "u6@gmail.com", "name": "u6" },
    { ...mailData, "email": "u7@gmail.com", "name": "u7" },
    { ...mailData, "email": "u8@gmail.com", "name": "u8" },
    { ...mailData, "email": "u9@gmail.com", "name": "u9" },
    { ...mailData, "email": "u10@gmail.com", "name": "u10" },
]

addJobsToQueue(userDetails);