-- Script de inicialización para Supabase
-- =====================================================

-- Crear tabla de datos
CREATE TABLE IF NOT EXISTS datos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    valor INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_datos_nombre ON datos(nombre);
CREATE INDEX IF NOT EXISTS idx_datos_created_at ON datos(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE datos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública
CREATE POLICY "Permitir lectura pública" ON datos
    FOR SELECT
    USING (true);

-- Crear política para permitir inserciones públicas
CREATE POLICY "Permitir inserciones públicas" ON datos
    FOR INSERT
    WITH CHECK (true);

-- Crear política para permitir actualizaciones públicas
CREATE POLICY "Permitir actualizaciones públicas" ON datos
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Crear política para permitir eliminaciones públicas
CREATE POLICY "Permitir eliminaciones públicas" ON datos
    FOR DELETE
    USING (true);

-- Insertar datos de prueba
INSERT INTO datos (nombre, valor) VALUES 
    ('Ventas', 200),
    ('Clientes', 150),
    ('Productos', 75),
    ('Ingresos', 320),
    ('Pedidos', 185);

-- Verificar los datos
SELECT * FROM datos ORDER BY id;