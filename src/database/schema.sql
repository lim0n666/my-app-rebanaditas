
CREATE DATABASE IF NOT EXISTS rebanaditas CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE rebanaditas;

CREATE TABLE usuario (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_usuario_correo UNIQUE (correo)
) ENGINE=InnoDB;

CREATE TABLE producto (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(160) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  sabor VARCHAR(80) NOT NULL,
  descripcion TEXT NULL,
  imagen_url VARCHAR(2048) NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_producto_precio CHECK (precio > 0),
  INDEX ix_producto_categoria (categoria),
  INDEX ix_producto_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE venta (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente','pagada','fallida','cancelada') NOT NULL DEFAULT 'pendiente',
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(40) NULL,
  proveedor_pago_id VARCHAR(160) NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  CONSTRAINT chk_venta_importes CHECK (subtotal >= 0 AND iva >= 0 AND total = subtotal + iva),
  INDEX ix_venta_usuario_fecha (usuario_id, fecha),
  INDEX ix_venta_estado_fecha (estado, fecha)
) ENGINE=InnoDB;

CREATE TABLE detalle_venta (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  venta_id BIGINT UNSIGNED NOT NULL,
  producto_id BIGINT UNSIGNED NOT NULL,
  nombre_producto VARCHAR(160) NOT NULL, -- snapshot histórico del nombre
  precio_unitario DECIMAL(10,2) NOT NULL, -- snapshot histórico del precio
  cantidad INT UNSIGNED NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (precio_unitario * cantidad) STORED,
  PRIMARY KEY (id),
  CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES venta(id) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES producto(id),
  CONSTRAINT chk_detalle_precio CHECK (precio_unitario > 0),
  CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT uq_venta_producto UNIQUE (venta_id, producto_id),
  INDEX ix_detalle_producto (producto_id)
) ENGINE=InnoDB;

-- Semilla demostrativa para consultas y relaciones.
-- Este usuario NO puede iniciar sesión: el valor de password_hash es solo marcador.
INSERT INTO usuario (id, nombre, correo, password_hash, rol) VALUES
(1, 'Cliente de demostración', 'cliente.demo@example.invalid', 'NO_ES_UN_HASH_NO_USAR_PARA_LOGIN', 'cliente');

INSERT INTO producto (id, nombre, precio, categoria, sabor, descripcion, imagen_url) VALUES
(1, 'Pay de limón', 40.00, 'Pays', 'Limón', 'Pay frío de limón.', NULL),
(2, 'Pastel de chocolate', 45.00, 'Pasteles', 'Chocolate', 'Rebanada de pastel de chocolate.', NULL);

INSERT INTO venta (id, usuario_id, subtotal, iva, total, estado, metodo_pago) VALUES
(1, 1, 85.00, 0.00, 85.00, 'pagada', 'efectivo');

INSERT INTO detalle_venta (id, venta_id, producto_id, nombre_producto, precio_unitario, cantidad) VALUES
(1, 1, 1, 'Pay de limón', 40.00, 1),
(2, 1, 2, 'Pastel de chocolate', 45.00, 1);

-- Consultas rápidas para comprobar la semilla y sus relaciones.
SELECT v.id, u.nombre, v.fecha, v.subtotal, v.iva, v.total, v.estado
FROM venta v JOIN usuario u ON u.id = v.usuario_id;

SELECT dv.venta_id, dv.nombre_producto, dv.precio_unitario, dv.cantidad, dv.subtotal
FROM detalle_venta dv ORDER BY dv.venta_id, dv.id;

-- Recreación completa (¡borra datos! ejecutar solo en desarrollo):
-- DROP TABLE IF EXISTS detalle_venta;
-- DROP TABLE IF EXISTS venta;
-- DROP TABLE IF EXISTS producto;
-- DROP TABLE IF EXISTS usuario;

