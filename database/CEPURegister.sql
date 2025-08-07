-- Crear la base de datos (opcional)
CREATE DATABASE IF NOT EXISTS education_center;
USE education_center;
-- Tabla de roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dni INT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
-- Tabla de procesos de inscripcion
CREATE TABLE registration_processes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code INT NOT NULL UNIQUE
);
-- Tabla de sedes
CREATE TABLE sedes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE
);
-- Tabla de turnos
CREATE TABLE turns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
-- Tabla de salones
CREATE TABLE salons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  priority INT NOT NULL,
  capacity INT NOT NULL,
  sede_id INT NOT NULL,
  turn_id INT NOT NULL,
  registration_process_id INT NOT NULL,
  FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
  FOREIGN KEY (turn_id) REFERENCES turns(id) ON DELETE CASCADE,
  FOREIGN KEY (registration_process_id) REFERENCES registration_processes(id) ON DELETE CASCADE
);
-- Tabla de planes de pago
CREATE TABLE payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  price INT NOT NULL
);
-- Tabla de alumnos
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dni INT NOT NULL,
  phone BIGINT DEFAULT 0,
  record_number BIGINT NOT NULL UNIQUE,
  date_inscription DATE NOT NULL,
  payment_plan_id INT NOT NULL,
  need_to_pay BOOLEAN NOT NULL DEFAULT TRUE,
  registration_process_id INT NOT NULL,
  sede_id INT NOT NULL,
  salon_id INT NOT NULL,
  turn_id INT NOT NULL,
  photo_base_64 MEDIUMBLOB,
  FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (registration_process_id) REFERENCES registration_processes(id) ON DELETE CASCADE,
  FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
  FOREIGN KEY (turn_id) REFERENCES turns(id) ON DELETE CASCADE
);
-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_sedes_name ON sedes(name);
CREATE INDEX idx_turns_name ON turns(name);
CREATE INDEX idx_salons_sede_turn ON salons(sede_id, turn_id);
CREATE INDEX idx_students_salon ON students(salon_id);
CREATE INDEX idx_registration_processes_code ON registration_processes(code);
CREATE INDEX idx_payment_plans_name ON payment_plans(name);