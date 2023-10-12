const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken");


const employeModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is requared"],
        minLength: [3, "First Name Should be atleast 3 charectosr long"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is requared"],
        minLength: [3, "Last Name Should be atleast 3 charectors long"]
    },
    contact: {
        type: String,
        required: [true, "Contact is requared"],
        minLength: [10, "Contact must be contain 10 charectors"],
        maxLength: [10, "Contact must not exceed 10 charectors"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        select: false,
        maxLength: [15, "Password should not exceed more than 15 characters"],
        minLength: [5, "Password should have atleast less than 5 characters"]
        // match[]
    },
    resetPasswordToken: {
        type: String,
        default: "0"
    },
    organizationLogo: {
        type: Object,
        default: {
            fileId: "",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZt50gh1uEkLw2lX99k9bWVzxDiKZ4O9rmqxk98XhfOg&s"
        }
    },
    organizationName: {
        type: String,
        required: [true, "Organization Name is requared"],
        minLength: [3, "Organization Name Should be atleast 3 charectosr long"]
    },
    internships: [
        { type:  mongoose.Schema.Types.ObjectId, ref: "internship"}
    ],
    jobs: [
        { type:  mongoose.Schema.Types.ObjectId, ref: "job"}
    ]
}, {timestamps: true})

employeModel.pre("save", function(){
    if(!this.isModified("password")) return;
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
})

employeModel.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
}
employeModel.methods.getJWTtoken = function(){
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

const Employe = mongoose.model("employe", employeModel);
module.exports = Employe;