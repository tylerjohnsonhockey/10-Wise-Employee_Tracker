USE company_db;

INSERT INTO department (name)
VALUES 
("Engineering"),
("Sales"),
("Finance"),
("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Software Engineer", 120000, 1),
("Salesperson", 80000, 2),
("Lead Engineer", 150000, 1),
("Account Manager", 160000, 3),
("Legal Team Lead", 250000, 4),
("Accountant", 125000, 3);
("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
("Mike", "Chan", 1, null),
("Ashley", "Rodriguez", 4, 3),
("Kevin", "Tupik", 3, null),
("Kunal", "Singh", 5, null),
("Malia", "Brown", 6, null),
("Sarah", "Lourd", 3, null),
("Tom", "Allen", 4, 6),
