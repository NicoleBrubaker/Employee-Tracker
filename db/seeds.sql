INSERT INTO department (name)
VALUES ("Engineering"), ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 95000, 1), ("UX/UI Designer", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, NULL), ("Jane", "Adams", 2, NULL);
