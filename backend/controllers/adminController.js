const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const { UPLOAD_DIR } = require("../utils/saveProfileImage");

const { createEmployeeSchema,updateEmployeeSchema } = require("../validators/employeeValidator");

const createEmployee = async (req, res) => {
  try {
    
    const { error, value } = createEmployeeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((item) => item.message),
      });
    }

    const {
      name,
      email,
      password,
      department,
      designation,
      phone,
      address,
      joiningDate,
    } = value;

    
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 12);

   
    const employeeId = `EMP-${randomUUID().slice(0, 8).toUpperCase()}`;

  
    const employee = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "employee",
      employeeId,
      department,
      designation,
      phone,
      address,
      joiningDate,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
      },
    });
  } catch (error) {
    console.error("Create Employee Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Employee email or ID already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();

    const filter = {
      role: "employee",
    };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const employees = await User.find(filter)
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};


const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await User.findOne({
      _id: id,
      role: "employee",
    }).select("-__v");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee details",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }


    const { error, value } = updateEmployeeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((item) => item.message),
      });
    }


    const employee = await User.findOne({
      _id: id,
      role: "employee",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }


    if (value.email) {
      value.email = value.email.toLowerCase();

      const existingEmail = await User.findOne({
        email: value.email,
        _id: { $ne: id },
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    Object.assign(employee, value);

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

// Delete employee - Admin only
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    // Find and delete employee
    const employee = await User.findOneAndDelete({
      _id: id,
      role: "employee",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

// Admin - View an employee's profile image
const getEmployeeProfileImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate employee ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    // Find employee only
    const employee = await User.findOne({
      _id: id,
      role: "employee",
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (!employee.profileImage?.filename) {
      return res.status(404).json({
        success: false,
        message: "Employee profile image not found",
      });
    }

    // Read image using the stored filename
    const filename = path.basename(employee.profileImage.filename);

    const imagePath = path.join(UPLOAD_DIR, filename);

    await fs.access(imagePath);

    // Prevent public caching and MIME sniffing
    res.setHeader("Content-Type", employee.profileImage.mimeType);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.sendFile(imagePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Image file not found",
      });
    }

    console.error("Get Employee Image Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employee image",
    });
  }
};

module.exports = { 
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getEmployeeProfileImage};