import multer from "multer";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const arr = []
    const filename = Date.now() + '-' + file.originalname
    cb(null, filename); // Set a unique filename for each uploaded file
  },
});

export const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 20 } }); // Limit file size to 5 MB





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
