const mongoose = require('mongoose');



let passwordValidator = {
    validator: function(password) {
        return this.passwordConfirmation == password;
    },
    message: 'Contraseña incorrecta'
};

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        minlength: [5, 'Tu constaseña no puede ser menor a 5 caracteres'],
        validate: passwordValidator
    },
    nombre: String,
    birthDate: Date,
    perfilImage: String,
    isAdmin: Boolean
});

userSchema.virtual('passwordConfirmation').
get(function() { return this.pc; }).
set(function(password) {
    this.pc = password;
});

const User = mongoose.model('User', userSchema);

module.exports = User;