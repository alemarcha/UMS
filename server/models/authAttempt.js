const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
//================================
//
// AuthAttemp Schema
//================================
const AuthAttemptSchema = new Schema(
  {
    userAttempt: {
      type: String,
      lowercase: true,
      required: true
    },
    passwordAttempt: {
      type: String,
      lowercase: true,
      required: true
    },
    ip: {
      type: String,
      lowercase: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save of user to database, hash password if password is modified or new
AuthAttemptSchema.pre("save", function(next) {
  console.log("Saving AuthAttempt");
  next();
});

module.exports = mongoose.model("AuthAttempt", AuthAttemptSchema);
