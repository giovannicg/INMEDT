-- Script para agregar el campo IVA a la tabla pedidos
-- IVA en Ecuador: 15% sobre el subtotal de productos (NO incluye envío)

-- Agregar columna IVA
ALTER TABLE pedidos 
ADD COLUMN iva DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- Actualizar pedidos existentes para calcular el IVA
-- IVA = subtotal * 0.15 (solo sobre productos, NO sobre envío)
UPDATE pedidos 
SET iva = ROUND(subtotal * 0.15, 2);

-- Actualizar el total de pedidos existentes para incluir IVA
-- Total = subtotal + IVA + costo_envio
UPDATE pedidos 
SET total = subtotal + iva + costo_envio;

-- Verificar los cambios
SELECT 
    id, 
    subtotal, 
    costo_envio, 
    iva, 
    total, 
    (subtotal + costo_envio + iva) as total_calculado
FROM pedidos 
LIMIT 10;

