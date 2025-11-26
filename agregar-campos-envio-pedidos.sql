-- Script SQL para agregar campos de costo de envío a la tabla pedidos
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna subtotal (requerida)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- 2. Agregar columna costo_envio (requerida, por defecto 0)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- 3. Actualizar pedidos existentes
-- Establecer el subtotal igual al total actual y costo_envio en 0
UPDATE pedidos 
SET subtotal = total, 
    costo_envio = 0.00
WHERE subtotal = 0.00;

-- 4. Verificar que los datos se actualizaron correctamente
SELECT id, numero_pedido, subtotal, costo_envio, total, created_at
FROM pedidos
ORDER BY created_at DESC
LIMIT 10;

-- Nota: Los nuevos pedidos calcularán automáticamente el costo de envío
-- basado en el sector y monto del pedido:
-- - Envío GRATIS si el subtotal >= $40
-- - $2.99 para sectores dentro del Distrito Metropolitano de Quito
-- - $3.99 para sectores fuera de Quito

