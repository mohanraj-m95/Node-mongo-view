const express = require('express');
const mongoose = require('mongoose');
const Employee = require('./models/employee.js');
const Department = require('./models/department.js');

const app = express();

const dbURI = "mongodb://0.0.0.0:27017/employee-management";

mongoose.connect(dbURI)
    .then((result) => { console.log("Mongo DB connected..."); })
    .catch(err => console.log('MongoDB connection error:', err));

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    let allEmployee = Employee.find().then(data => {
        res.render('index', { employees: data });
    });
    //res.status(200).json({ message: 'Employee details fetched', data: allEmployee });
});

app.get('/employee/create', async (req, res) => {
    res.render('create');
});

app.post('/employee', async (req, res) => {
    let { name, surname, department } = req.body;
    let employee = new Employee({ name, surname, department });
    await employee.save().then(data => {
        //res.status(201).json({ message: 'Employee created successfully', data: data });
        res.redirect('http://localhost:3000');
    }).catch(err => {
        res.status(200).json({ message: 'Employee creation failed' });
    })
});

app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    Employee.findOne({ _id: id }).then(data => {
        res.render('edit', { user: data });
    });
    //res.status(200).json({ message: 'Employee details fetched', data: allEmployee });
});

app.post('/employee/:id', async (req, res) => {
    let { name, surname, department } = req.body;
    let id = req.params.id;
    let Update = await Employee.findOneAndUpdate(new mongoose.Types.ObjectId(id), { name, surname, department });
    if (Update) {
        res.redirect('http://localhost:3000');
        //res.status(200).json({ message: 'Employee details updated' });
    } else {
        res.status(200).json({ message: 'updation failed' });
    }
})

app.post('/employee/delete/:id', async (req, res) => {
    let id = req.params.id;
    let deleteone = await Employee.findOneAndDelete(new mongoose.Types.ObjectId(id));
    if (deleteone) {
        res.redirect('http://localhost:3000');
        //res.status(200).json({ message: 'Employee deleted successfully' });
    } else {
        res.status(200).json({ message: 'deletion failed' });
    }
})


app.get('/department', (req, res) => {
    let allDepartment = Department.find();
    res.status(200).json({ message: 'Department details fetched', data: allDepartment });
});

app.post('/department', async (req, res) => {
    let { name } = req.body;
    let department = new Department({ name });
    await department.save().then(data => {
        res.status(201).json({ message: 'Department created successfully', data: data });
    }).catch(err => {
        res.status(200).json({ message: 'Department creation failed' });
    })
});

app.put('/department/:id', async (req, res) => {
    let { name } = req.body;
    let id = req.params.id;
    let Update = await Department.findOneAndUpdate(new mongoose.Types.ObjectId(id), { name });
    if (Update) {
        res.status(200).json({ message: 'Department details updated' });
    } else {
        res.status(200).json({ message: 'updation failed' });
    }
})

app.delete('/department/:id', async (req, res) => {
    let id = req.params.id;
    let deleteone = await Department.findOneAndDelete(new mongoose.Types.ObjectId(id));
    if (deleteone) {
        res.status(200).json({ message: 'Department deleted successfully' });
    } else {
        res.status(200).json({ message: 'deletion failed' });
    }
})

app.listen('3000', () => {
    console.log('Server listening on port 3000');
})