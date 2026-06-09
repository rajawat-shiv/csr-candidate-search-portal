const express = require("express");
const multer = require("multer");
const {
  uploadExcel,
  searchCandidate,
  getStats,
} = require("../controllers/candidate.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadExcel
);

router.get("/search", searchCandidate);
router.get("/stats", getStats);

module.exports = router;