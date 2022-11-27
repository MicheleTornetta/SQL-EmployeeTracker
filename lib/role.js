class Role{
    constructor(id, title, salary){
        this.title = title;
        this.salary = salary;
        this.id = id;
    }

    getTitle(){
        return this.title;
    }

    getSalary(){
        return this.salary;
    }

    getId(){
        return this.id;
    }

}

module.exports = Role;