import multer from "multer";

const multerOptions = () => {
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/users");
  //     console.log(file)
  //   },
  //   filename: function (req, file, cb) {
  //     const extention = file.mimetype.split("/")[1];
  //     const filename = `profile-${Date.now()}.${extention}`;
  //     cb(null, filename);
  //   },
  // });

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    console.log(file)
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(true, false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

export const uploadSingleImage = (fieldName) => {
  return multerOptions().single(fieldName);
};

export const uploadMixOfImages = (arrayOffFields) => {
  return multerOptions().fields(arrayOffFields);
};
