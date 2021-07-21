const Ad = require("../Models/Ad");
const User = require("../Models/User");
const Featuread = require("../Models/Featuread");
const nodemailer = require("nodemailer");
const { createIndexes } = require("../Models/Ad");

const getAds = async (req, res, next) => {
  console.log("hello g");
  let ads;
  try {
    ads = await Ad.find({}, "-images");
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  let reverse = ads.map((item) => item).reverse();
  res.json({ ads: reverse });
};

const getImages = async (req, res) => {
  console.log("hello g images");
  const { adId } = req.body;
  let images;
  try {
    images = await Ad.find({ _id: adId }, "images");
    res.json({ images: images });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching images",
    });
    return;
  }
};

const getActiveAds = async (req, res, next) => {
  console.log("hello g from active ads");
  let ads;
  try {
    ads = await Ad.find({ active: true, sold: false });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  let reverse = ads.map((item) => item).reverse();
  res.json({ ads: reverse });
};

const countAds = async (req, res) => {
  console.log("hello g");
  let ads;
  try {
    ads = await Ad.countDocuments({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  console.log(ads);
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

const getFeatureAdsRequests = async (req, res) => {
  console.log("yooo");
  let ads;
  try {
    ads = await Ad.find({ featureAdRequest: true }, "-images");
    let reverse = ads.map((item) => item).reverse();
    res.json({
      success: true,
      message: "Ads found",
      ads: reverse,
    });
    return;
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
};

const getAdsApproval = async (req, res) => {
  console.log("yooo");
  let ads;
  try {
    ads = await Ad.find({ reviewed: false });
    let reverse = ads.map((item) => item).reverse();
    res.json({
      success: true,
      message: "Ads found",
      ads: reverse,
    });
    return;
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
};

const countFeatureAdsRequests = async (req, res) => {
  console.log("hello g");
  let ads;
  try {
    ads = await Ad.countDocuments({ featureAdRequest: true });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  console.log(ads);
  res.json({ ads: ads });
};

const getFeatureAds = async (req, res) => {
  console.log("yooo");
  let ads;
  try {
    ads = await Featuread.find({ sold: false }, "-images");
    let reverse = ads.map((item) => item).reverse();
    res.json({
      success: true,
      message: "Ad found",
      ads: reverse,
    });
    return;
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
};

const getFeatureImages = async (req, res) => {
  console.log("hello g images");
  const { adId } = req.body;
  let images;
  try {
    images = await Featuread.find({ _id: adId }, "images");
    res.json({ images: images });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching images",
    });
    return;
  }
};

const getFeatureRequestsImages = async (req, res) => {
  console.log("hello g images");
  const { adId } = req.body;
  let images;
  try {
    images = await Ad.find({ _id: adId }, "images");
    res.json({ images: images });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching images",
    });
    return;
  }
};

const getFeatureAd = async (req, res, next) => {
  console.log(req.body, "in getFeatureAd");
  let ad;
  try {
    ad = await Featuread.find({ _id: req.body.id });
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

const countFeatureAds = async (req, res) => {
  console.log("hello g");
  let ads;
  try {
    ads = await Featuread.countDocuments({});
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      data: err,
      message: "Error fectching Ads",
    });
    return;
  }
  console.log(ads);
  res.json({ ads: ads });
};

const adsStats = async (req, res) => {
  console.log("working");
  let activeAds, totalAds, approvedAds, rejectedAds;
  try {
    activeAds = await Ad.countDocuments({ active: true });
    totalAds = await Ad.countDocuments({});
    approvedAds = await Ad.countDocuments({ approved: true });
    rejectedAds = await Ad.countDocuments({ rejected: true });
    console.log(activeAds, totalAds, approvedAds, rejectedAds);

    res.json({
      message: "Found",
      success: true,
      stats: { activeAds, totalAds, approvedAds, rejectedAds },
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Not Found",
      success: false,
    });
  }
};

const makeFeatureAd = async (req, res) => {
  // console.log(req.body);
  // const { type, id, featureAd, featureAdReviewed, featureAdRequest } = req.body;
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
    type,
    id,
    featureAd,
    featureAdReviewed,
    featureAdRequest,
    _id,
  } = req.body;

  if (type === "accept") {
    const createdAd = new Featuread({
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
      featureAd,
      featureAdRequest,
      featureAdReviewed,
      active: true,
      approved: true,
      reviewed: true,
    });
    try {
      createdAd.save(async (err) => {
        if (err) {
          console.log("In Try if", err);
          res.json({
            success: false,
            data: err,
            message: "Creating Feature Ad Failed",
          });
          return;
        } else {
          res.json({
            ad: createdAd,
            success: true,
            message: "Ad Has been Featured",
          });
          try {
            // console.log(_id);
            // let ad = await Ad.find({ _id: _id });
            // console.log(ad);
            await Ad.updateOne(
              { _id: _id },
              { featureAd, featureAdRequest, featureAdReviewed },
              function (err) {
                if (err) {
                  console.log("error updating ad", err);
                  return;
                } else {
                  console.log("ad updated");
                }
              }
            );

            emailSender(
              contactDetails.email,
              "Your Ad Update",
              "Your Ad Got Featured"
            );
          } catch (err) {
            res.json({
              success: false,
              data: err,
              message: "Updating Feature Ad Request status failed",
            });
            return;
          }
        }
      });
    } catch (err) {
      console.log("In catch err");
      res.json({
        success: false,
        data: err,
        message: "Creating Feature Ad Failed",
      });
      return;
    }
  } else if (type === "reject") {
    try {
      await Ad.updateOne(
        { _id: _id },
        { $set: { featureAd, featureAdRequest, featureAdReviewed } },
        function (err) {
          if (!err) {
            res.json({
              success: true,
              message: `Ad is rejected`,
            });
            emailSender(
              contactDetails.email,
              "Your Ad Update",
              "Your Feature Ad Got Rejected"
            );
            return;
          } else {
            res.json({
              success: false,
              message: `Somthing went wrong`,
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: `Somthing went wrong`,
      });
    }
  }
};

const removeFeatureAd = async (req, res) => {
  console.log(req.body);

  const { id, email } = req.body;

  try {
    await Featuread.remove({ _id: id });
    try {
      await Ad.updateOne(
        { _id: id },
        { $set: { featureAd: false } },
        function (err) {
          if (!err) {
            console.log("ad updated");

            emailSender(email, "Your Ad Update", "Your Feature Ad Got Removed");
            res.json({
              message: "Removed from features",
              success: true,
            });
          } else {
            console.log("error");
            res.json({
              success: false,
              message: `Somthing went wrong`,
            });
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        message: `Somthing went wrong`,
      });
    }
  } catch (err) {
    console.log(err, "error");
    res.json({
      message: "Somthing went wrongg",
      success: false,
    });
  }
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
    featureAdRequest,
  } = req.body;

  const createdAd = new Ad({
    title,
    category: category.category._id,
    categoryName: category.category.title,
    subCategory: category.subcategory.id,
    subCategoryName: category.subcategory.subTitle,
    description,
    price,
    images,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user,
    featureAdRequest,
  });
  try {
    createdAd.save((err) => {
      if (err) {
        res.json({
          success: false,
          data: err,
          message: "Creating Ad Failed",
        });
        return;
      } else {
        res.send({
          ad: createdAd,
          success: true,
          message: "Ad Gone for Review SuccessFully",
        });
      }
    });
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Creating Ad Failed",
    });
    return;
  }
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

  let reverse = ads.map((item) => item).reverse();

  if (ads) {
    res.json({
      success: true,
      ads: reverse,
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

const deleteAds = async (req, res) => {
  console.log(req.body);
  const { ids, emails } = req.body;

  console.log(ids);

  try {
    let ad = await Ad.deleteMany({ _id: ids });
    res.json({ success: true, message: "Ads deleted" });
    emails.map((email) => {
      response = emailSender(email, "Your Ad Update", "Your Ad Got Deleted");
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const deleteFeatureAds = async (req, res) => {
  console.log(req.body);
  const { ids, emails } = req.body;

  console.log(ids);

  try {
    let ad = await Featuread.deleteMany({ _id: ids });
    res.json({ success: true, message: "Ads deleted" });
    emails.map((email) => {
      response = emailSender(
        email,
        "Your Ad Update",
        "Your Feature Ad Got Deleted"
      );
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
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

const featureAdRequest = async (req, res) => {
  console.log(req.body);

  const { checked, id } = req.body;
  let ad;

  try {
    Ad.update(
      { _id: id },
      { $set: { featureAdRequest: checked } },
      function (err) {
        if (!err) {
          return res.json({
            success: true,
            message: `Ad is ${
              checked ? "Requested for Feature" : "Un Requested"
            }`,
          });
        }
      }
    );
  } catch (err) {
    console.log(err, "hello");
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const soldAd = async (req, res) => {
  console.log(req.body);

  const { checked, id } = req.body;
  let ad;

  try {
    Ad.update({ _id: id }, { $set: { sold: true } }, function (err) {
      if (!err) {
        return res.json({
          success: true,
          message: `Ad is ${checked ? "Sold" : "Un Requested"}`,
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
    sold,
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

  console.log(id);
  console.log(
    title,
    category,
    description,
    price,
    location,
    contactDetails,
    negotiable,
    hideNumber,
    reviewed,
    user
  );

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = await Ad.updateOne(
      { _id: id },

      {
        $set: {
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
          sold,
        },
      },
      function (err) {
        console.log(err);
        if (err) {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        } else {
          res.json({
            success: true,
            message: "Ad Updated",
          });
          return;
        }
      }
    );

    console.log("done");
  } catch (err) {
    console.log(err);
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

  const { searchValue, price, negotiable, category, location } =
    req.body.search;
  const { userId } = req.body;
  let yoo;

  // let searchPattern = new RegExp("^" + search);
  console.log(price, negotiable, location);
  try {
    yoo = await Ad.find({
      title: { $regex: searchValue, $options: "i" },
      active: true,
    });
    console.log(yoo.length);
    if (location) {
      console.log("in location");
      yoo = yoo.filter((ad) => {
        if (typeof ad.location === "object") {
          return (
            ad.location.mapPosition.lat === location.mapPosition.lat &&
            ad.location.mapPosition.lng === location.mapPosition.lng
          );
        }
      });
      if (negotiable) {
        yoo = yoo.filter((ad) => {
          return ad.negotiable === true;
        });
      }

      if (price.length === 2) {
        yoo = yoo.filter((ad) => {
          return ad.price >= price[0] && ad.price <= price[1];
        });
      }

      if (category) {
        yoo = yoo.filter((ad) => {
          console.log("in Category");
          return (
            ad.category === category.category._id &&
            ad.subCategory === category.subCategory.id
          );
        });
      }
    } else if (price.length === 2) {
      yoo = yoo.filter((ad) => {
        return ad.price >= price[0] && ad.price <= price[1];
      });

      if (location) {
        yoo = yoo.filter((ad) => {
          if (typeof ad.location === "object") {
            return (
              ad.location.mapPosition.lat === location.mapPosition.lat &&
              ad.location.mapPosition.lng === location.mapPosition.lng
            );
          }
        });
      }

      if (negotiable) {
        yoo = yoo.filter((ad) => {
          return ad.negotiable === true;
        });
      }

      if (category) {
        yoo = yoo.filter((ad) => {
          console.log("in Category");
          return (
            ad.category === category.category._id &&
            ad.subCategory === category.subCategory.id
          );
        });
      }
    } else if (negotiable) {
      yoo = yoo.filter((ad) => {
        return ad.negotiable === true;
      });

      if (category) {
        yoo = yoo.filter((ad) => {
          console.log("in Category");
          return (
            ad.category === category.category._id &&
            ad.subCategory === category.subCategory.id
          );
        });
      }

      if (location) {
        yoo = yoo.filter((ad) => {
          if (typeof ad.location === "object") {
            return (
              ad.location.mapPosition.lat === location.mapPosition.lat &&
              ad.location.mapPosition.lng === location.mapPosition.lng
            );
          }
        });
      }
    } else if (category) {
      yoo = yoo.filter((ad) => {
        console.log("in Category");
        return (
          ad.category === category.category._id &&
          ad.subCategory === category.subCategory.id
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
          {
            $set: {
              searchActivity: [
                ...user.searchActivity,
                {
                  searchValue,
                  category: category.category ? category.category._id : "",
                  categoryName: category.category
                    ? category.category.title
                    : "",
                  subCategory: category.subCategory
                    ? category.subCategory.id
                    : "",
                  subTitle: category.subCategory
                    ? category.subCategory.subTitle
                    : "",
                  date: Date.now(),
                  negotiable: negotiable,
                  location: location.address,
                },
              ],
            },
          },
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

const getAdsByLocation = async (req, res) => {
  console.log(req.body);

  const location = req.body;
  try {
    yoo = await Ad.find({
      active: true,
    });

    console.log(yoo.length);

    yoo = yoo.filter((ad) => {
      if (typeof ad.location === "object") {
        return (
          ad.location.mapPosition.lat === location.lat &&
          ad.location.mapPosition.lng === location.lng
        );
      }
    });
    console.log(yoo.length);

    res.json({
      ads: yoo,
      success: true,
      message: "Ads Found",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "No Ad Found",
    });
  }
};

const getAdsByCategories = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    yoo = await Ad.find({
      category: id,
      active: true,
    });

    console.log(yoo.length);

    res.json({
      ads: yoo,
      success: true,
      message: "Ads Found",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "No Ad Found",
    });
  }
};

const sendMessage = async (req, res) => {
  // console.log(req.body);
  const { phone, message, email, adData, userId } = req.body;
  // console.log(phone, message, email, userId, adData.title);

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
                  msg.adData = adData;
                  msg.messages.push(message);
                  return;
                }
              });

              console.log(existMsgs[0].adData.title, "After");

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

const emailSender = async (email, subject, description) => {
  console.log(email, subject, description);
  if (email) {
    const output = `
            
            <p>${description}</p>
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
      subject: subject, // Subject line
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
        // res.json({ message: "Check Your Email", success: true });
        // return true;
      }
      return true;
    });
  } else {
    // res.json({ message: "Something went Wrong", message: false });
    return false;
  }
};

const rejectAds = async (req, res) => {
  console.log(req.body);
  const { ids, emails } = req.body;

  console.log(ids, emails);

  try {
    let ad = await Ad.updateMany(
      { _id: ids },

      {
        $set: {
          reviewed: true,
          active: false,
          rejected: true,
          approved: false,
        },
      }
    );
    console.log(ad);
    res.json({ success: true, message: "Ad Rejected" });
    let response;
    emails.map((email) => {
      response = emailSender(email, "Your Ad Update", "Your Ad Got Rejected");
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Somthing Went Wrong" });
    return;
  }
};

const approveAds = async (req, res) => {
  console.log(req.body);
  const { ids, emails } = req.body;

  console.log(ids);

  try {
    let ad = await Ad.updateMany(
      { _id: ids },

      {
        $set: { reviewed: true, active: true, rejected: false, approved: true },
      }
    );
    console.log(ad);
    res.json({ success: true, message: "Ad Approved and Active" });
    emails.map((email) => {
      response = emailSender(email, "Your Ad Update", "Your Ad Got Approved");
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Somthing Went Wrong" });
    return;
  }
};

const activeAds = async (req, res) => {
  console.log(req.body);
  const { id, emails } = req.body;

  console.log(id);

  try {
    let ad = await Ad.update(
      { _id: id },

      {
        $set: { active: true },
      }
    );
    console.log(ad);
    res.json({ success: true, message: "Ad is Active" });
    emails.map((email) => {
      response = emailSender(email, "Your Ad Update", "Your Ad Got Activated");
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Somthing Went Wrong" });
    return;
  }
};

const deActiveAds = async (req, res) => {
  console.log(req.body);
  const { id, emails } = req.body;

  console.log(id);

  try {
    let ad = await Ad.update(
      { _id: id },

      {
        $set: { active: false },
      }
    );
    console.log(ad);
    res.json({ success: true, message: "Ad is De Active" });

    emails.map((email) => {
      response = emailSender(
        email,
        "Your Ad Update",
        "Your Ad Got Deactivated"
      );
      console.log(response);
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Somthing Went Wrong" });
    return;
  }
};

const sendEmail = async (req, res) => {
  console.log(req.body);

  const { email, subject, description } = req.body;

  if (email) {
    const output = `

            <p>${description}</p>
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
      subject: subject, // Subject line
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
        res.json({ message: "Email Sent", success: true });
        // return true;
      }
    });
    return true;
  } else {
    res.json({ message: "Something went Wrong", message: false });
    return false;
  }
};
module.exports = {
  getAds,
  getImages,
  getActiveAds,
  placeAd,
  getUserAds,
  deleteAd,
  activeAd,
  editAd,
  getFavourites,
  search,
  getAd,
  sendMessage,
  deleteAds,
  approveAds,
  rejectAds,
  deActiveAds,
  activeAds,
  sendEmail,
  getFeatureAds,
  getFeatureAdsRequests,
  makeFeatureAd,
  removeFeatureAd,
  countAds,
  countFeatureAds,
  countFeatureAdsRequests,
  adsStats,
  featureAdRequest,
  soldAd,
  deleteFeatureAds,
  getFeatureAd,
  getAdsApproval,
  getAdsByLocation,
  getAdsByCategories,
  getFeatureImages,
  getFeatureRequestsImages,
};
