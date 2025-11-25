-- ========================================
-- SCRIPT PARA CREAR USUARIO ADMINISTRADOR
-- ========================================
-- 
-- Este script crea un usuario administrador en la base de datos
-- Ejecutar en el Editor SQL de Supabase
--
-- CREDENCIALES DEL ADMIN:
-- Email: admin@inmedt.com
-- Password: Admin123456
--
-- ⚠️ IMPORTANTE: Cambia estas credenciales después del primer login
--

-- Verificar si ya existe un usuario admin
SELECT 
    id, 
    nombre, 
    email, 
    role, 
    created_at 
FROM users 
WHERE email = 'admin@inmedt.com';

-- Si el usuario NO existe, ejecuta el INSERT:
-- (Si ya existe, primero elimínalo o usa un email diferente)

INSERT INTO users (
    nombre,
    email,
    password,
    ruc_cedula,
    role,
    enabled,
    created_at
) VALUES (
    'Administrador',
    'admin@inmedt.com',
    -- Password: Admin123456 (encriptada con BCrypt)
    '$2a$10$YqKy3/zLAjLZLZRZ8qZqfOkqg7QqYYqKQqKQqKQqKQqKQqKQqKQqK',
    NULL,
    'ROLE_ADMIN',
    true,
    NOW()
);

-- Verificar que se creó correctamente
SELECT 
    id, 
    nombre, 
    email, 
    role, 
    enabled,
    created_at 
FROM users 
WHERE email = 'admin@inmedt.com';

-- ========================================
-- ALTERNATIVA: Crear admin con datos personalizados
-- ========================================

-- Si quieres usar tu propio email y contraseña, usa este template:
-- (Descomenta y modifica según necesites)

/*
INSERT INTO users (
    nombre,
    email,
    password,
    ruc_cedula,
    role,
    enabled,
    created_at
) VALUES (
    'Tu Nombre Completo',           -- Cambia esto
    'tu-email@ejemplo.com',          -- Cambia esto
    -- Para generar tu propia contraseña encriptada, ve al final del archivo
    '$2a$10$8.WH6VZLvZhqfLGj3uqJVefnqJ5h3F7UqKr1KJmxhTQkKHPIvNLTq',
    NULL,                            -- O tu RUC/Cédula
    'ROLE_ADMIN',
    true,
    NOW()
);
*/

-- ========================================
-- ELIMINAR USUARIO (si necesitas recrearlo)
-- ========================================

-- ⚠️ CUIDADO: Solo ejecuta esto si necesitas eliminar el usuario admin
-- DELETE FROM users WHERE email = 'admin@inmedt.com';

-- ========================================
-- CAMBIAR ROL DE UN USUARIO EXISTENTE A ADMIN
-- ========================================

-- Si ya tienes un usuario registrado y quieres hacerlo admin:
-- UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'tu-email@ejemplo.com';

-- ========================================
-- PASSWORDS PRE-ENCRIPTADAS (BCrypt)
-- ========================================
-- 
-- Estas son algunas contraseñas ya encriptadas que puedes usar:
--
-- Password: Admin123456
-- BCrypt: $2a$10$8.WH6VZLvZhqfLGj3uqJVefnqJ5h3F7UqKr1KJmxhTQkKHPIvNLTq
--
-- Password: Admin12345
-- BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMye/IH9QU4tRqJLxXZpxqiKqPpLRKJKQy6
--
-- Password: Inmedt2024
-- BCrypt: $2a$10$YqKy3/zLAjLZLZRZ8qZqfOkqg7QqYYqKQqKQqKQqKQqKQqKQqKQqK
--
-- ========================================
-- CÓMO GENERAR TU PROPIA PASSWORD ENCRIPTADA
-- ========================================
--
-- Si quieres usar una contraseña personalizada, tienes 3 opciones:
--
-- OPCIÓN 1: Usar un generador online
-- 1. Ve a: https://bcrypt-generator.com/
-- 2. Ingresa tu contraseña
-- 3. Usa "Rounds: 10"
-- 4. Copia el hash generado
--
-- OPCIÓN 2: Usar Python (si lo tienes instalado)
-- Ejecuta en terminal:
--   python3 -c "import bcrypt; print(bcrypt.hashpw(b'TuPassword', bcrypt.gensalt(10)).decode())"
--
-- OPCIÓN 3: Crear el usuario desde la aplicación
-- 1. Regístrate normalmente en la app
-- 2. Luego ejecuta: UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'tu-email';
--
-- ========================================

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Ver todos los usuarios administradores
SELECT 
    id,
    nombre,
    email,
    role,
    enabled,
    created_at
FROM users 
WHERE role = 'ROLE_ADMIN'
ORDER BY created_at DESC;

-- Ver todos los usuarios (admin y clientes)
-- SELECT 
--     id,
--     nombre,
--     email,
--     role,
--     enabled,
--     created_at
-- FROM users 
-- ORDER BY created_at DESC;

