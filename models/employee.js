const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    department: { type: String, required: true },
})

module.exports = mongoose.model('employee', employeeSchema);