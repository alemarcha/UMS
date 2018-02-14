const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
//================================
//
// Permission Schema
//================================
const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save of user to database, hash password if password is modified or new
PermissionSchema.pre("save", function(next) {
  console.log("Saving Permission");
  next();
});

module.exports = mongoose.model("Permission", PermissionSchema);
