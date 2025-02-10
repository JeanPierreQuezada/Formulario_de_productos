CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    bodega INT NOT NULL,
    sucursal INT NOT NULL,
    moneda INT NOT NULL,
    material TEXT NOT NULL,
    descripcion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    bodega_id INT NOT NULL REFERENCES bodegas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS monedas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL
);

INSERT INTO bodegas (nombre) VALUES 
('Bodega Central'),
('Bodega Norte'),
('Bodega Sur'),
('Bodega Este'),
('Bodega Oeste');

INSERT INTO sucursales (nombre, bodega_id) VALUES 
('Sucursal A - Central', 1),
('Sucursal B - Central', 1),
('Sucursal C - Norte', 2),
('Sucursal D - Norte', 2),
('Sucursal E - Sur', 3),
('Sucursal F - Este', 4),
('Sucursal G - Oeste', 5);

INSERT INTO monedas (nombre) VALUES 
('PEN'),
('USD'),
('EUR'),
('GBP'),
('JPY');

INSERT INTO productos (codigo, nombre, precio, bodega, sucursal, moneda, material, descripcion) VALUES 
('PRD001', 'Laptop Gamer', 4500.00, 1, 1, 2,'Plastico, Metal, Vidrio', 'Laptop de alto rendimiento con procesador i7 y 16GB RAM.'),
('PRD002', 'Smartphone Pro', 3200.50, 2, 3, 2,'Metal, Madera', 'Teléfono inteligente con pantalla OLED y 128GB de almacenamiento.'),
('PRD003', 'Auriculares Bluetooth', 250.99, 3, 5, 1,'Plastico, Vidrio, Textil', 'Auriculares inalámbricos con cancelación de ruido activa.'),
('PRD004', 'Smart TV 55"', 2800.75, 4, 6, 2,'Textil, Madera', 'Televisor inteligente 4K con HDR y sistema operativo Android TV.'),
('PRD005', 'Consola de Videojuegos', 2100.00, 5, 7, 3,'Plastico, Madera', 'Consola de última generación con mando inalámbrico.'),
('PRD006', 'Mouse Gamer RGB', 180.50, 1, 2, 1,'Metal, Textil', 'Mouse ergonómico con sensor óptico de alta precisión y luces RGB personalizables.'),
('PRD007', 'Teclado Mecánico', 350.00, 2, 4, 2,'Plastico, Vidrio, Madera', 'Teclado mecánico con switches táctiles y retroiluminación RGB.'),
('PRD008', 'Cámara Fotográfica', 4800.00, 3, 5, 2,'Metal, Textil, Madera', 'Cámara profesional con lente intercambiable y sensor de 24MP.'),
('PRD009', 'Reloj Inteligente', 890.75, 4, 6, 1,'Vidrio, Textil, Madera', 'Smartwatch con monitoreo de salud y GPS integrado.'),
('PRD010', 'Monitor 27" LED', 1600.00, 5, 7, 3,'Vidrio, Madera', 'Monitor Full HD con tasa de refresco de 144Hz y tecnología FreeSync.');