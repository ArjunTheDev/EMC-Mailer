const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sendMails } = require("./service/EmailService");

const app = express();

var corsOptions = {
  origin: ["http://localhost:3000"]
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to EMCKart Application." });
});

app.post("/sendMail", (req, res) => {
    sendMails(req.body).then((response) => {
        console.log(response)
        res.status(200).send({success: true, message: "Mail send successfully!" });
    })
    .catch((error) => {
        res.status(500).send({message: 'Error sending email', error: error});
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}); 
