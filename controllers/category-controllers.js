const Category = require("../Models/Category");
const { v4: uuidv4 } = require("uuid");

const getCategories = async (req, res) => {
  console.log("hello");
  let categories;

  try {
    categories = await Category.find({});
    res.json({
      success: true,
      categories: categories,
      message: "Categories Found",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Categories not found" });
  }
};

const addCategories = async (req, res) => {
  console.log(req.body);
  let { title, subcategories, icon, image } = req.body;

  if (subcategories) {
    subcategories = subcategories.split(",");

    subcategories = subcategories.map((sub) => {
      return { subTitle: sub, id: uuidv4() };
    });
  }

  console.log(subcategories);

  const createdCategory = new Category({
    title,
    subcategories,
    icon,
    image,
  });
  try {
    createdCategory.save((err) => {
      if (err) {
        res.json({
          success: false,
          data: err,
          message: "Creating Category Failed",
        });
        return;
      } else {
        res.json({ success: true, message: "Category Created" });
        return;
      }
    });
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Creating Category Failed",
    });
    return;
  }
};

const deleteCategories = async (req, res) => {
  console.log(req.body);
  const { ids } = req.body;

  console.log(ids);

  try {
    let category = await Category.deleteMany({ _id: ids });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const editCategories = async (req, res) => {
  console.log(req.body);

  let { title, subcategories, id, icon, image, newSubCategories } = req.body;

  if (newSubCategories) {
    newSubCategories = newSubCategories.split(",");

    newSubCategories = newSubCategories.map((sub) => {
      return { subTitle: sub, id: uuidv4() };
    });

    subcategories = subcategories.concat(newSubCategories);
    console.log(subcategories);
  }

  try {
    // ad = await Ad.findOne({ _id: id });

    let ad = await Category.updateOne(
      { _id: id },

      {
        $set: {
          title,
          subcategories,
          icon,
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
            message: "Category Updated",
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

module.exports = {
  getCategories,
  addCategories,
  deleteCategories,
  editCategories,
};
