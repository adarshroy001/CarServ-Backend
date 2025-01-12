const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure that the target directory exists
const dir = "./public/images";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir); // Store files in the 'images' folder
  },
  filename: function (req, file, cb) {
    let fileExtension = path.extname(file.originalname);
    const filenameWithoutExtension = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-")
      .split(".")[0]; // Remove file extension from filename

    // Ensure the filename only contains safe characters
    const sanitizedFilename = filenameWithoutExtension.replace(/[^a-z0-9-]/g, "");

    cb(
      null,
      sanitizedFilename +
        Date.now() +
        Math.ceil(Math.random() * 1e5) + // Avoid rare name conflict
        fileExtension
    );
  },
});

// File filter to accept only images (or you can add other types like .pdf, .docx, etc.)
const fileFilter = (req, file, cb) => {
  const imageMimeTypes = /image/;
  const allowedFileTypes = [
    imageMimeTypes,
    "application/pdf", // PDF
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  if (
    allowedFileTypes.some((type) =>
      file.mimetype.match(type)
    )
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only images, PDFs, and DOCX files are allowed."), false);
  }
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = { upload };
