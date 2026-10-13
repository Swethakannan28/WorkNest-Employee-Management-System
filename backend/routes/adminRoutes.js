const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeProfileImage
} = require("../controllers/adminController");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/employees", getAllEmployees);

router.get("/employees/:id", getEmployeeById);

router.post("/employees", createEmployee);

router.put("/employees/:id", updateEmployee);

router.delete("/employees/:id", deleteEmployee);

router.get("/employees/:id/image", getEmployeeProfileImage);

module.exports = router;