-- ============================================================
-- Datos iniciales — Cabañas y salones
-- Ejecutar después de schema.sql
-- ============================================================

INSERT INTO cabin (name, type, capacity, rooms, pool, high_season_price, low_season_price, sector, "order", is_active) VALUES
('Boldo', 'cabaña', '6 personas', '2 dormitorios', 'Piscina compartida', 110000, 90000, 'Sector Bosque Nativo', 1, true),
('Capilla', 'cabaña', '2–3 personas', '1 dormitorio', 'Piscina propia', 95000, 75000, 'Espacio Central', 2, true),
('Casa Arrayán', 'cabaña', '8 personas', '3 dormitorios', 'Piscina propia', 140000, 120000, 'Sector Bosque Nativo', 3, true),
('Casa de Barro', 'cabaña', '10 personas', '4 dormitorios', 'Piscina propia', 150000, 130000, 'Sector Bosque Nativo', 4, true),
('Casa del Cerro', 'cabaña', '4 personas', '1 dormitorio', 'Piscina propia', 100000, 80000, 'Area De Acceso', 5, true),
('Chincol', 'cabaña', '2 personas', '1 ambiente', 'Piscina compartida', 85000, 65000, 'Area De Acceso', 6, true),
('Colibrí', 'cabaña', '4 personas', '1 ambiente', 'Piscina compartida', 95000, 85000, 'Area De Acceso', 7, true),
('Ecológica', 'cabaña', '8 personas', '3 dormitorios', 'Piscina propia', 140000, 120000, 'Sector Bosque Nativo', 8, true),
('Honey Moon', 'cabaña', '8 personas', '3 dormitorios', 'Piscina propia', 140000, 120000, 'Sector Bosque Nativo', 9, true),
('Iglesia 1', 'cabaña', '6–7 personas', '2 dormitorios', 'Piscina compartida', 110000, 90000, 'Espacio Central', 10, true),
('Iglesia 2', 'cabaña', '6–7 personas', '2 dormitorios', 'Piscina compartida', 110000, 90000, 'Espacio Central', 11, true),
('Loica', 'cabaña', '6 personas', '2 dormitorios', 'Piscina compartida', 110000, 100000, 'Espacio Central', 12, true),
('Monasterio', 'cabaña', '9 personas', '3 dormitorios', 'Piscina propia', 140000, 120000, 'Sector Bosque Nativo', 13, true),
('Naranjal 1', 'cabaña', '4 personas', '2 dormitorios', 'Piscina propia', 105000, 85000, 'Sector Bosque Nativo', 14, true),
('Naranjal 2', 'cabaña', '4 personas', '2 dormitorios', 'Piscina propia', 100000, 80000, 'Sector Bosque Nativo', 15, true),
('Orgánica', 'cabaña', '6–7 personas', '2 dormitorios', 'Piscina compartida', 110000, 90000, 'Espacio Central', 16, true),
('Salón Darwin', 'salón', 'Hasta 120 personas', 'Salón principal', 'No aplica', NULL, NULL, 'Espacio Central', 17, true),
('Quincho Club House', 'salón', 'Hasta 40 personas', 'Quincho con cancha de futbolito', 'Piscina de nado', NULL, NULL, 'Espacio Central', 18, true),
('Campanario', 'salón', 'Hasta 60 personas', 'Salón multiuso', 'No aplica', NULL, NULL, 'Espacio Central', 19, true),
('Salón Orgánico', 'salón', 'Hasta 50 personas', 'Salón multiuso', 'No aplica', NULL, NULL, 'Espacio Central', 20, true);

-- Nota: las imágenes se actualizan por separado desde el panel admin
-- o con el script de migración de imágenes a R2.