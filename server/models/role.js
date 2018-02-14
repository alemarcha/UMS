const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

//================================
//
// Role Schema
//================================
const RoleSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }]
  },
  {
    timestamps: true
  }
);

// Pre-save of user to database, hash password if password is modified or new
RoleSchema.pre("save", function(next) {
  console.log("Saving Role");
  next();
});

module.exports = mongoose.model("Role", RoleSchema);
