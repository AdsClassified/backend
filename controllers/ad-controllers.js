const Ad = require("../Models/Ad");
const User = require("../Models/User");
const nodemailer = require("nodemailer");

const getAds = async (req, res, next) => {
  console.log("hello g");
  let ads;
  try {
    ads = await Ad.find({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  res.json({ ads: ads });
};

const getAd = async (req, res, next) => {
  console.log(req.body);
  let ad;
  try {
    ad = await Ad.find({ _id: req.body.id });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  res.json({
    success: true,
    message: "Ad found",
    ad: ad,
  });
};

const placeAd = async (req, res) => {
  const {
    title,
    category,
    description,
    price,
    images,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user,
  } = req.body;

  const createdAd = new Ad({
    title,
    category,
    description,
    price,
    images,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user,
  });
  try {
    createdAd.save();
  } catch (err) {
    // res.status(500).json({
    //   message: "Signing up failed, please try again later.",
    //   error: "500",
    // });
    // return;
    res.json({
      success: false,
      data: err,
      message: "Creating Ad Failed",
    });
    return;
  }

  res.status(200).send({
    ad: createdAd,
    success: true,
    message: "Ad Gone for Review SuccessFully",
  });
};

const getUserAds = async (req, res) => {
  // console.log(req.body);
  const { id } = req.body;
  console.log(id);
  let ads;

  try {
    ads = await Ad.find({ user: id });
    // console.log(ads);
  } catch (err) {
    console.log("error", err);
    res.json({
      success: false,
      data: err,
      message: "Finding Ad failed",
    });
    return;
  }

  if (ads) {
    res.json({
      success: true,
      ads: ads,
      message: "Ads Found",
    });
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.body;
  console.log(id);

  let ad;

  try {
    ad = await Ad.findByIdAndRemove({ _id: id });
    console.log(ad);
    ad = true;
    // console.log(res);
    console.log("done");
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Error deleting Ad",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,

      message: "Ad deleted",
    });
  } else {
    res.json({
      success: false,

      message: "Error deleting Ad",
    });
    return;
  }
};

const activeAd = (req, res) => {
  console.log(req.body);

  const { checked, id } = req.body;
  let ad;

  try {
    Ad.update({ _id: id }, { $set: { active: checked } }, function (err) {
      if (!err) {
        return res.json({
          success: true,
          message: `Ad is ${checked ? "Active" : "Deactivated"}`,
        });
      }
    });
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const editAd = async (req, res) => {
  const {
    title,
    category,
    description,
    price,
    images,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user,
    id,
  } = req.body;

  const updatedData = {
    title,
    category,
    description,
    price,
    images,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user,
  };

  let ad;

  console.log(id);

  try {
    ad = await Ad.findOneAndUpdate({ _id: id }, updatedData);
    console.log("done");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }

  if (ad) {
    res.json({
      success: true,
      message: "Ad Updated",
    });
  } else {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const getFavourites = async (req, res) => {
  console.log(req.body);

  const { fav } = req.body;
  let favAds;
  try {
    favAds = await Ad.find({ _id: fav });
    console.log("found");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Favourites not Found",
    });
    return;
  }

  if (favAds) {
    res.json({
      favs: favAds,
      success: true,
      message: "Favourites Found",
    });
  } else {
    console.log(err);
    res.json({
      success: false,
      message: "Favourites not Found",
    });
    return;
  }
};

const search = async (req, res) => {
  console.log(req.body);
  // let db = req.app.get("db");

  const { searchValue, price, negotiable } = req.body.search;
  const { userId } = req.body;
  let yoo;

  // let searchPattern = new RegExp("^" + search);
  console.log(price, negotiable);
  try {
    yoo = await Ad.find({ title: { $regex: searchValue, $options: "i" } });
    console.log(yoo.length);
    if (price.length === 2) {
      yoo = yoo.filter((ad) => {
        return ad.price >= price[0] && ad.price <= price[1];
      });
    } else if (negotiable) {
      yoo = yoo.filter((ad) => {
        return add.negotiable === true;
      });
    } else if (price.length === 2 && negotiable) {
      yoo = yoo.filter((ad) => {
        return (
          ad.price >= price[0] && ad.price <= price[1] && ad.negotiable === true
        );
      });
    }
  } catch (err) {
    console.log(err);
  }

  if (yoo) {
    res.json({
      ads: yoo,
      success: true,
      message: "Ads Found",
    });
    if (userId) {
      console.log("in search activity");
      try {
        let user = await User.findOne({ _id: userId });

        // console.log(user);
        User.update(
          { _id: userId },
          { $set: { searchActivity: [...user.searchActivity, searchValue] } },
          function (err) {
            if (!err) {
              console.log("user added");
              // return res.json({
              //   success: true,
              //   message: "Search Query added to search Activity",
              // });
            } else {
              console.log(err);
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    console.log(err);
    res.json({
      success: false,
      message: "No Ad Found",
    });
    return;
  }
};

const sendMessage = async (req, res) => {
  // console.log(req.body);
  const { phone, message, email, adData, userId } = req.body;
  console.log(phone, message, email, userId);

  if ((message && email, userId)) {
    const output = `
            <p>You have a got a Query</p>
            <h3>Vinted</h3>
            <ul>
              <li></li>
            </ul>
            <h3>Contact Him/Her Here</h3>
            <p>${phone}</p>
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
      from: `Your Ad Got a Query  || VINTED.CI`, // sender address
      to: email, // list of receivers
      subject: "Your Ad Got a Query || VINTED", // Subject line
      // text: details, // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        res.json({ success: false, message: "Something went Wrong" });
        return error;
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        try {
          let user = await User.findOne({ _id: userId });
          console.log("user found");

          let yoo = false;
          user.messages.map((msg, i) => {
            if (msg.email === email) {
              console.log("in IF");
              yoo = true;
              return;
            }
          });

          console.log(yoo);

          if (user) {
            if (yoo) {
              console.log("yoo found");
              let existMsgs = user.messages;
              console.log(existMsgs[0].messages, "Before");
              existMsgs.map((msg) => {
                console.log(msg.messages, "inside loop");
                if (msg.email === email) {
                  msg.messages.push(message);
                  return;
                }
              });

              console.log(existMsgs[0].messages, "After");

              User.update(
                { _id: userId },
                {
                  $set: {
                    messages: [...existMsgs],
                  },
                },
                function (err) {
                  if (!err) {
                    console.log("Message Sent");
                    return res.json({ success: true, message: "Message Sent" });
                  } else {
                    res.json({
                      success: false,
                      message: "Something went wrong",
                    });
                    return;
                  }
                }
              );
            } else {
              console.log("yoo not foound");
              User.update(
                { _id: userId },
                {
                  $set: {
                    messages: [
                      ...user.messages,
                      { adData: adData, messages: [message], email: email },
                    ],
                  },
                },
                function (err) {
                  if (!err) {
                    console.log("Message Sent");
                    return res.json({ success: true, message: "Message Sent" });
                  } else {
                    res.json({
                      success: false,
                      message: "Something went wrong",
                    });
                    return;
                  }
                }
              );
            }
          }
        } catch (err) {
          console.log(err);
        }
        // res.json({ success: true, message: "Message Sent to Ad Holder" });
        return;
      }
    });
    return;
  } else {
    res.json({ success: false, message: "Something went Wrong" });
    return;
  }
};
module.exports = {
  getAds,
  placeAd,
  getUserAds,
  deleteAd,
  activeAd,
  editAd,
  getFavourites,
  search,
  getAd,
  sendMessage,
};
