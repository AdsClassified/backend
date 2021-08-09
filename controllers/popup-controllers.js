const Popup = require("../Models/Popup");
const User = require("../Models/User");

const getPopup = async (req, res) => {
  console.log("hello");
  let popup;

  try {
    popup = await Popup.find({});
    res.json({
      success: true,
      popup: popup,
      message: "popup Found",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "popup not found" });
  }
};

const addPopup = async (req, res) => {
  // console.log(req.body);
  let { title, link, description, image } = req.body;

  const createdPopup = new Popup({
    title,
    link,
    description,
    image,
  });
  try {
    createdPopup.save((err) => {
      if (err) {
        res.json({
          success: false,
          data: err,
          message: "Creating Popup Failed",
        });
        return;
      } else {
        res.json({ success: true, message: "Popup Created" });
        User.update({}, { $set: { popupView: false } }, function (err) {
          if (!err) {
            console.log("Popup Sent to all");
          }
        });
        return;
      }
    });
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Creating Popup Failed",
    });
    return;
  }
};

const deletePopup = async (req, res) => {
  // console.log(req.body);
  const { ids } = req.body;

  console.log(ids);

  try {
    let category = await Popup.deleteMany({ _id: ids });
    res.json({ success: true, message: "Popup deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const editPopup = async (req, res) => {
  // console.log(req.body);

  let { title, link, id, description, image } = req.body;

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = await Popup.updateOne(
      { _id: id },

      {
        $set: {
          title,
          link,
          description,
          image,
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
            message: "Popup Updated",
          });
          User.update({}, { $set: { popupView: false } }, function (err) {
            if (!err) {
              console.log("Popup Sent to all");
            }
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

const closePopup = async (req, res) => {
  const { id } = req.body;

  try {
    User.updateOne({ _id: id }, { $set: { popupView: true } }, function (err) {
      if (!err) {
        console.log("Popup Viewed");
      } else {
        console.log("Error with popup");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getPopup,
  addPopup,
  deletePopup,
  editPopup,
  closePopup,
};
