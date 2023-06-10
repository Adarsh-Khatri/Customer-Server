let express = require("express");
require('dotenv').config();
const PORT = process.env.PORT || 2410;

let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
    res.header("Access-Control-Allo-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(PORT, () => console.log(`Listening on port http://localhost/${PORT}`))

let { customerData } = require('./customerData.js')

let fs = require('fs');
let fileName = 'customer.json';

app.get('/resetData', (req, res) => {
    let data = JSON.stringify(customerData);
    fs.writeFile(fileName, data, (err) => {
        if (err) res.status(404).send(err)
        else res.send('DATA IN FILE IS RESET');
    })
})

app.get('/customers', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let customerArr = JSON.parse(data)
            res.send(customerArr)
        };
    })
})

app.post('/customers', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let customerArr = JSON.parse(data)
            let newCustomer = { ...req.body };
            customerArr.push(newCustomer)
            let data1 = JSON.stringify(customerArr)
            fs.writeFile(fileName, data1, (err) => {
                if (err) res.status(404).send(err)
                else res.send(newCustomer);
            })
        }
    })
})

app.put('/customers/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let customerArr = JSON.parse(data)
            let index = customerArr.findIndex(cust => cust.id === id)
            if (index >= 0) {
                let updatedCustomer = { ...customerArr[index], ...req.body }
                customerArr[index] = updatedCustomer;
                let data1 = JSON.stringify(customerArr)
                fs.writeFile(fileName, data1, (err) => {
                    if (err) res.status(404).send(err)
                    else res.send(updatedCustomer);
                })
            }
            else res.status(404).send("NO STUDENT FOUND")
        }
    })
})

app.delete('/customers/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let customerArr = JSON.parse(data)
            let index = customerArr.findIndex(cust => cust.id === id)
            if (index >= 0) {
                let deletedCustomer = customerArr.splice(index, 1)
                let data1 = JSON.stringify(customerArr)
                fs.writeFile(fileName, data1, (err) => {
                    if (err) res.status(404).send(err)
                    else res.send(deletedCustomer);
                })
            }
            else res.status(404).send("NO STUDENT FOUND")
        }
    })
})

