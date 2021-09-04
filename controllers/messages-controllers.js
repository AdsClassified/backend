const Messages = require("../Models/Messages");
const User = require("../Models/User");
const nodemailer = require("nodemailer");

const getMessages = async (req, res) => {
  const { conversationId } = req.body;
  try {
    const messages = await Messages.findOne({ conversationId: conversationId });
    res.json({
      success: true,
      message: "Messages Found",
      foundMessages: messages,
    });
  } catch (err) {
    console.log(err);
  }
};

const emailSender = async (email, message) => {
  console.log(email, message);
  if (email) {
    const output = `
           
            <h3>Vinted.CI</h3>
            <p>You Got a Query</p>
            <br />
            <h3>Message</h3>
            <p>${message}</p>
            `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.google.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      service: "gmail",
      auth: {
        user: "contact@technoush.com", // generated ethereal user
        pass: "rrxnyuprbohuopcw", // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Vinted.CI" <contact@technoush.com>', // sender address
      to: email, // list of receivers
      subject: "Check Out your Inbox", // Subject line
      // text: details, // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return error;
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
      return true;
    });
  } else {
    // res.json({ message: "Something went Wrong", message: false });
    console.log("EROROR");
  }
};

const addMessages = async (req, res) => {
  console.log(req.body);

  const { conversationId, message, receiver } = req.body;
  console.log(conversationId);
  console.log(receiver, "I am receiver");

  const foundMessages = await Messages.findOne({
    conversationId: conversationId,
  });

  let oldMessages = foundMessages.messages;
  let newMessages = [...oldMessages, message];

  console.log(newMessages);

  try {
    await Messages.updateOne(
      { conversationId: conversationId },
      { $set: { messages: newMessages } },
      async function (err) {
        if (err) {
          console.log("Message Senting Error", err);
          return;
        } else {
          res.json({
            success: true,
            message: "Message Sent",
            newMessage: message,
          });
          try {
            await User.updateOne(
              { email: receiver },
              { $set: { notify: false } },
              (err) => {
                if (err) {
                  console.log("Error setting notify", err);
                } else {
                  console.log("Notified");
                  emailSender(receiver, message);
                }
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const disableNotify = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    await User.updateOne(
      { email: email },
      { $set: { notify: true } },
      (err) => {
        if (err) {
          console.log("Error setting notify", err);
        } else {
          console.log("Notified diabled");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getMessages,
  addMessages,
  disableNotify,
};
