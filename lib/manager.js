const Employee = require('./employee');
const Department = require('./department');

class Manager extends Employee{
    constructor(first_name, last_name, id, department){
        super(first_name, last_name, id, department);
    }

    getRole(){
        return this.id;
    }

    getFirstName(){
        return this.first_name;
    }

    getLastName(){
        return this.last_name;
    }

    getDepartment(){
        return this.department;
    }

}

module.exports = Manager;