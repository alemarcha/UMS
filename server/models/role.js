const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  config = require("../config/main");

//================================
// Role Schema
//================================

const RoleSchema = new Schema(
  {
    roleName: {
      type: String,
      unique: true,
      required: true
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }]
  },
  {
    timestamps: true
  }
);

// Pre-save of role to database
RoleSchema.pre("save", function(next) {
  console.log("Saving Role");
  next();
});

module.exports = mongoose.model("Role", RoleSchema);
