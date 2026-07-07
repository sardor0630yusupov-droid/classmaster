require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        const text = `
📩 Yangi murojaat

👤 Ism: ${name}
📞 Telefon: ${phone}

💬 Xabar:
${message}
`;

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text,
                }),
            }
        );

        const data = await response.json();

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server ishlayapti...");
});