
import axios from "axios";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
          return res.status(404).json({ message: "This endpoint requires a POST" });
        }
        console.log("-----");
        console.log(req.body);
        console.log("-----");
        let error;
        const data = req.body;

        const messageId = data.messageId;
        const messageDate = data.date;
        const messageContent = data.content;
        const messageUrl = data.messageUrl;
        const messageAuthorData = data.authorData;
        const messageReplyData = data.replyData;
    
        const Airtable = require("airtable");
        const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
          process.env.AIRTABLE_BASE
        );

        // create records in Airtable
        if (messageId && messageContent) {
          console.log(
            `Attempting to create an entry...`
          );

          const baseResult = await base('Table 1').create([
            {
              fields: {
                "Message ID": messageId,
                "Date": messageDate,
                "Message Content": messageContent,
                "Message URL": messageUrl,
                "Author Data": JSON.stringify(messageAuthorData),
                "Reply Data": JSON.stringify(messageReplyData),
              },
            },
          ]);

          await axios({
            method: "post",
            url: "http://localhost:8000/__refresh",
          });
        } else {
          error = "Incomplete data";
        }
    
        console.log("Completed processes and assembling return payload");
    
        if (error) {
          res.json({
            message: "Airtable function failed",
            error: error.message,
          });
        } else {
          res.json({ message: `Airtable function completed` });
        }
      } catch (err) {
        console.log(err);
        res.json({ message: "There has been a big error.", error: err });
      }
}