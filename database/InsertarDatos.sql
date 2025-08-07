INSERT INTO roles (name)
VALUES ('ADMINISTRADOR'),
  ('COORDINADOR');
INSERT INTO users (name, dni, password, role_id)
VALUES ('Administrador', 12345678, 'admin123', 1);

INSERT INTO salons (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('A11', 40, 1, 1,1);

INSERT INTO salons (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('A13', 40, 1, 1,1);

INSERT INTO salons (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('B14', 40, 1, 1,1);

INSERT INTO salons (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('B22', 40, 1, 1,1);

INSERT INTO salons (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('A22', 40, 1, 1,1);

INSERT INTO students (name, capacity, sede_id,turn_id, registration_process_id)
VALUES ('A22', 40, 1, 1,1);

ALTER TABLE salons ADD COLUMN code VARCHAR(50) UNIQUE NOT NULL;

ALTER TABLE students
ADD COLUMN pdf_file MEDIUMBLOB;

SELECT * FROM education_center.salons ORDER BY name ASC