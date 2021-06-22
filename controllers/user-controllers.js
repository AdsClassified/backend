const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../Models/User");
var springEdge = require("springedge");
var otpGenerator = require("otp-generator");
const Vonage = require("@vonage/server-sdk");
const nodemailer = require("nodemailer");

const vonage = new Vonage({
  apiKey: "5584758f",
  apiSecret: "s5lzX8hL5KokIen7",
});

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users });
};

const sendEmailOtp = (email, otp) => {
  console.log(email, otp);
  if (otp && email) {
    const output = `
            <p>You Email Verification code</p>
            <h3>Vinted</h3>
            <ul>  
              <li>Registered for: ${email}</li>
            </ul>
            <h3>OTP</h3>
            <p>${otp}</p>
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
      from: '"User Query" <queryaidataron@gmail.com>', // sender address
      to: email, // list of receivers
      // subject: subject, // Subject line
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

        // let emailOtp = new Emailotp({
        //   email,
        //   otp,
        // });
        // await emailOtp.save();
        // res.status(200).json({ message: "Check Your Email" });
        // return true;
      }
    });
    return true;
  } else {
    // res.status(401).json({ message: "Something went Wrong" });
    return false;
  }
};

const sendPhoneOtp = (phone, otp) => {
  const from = "Vinted.CI";
  const to = phone;
  const text = `Your Verification OTP is ${otp}`;

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
};

const signup = async (req, res, next) => {
  const { username, email, password, phone } = req.body;
  console.log(req.body);

  if (username && email && password && phone) {
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });

      if (existingUser) {
        console.log("user already exists");
        res.json({ message: "User Already Exists", success: false });
        return;
      }
    } catch (err) {
      // res.status(500).json({
      //   message: "Signing up failed, please try again later.",
      //   error: "500",
      // });
      // return;
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    try {
      existingUser = await User.findOne({ phone: phone });

      if (existingUser) {
        console.log("user already exists");
        res.json({ message: "User Phone Already Exists", success: false });
        return;
      }
    } catch (err) {
      // res.status(500).json({
      //   message: "Signing up failed, please try again later.",
      //   error: "500",
      // });
      // return;
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log("Signing up failed, please try again later.");
      // res.status(500).json({
      //   message: "Signing up failed, please try again later.",
      //   error: "500",
      // });
      // return;
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let otpEmail = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    let otpPhone = otpGenerator.generate(4, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    const createdUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      emailVerified: false,
      phoneVerified: false,
      otpEmail: otpEmail,
      otpPhone: otpPhone,
    });

    try {
      createdUser.save((err) => {
        if (err) {
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        } else {
          let access_token;

          try {
            access_token = jwt.sign(
              { userId: createdUser.id, email: createdUser.email },
              "myprivatekey",
              { expiresIn: "1h" }
            );
          } catch (err) {
            res.json({
              success: false,
              data: err,
              message: "Signing up failed, please try again later.",
            });
            return;
          }
          console.log({ message: "user created", createdUser });

          sendEmailOtp(email, otpEmail);
          sendPhoneOtp(phone, otpPhone);

          res.status(200).send({
            message: "Welcome to VINTED.CI",

            username: createdUser.username,
            email: createdUser.email,
            access_token: access_token,
            id: createdUser._id,
            phone: createdUser.phone,
            success: true,
            emailVerified: createdUser.emailVerified,
            phoneVerified: createdUser.phoneVerified,
          });
        }
      });
    } catch (err) {
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }
  } else {
    res.json({ message: "Please Enter all the Details", success: false });
  }
};

const login = async (req, res, next) => {
  const { emailorphone, password, type } = req.body;
  let existingUser;

  console.log(emailorphone, password, type);

  if (type === "email") {
    try {
      existingUser = await User.findOne({ email: emailorphone });
    } catch (err) {
      // const error = new HttpError(
      //   "Logging in failed, please try again later.",
      //   500
      // );
      // return next(error);
      res.json({
        success: false,
        message: "Logging in failed, please try again later.",
      });
    }

    if (!existingUser) {
      res.json({
        success: false,
        message: "Logging in failed, please try again later.",
      });

      return;
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      // const error = new HttpError(
      //   "Could not log you in, please check your credentials and try again.",
      //   500
      // );
      // return next(error);
      res.json({
        success: false,
        data: err,
        message:
          "Could not log you in, please check your credentials and try again.",
      });
    }

    if (!isValidPassword) {
      // const error = new HttpError(
      //   "Invalid credentials, could not log you in.",
      //   403
      // );
      // return next(error);
      res.json({
        success: false,
        message:
          "Could not log you in, please check your credentials and try again.",
      });
    }

    let access_token;
    try {
      access_token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "myprivatekey",
        { expiresIn: "1h" }
      );
    } catch (err) {
      // const error = new HttpError(
      //   "Logging in failed, please try again later.",
      //   500
      // );
      // return next(error);
      res.json({
        success: false,
        data: err,
        message: "Logging in failed, please try again later.",
      });
    }

    res.json({
      message: "you are login success fully ",
      username: existingUser.username,
      id: existingUser._id,
      // role: [existingUser.role],
      email: existingUser.email,
      access_token: access_token,
      phone: existingUser.phone,
      success: true,
      emailVerified: existingUser.emailVerified,
      phoneVerified: existingUser.phoneVerified,
      favourites: existingUser.favourites,
      profileImage: existingUser.profileImage,
    });
  } else {
    try {
      existingUser = await User.findOne({ phone: emailorphone });
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }

    if (!existingUser) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      res.json({
        success: false,
        data: error,
      });

      return;
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      const error = new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      );
      return next(error);
    }

    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }

    let access_token;
    try {
      access_token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        "myprivatekey",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError(
        "Logging in failed, please try again later.",
        500
      );
      return next(error);
    }

    console.log(existingUser.favourites);

    res.json({
      message: "you are login success fully ",
      username: existingUser.username,
      id: existingUser._id,
      // role: [existingUser.role],
      email: existingUser.email,
      access_token: access_token,
      phone: existingUser.phone,
      success: true,
      emailVerified: existingUser.emailVerified,
      phoneVerified: existingUser.phoneVerified,
      favourites: existingUser.favourites,
      profileImage: existingUser.profileImage,
    });
  }
};

const emailverify = async (req, res) => {
  const { otp, email } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email }, "-password");
    console.log(user);
    if (user) {
      if (user.otpEmail === otp) {
        User.update(
          { email: email },
          { $set: { emailVerified: true } },
          function (err) {
            if (!err) {
              return res.json({
                success: true,
                message: "Email Verified",
              });
            }
          }
        );
      } else {
        res.json({ success: false, message: "Otp Wrong" });
        return;
      }
    }
  } catch (err) {
    return res.json({ success: false, message: "Somthing went wrong" });
  }
};

const phoneverify = async (req, res) => {
  const { otp, phone } = req.body;
  console.log(otp, phone);
  try {
    user = await User.findOne({ phone: phone }, "-password");
    console.log(user);
    if (user) {
      if (user.otpPhone === otp) {
        User.update(
          { phone: phone },
          { $set: { phoneVerified: true } },
          function (err) {
            if (!err) {
              return res.json({
                success: true,
                message: "phone Verified",
                user: user,
              });
            }
          }
        );
      } else {
        res.json({ success: false, message: "Otp Wrong" });
        return;
      }
    }
  } catch (err) {
    return res.json({ success: false, message: "Somthing went wrong" });
  }
};

const updateUserUsername = async (req, res) => {
  const { username, id } = req.body;
  console.log(username, id);
  let user;
  try {
    // user = await User.findOne({ _id: id });
    // console.log(user);
    User.update({ _id: id }, { $set: { username: username } }, function (err) {
      if (!err) {
        console.log("username updated");
        return res.json({ success: true, message: "Username Updated " });
      }
    });
  } catch (err) {
    console.log("error");
  }
};

const updateUserPassword = async (req, res) => {
  console.log(req.body);

  const { passwordUpdate, id } = req.body;
  const { oldPassword, newPassword } = passwordUpdate;

  let existingUser;

  try {
    existingUser = await User.findOne({ _id: id });
    console.log(existingUser);
  } catch (err) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, existingUser.password);
    console.log(isValidPassword);
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  if (isValidPassword) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      console.log("Error hashing password", err);

      res.json({
        success: false,
        data: err,
        message: "Something went wrong",
      });
      return;
    }

    User.update(
      { _id: id },
      { $set: { password: hashedPassword } },
      function (err) {
        if (!err) {
          return res.json({ success: true, message: "Password Updated" });
        }
      }
    );
  } else {
    res.json({
      success: false,
      message: "Wrong Old PAssword",
    });
    return;
  }
};

const saveFavourite = async (req, res) => {
  console.log(req.body);
  const { id, userId } = req.body;

  let user;

  try {
    user = await User.findOne({ _id: userId });
    console.log(user);
    User.update(
      { _id: userId },
      { $set: { favourites: [...user.favourites, id] } },
      async function (err) {
        if (!err) {
          console.log("Favourite Added");

          try {
            user = await User.findOne({ _id: userId });
            return res.json({
              success: true,
              message: "Added to Favourites",
              favs: user.favourites,
            });
          } catch (err) {
            res.json({
              success: false,
              message: "Something went wrong Login Again",
            });
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong You Might be not Logged in",
    });
    return;
  }

  // if(user){

  // }
};

const deleteFavourite = async (req, res) => {
  console.log(req.body);
  const { id, userId } = req.body;

  let user;

  try {
    user = await User.findOne({ _id: userId });
    console.log(user);
    let favs = user.favourites.filter((f) => f != id);
    console.log(favs.length);
    User.update(
      { _id: userId },
      { $set: { favourites: favs } },
      function (err) {
        if (!err) {
          console.log("Favourite removed");
          return res.json({ success: true, message: "Removed", favs: favs });
        } else {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }

  // if(user){

  // }
};

const getMessages = async (req, res) => {
  console.log(req.body);

  try {
    let user = await User.findOne({ _id: req.body.id });
    if (user) {
      res.json({
        success: true,
        message: "messages Found",
        messages: user.messages,
      });
    } else {
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateImage = (req, res) => {
  // console.log(req.body);

  const { userId, image } = req.body;
  console.log(userId);

  User.update(
    { _id: userId },
    { $set: { profileImage: image } },
    function (err) {
      if (!err) {
        console.log("Profile Pic Updated");
        return res.json({ success: true, message: "Profile Pic Updated" });
      } else {
        res.json({
          success: false,
          message: "Something went wrong",
        });
        return;
      }
    }
  );
};

const getSearchActivity = async (req, res) => {
  console.log(req.body);

  const { id } = req.body;
  try {
    let user = await User.findOne({ _id: id });
    if (user) {
      res.json({
        success: true,
        searchActivity: user.searchActivity,
        message: "Activity Found",
      });
    } else {
      res.json({
        success: false,
        message: "Activity not Found Something went wrong",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const fbLogin = async (req, res) => {
  // console.log(req.body);

  const { name, email, id, accessToken, picture, mobile } = req.body;
  console.log(email, name, email, id, accessToken, picture, mobile);

  if (email && accessToken) {
    try {
      console.log("finding user");
      let user = await User.findOne({ email: email });

      if (user) {
        console.log("user found");
        res.json({
          username: user.username,
          email: user.email,
          access_token: accessToken,
          id: user._id,
          phone: user.phone,
          success: true,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          favourites: user.favourites,
          profileImage: user.profileImage,
          success: true,
          message: "Logedin SuccessFully",
        });
      } else {
        console.log("IN ELSEEEEEEEEEE");
        const createdUser = new User({
          username: name,
          email: email,
          password: "signedupwithfb",
          emailVerified: true,
          phoneVerified: true,
          otpEmail: 1234,
          otpPhone: 1234,
          profileImage: picture.data.url,
          phone: "",
        });

        try {
          console.log("Creating user");
          await createdUser.save((err) => {
            if (err) {
              res.json({
                success: false,
                data: err,
                message: "Signing up failed, please try again later.",
              });
            } else {
              res.send({
                message: "Welcome to VINTED.CI",

                username: createdUser.username,
                email: createdUser.email,
                access_token: accessToken,
                id: createdUser._id,
                phone: createdUser.phone,
                success: true,
                emailVerified: createdUser.emailVerified,
                phoneVerified: createdUser.phoneVerified,
              });
            }
          });
        } catch (err) {
          console.log(err, "In ERORRRRRRRRRRRRRRRRRRRRRR");
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Login failed");
    res.json({ success: false, message: "Login Failed" });
  }
};

const deleteUsers = async (req, res) => {
  console.log(req.body);

  const { ids } = req.body;

  console.log(ids);

  try {
    let user = await User.deleteMany({ _id: ids });
    res.json({ success: true, message: "Users deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const blockUsers = async (req, res) => {
  console.log(req.body);

  const { ids } = req.body;

  console.log(ids);

  try {
    let user = await User.updateMany({ _id: ids }, { block: true });
    console.log(user);
    res.json({ success: true, message: "Users Blocked" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "blocking Failed" });
    return;
  }
};

const editUsers = (req, res) => {
  console.log(req.body);

  const { username, emailVerified, phoneVerified, userId } = req.body;

  User.update(
    { _id: userId },
    { $set: { username, emailVerified, phoneVerified } },
    function (err) {
      if (!err) {
        console.log("User Updated");
        return res.json({ success: true, message: "User Updated" });
      } else {
        res.json({
          success: false,
          message: "Something went wrong",
        });
        return;
      }
    }
  );
};

module.exports = {
  getUsers,
  signup,
  login,
  emailverify,
  phoneverify,
  updateUserUsername,
  updateUserPassword,
  saveFavourite,
  deleteFavourite,
  getMessages,
  updateImage,
  getSearchActivity,
  fbLogin,
  deleteUsers,
  editUsers,
  blockUsers,
};
