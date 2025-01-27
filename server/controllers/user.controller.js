import { User } from "../models/user.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`;

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password,
      role,
      emailVerificationToken: role === "recruiter" ? emailVerificationToken : null,
    });

    if (role === "recruiter") {
      const subject = "Email Verification";
      const message = `Hi ${fullname},\n\nPlease verify your email by clicking the link below:\n\n${verificationUrl}\n\nThank you,\nJobHunt Team`;

      await sendEmail({ email, subject, message });

      return res.status(201).json({
        message: "Account created successfully. Please check your email for verification.",
        success: true,
      });
    }

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token.",
        success: false,
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();
    console.log('User after email verification:', user);
    // Generate JWT token
    const tokenData = { userId: user._id };
    const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", jwtToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
      .json({
        message: "Email verified successfully. You are now logged in.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check email verification only if the user is a recruiter
    if (role === "recruiter" && !user.isEmailVerified) {
      return res.status(400).json({
        message: "Email not verified. Please check your email and verify your account.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with the current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

  

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};