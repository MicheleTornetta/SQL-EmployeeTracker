class Employee{
    constructor(first_name, last_name, id, role){
        this.first_name = first_name;
        this.last_name = last_name;
        this.id = id;
        this.role = role;
    }

    getFirstName(){
        return this.first_name;
    }

    getLastName(){
        return this.last_name;
    }

    getId(){
        return this.id;
    }

    getRole(){
        return "Employee";
    }

   
}

module.exports = Employee;