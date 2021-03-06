const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        required: [true, 'Please Enter email'], 
        lowercase: true,
        unique: [true, 'Email already in use'],
        validate: [isEmail, 'Please enter valid email'] 
    },
    password: { 
        type: String, 
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum length of password should be 6']
    },
    degree:   { 
        type: String, 
        required: true
    },
    college:  { 
        type: String, 
        required: true
    },
    gradyear: { 
        type: Number, 
        required: true
    },
    linkedin: { 
        type: String, 
        required: true
    },
    result: Array
   });
  
userSchema.pre('save', async function(next){
    const salt= await  bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
}) 

userSchema.post('save', function(doc,next){
    console.log('New User Created', doc);
    next();
});  

userSchema.statics.login = async function(email,password) {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            console.log(user);
            return user;
        }
        throw Error('Incorrect Password!');
    }
    throw Error('Incorrect Email!');
}

const User = mongoose.model("users", userSchema);
module.exports = User;
