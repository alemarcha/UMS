const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  config = require("../config/main");

//================================
// Permission Schema
//================================

const PermissionSchema = new Schema(
  {
    permissionName: {
      type: String,
      unique: true,
      required: true
    },
    isActive: {
      default: true,
      type: Boolean
    }
  },
  {
    timestamps: true
  }
);

// Pre-save of permission to database
PermissionSchema.pre("save", function(next) {
  console.log("Saving Permission");
  next();
});

module.exports = mongoose.model("Permission", PermissionSchema);
