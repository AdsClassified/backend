const Conversation = require("../Models/Conversation");
const Messages = require("../Models/Messages");
const User = require("../Models/User");
const nodemailer = require("nodemailer");

const getConversation = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  console.log(email);

  try {
    const conversations = await Conversation.find({
      membersEmails: { $in: [email] },
    });
    // console.log(conversations);
    res.json({ success: true, message: "Found Conversation", conversations });
  } catch (err) {
    console.log(err);
  }
};

const emailSender = async (email, message) => {
  console.log(email, message);
  if (email) {
    const output = `
           
            <h3>Vinted.CI</h3>
            <p>You have a got a Query</p>
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
        user: "queryaidataron@gmail.com", // generated ethereal user
        pass: "nwnxovucjfoqqwww", // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Vinted.CI" <queryaidataron@gmail.com>', // sender address
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

const addConversation = async (req, res) => {
  // console.log(req.body);

  const { userId, email, membersEmails, adData, phone, message } = req.body;
  console.log(membersEmails);

  try {
    let foundConversation = await Conversation.findOne({
      membersEmails: { $in: [membersEmails] },
    });

    if (foundConversation === null) {
      console.log("han ggggggggggggggggggggggg");
      foundConversation = await Conversation.findOne({
        membersEmails: { $in: [membersEmails.reverse()] },
      });
    }

    if (foundConversation) {
      console.log(adData.title, "IN IF");
      const foundMessages = await Messages.findOne({
        conversationId: foundConversation._id,
      });

      let oldMessages = foundMessages.messages;
      let newMessages = [...oldMessages, message];

      try {
        await Messages.updateOne(
          { conversationId: foundConversation._id },
          {
            $set: {
              image: adData.images[0],
              title: "hello g",
              messages: newMessages,
            },
          },

          async function (err) {
            if (err) {
              console.log("Message Senting Error", err);
              return;
            } else {
              res.json({
                success: true,
                message: "Message Added",
                newMessage: message,
              });

              try {
                await User.updateOne(
                  { email: membersEmails[1] },
                  { $set: { notify: false } },
                  (err) => {
                    if (err) {
                      console.log("Error setting notify", err);
                    } else {
                      console.log("Notified");
                      emailSender(membersEmails[1], message);
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
    } else {
      console.log("in ELSE");

      const newConversation = new Conversation({
        members: [userId, adData.contactDetails.id],
        membersEmails: membersEmails,
        adId: adData.id,
        image: adData.images[0],
        title: adData.title,
        senderPhone: phone,
        senderEmail: email,
      });
      try {
        const savedConversation = await newConversation.save();
        res.json({
          success: true,
          message: "Message Sent ",
          conversation: savedConversation,
        });

        let messagesArray = [message];

        const newMessage = new Messages({
          conversationId: savedConversation._id,
          messages: messagesArray,
          sender: userId,
        });

        try {
          const savedMessage = await newMessage.save();
          // console.log("MEssage Added", savedMessage);
          try {
            await User.updateOne(
              { email: membersEmails[1] },
              { $set: { notify: false } },
              (err) => {
                if (err) {
                  console.log("Error setting notify", err);
                } else {
                  console.log("Notified");
                  emailSender(membersEmails[1], message);
                }
              }
            );
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        res
          .status(500)
          .json({ success: false, messages: "Something went wrong" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getConversation,
  addConversation,
};
