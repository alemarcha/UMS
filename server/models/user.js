const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt-nodejs"),
  config = require("../config/main");

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

//================================
// User Schema
//================================
const UserSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]
    },
    password: {
      type: String,
      required: true
    },
    firstName: { type: String },
    lastName: { type: String },
    isActive: {
      default: true,
      type: Boolean
    },
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    tokens: [
      {
        refreshToken: {
          type: String
        },
        token: {
          type: String
        },
        active: {
          type: Boolean
        }
      }
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  {
    timestamps: true
  }
);
// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  this.constructor.hashPassword(user.password, config.SALT_FACTOR, function(
    hash
  ) {
    user.password = hash;
    next();
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

UserSchema.statics.hashPassword = function(
  plainPassword,
  saltRounds = config.SALT_FACTOR,
  cb
) {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(plainPassword, salt);
  cb(hash);
};

module.exports = mongoose.model("User", UserSchema);
