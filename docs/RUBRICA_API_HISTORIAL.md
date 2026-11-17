# Evidencia para API CRUD e historial de compras

## API de productos

La app usa `https://devsapihub.com/api-fast-food`.

| Operación | Método y ruta |
|---|---|
| Listar | `GET /api-fast-food` |
| Consultar uno | `GET /api-fast-food/:id` |
| Crear | `POST /api-fast-food/product` |
| Editar | `PUT /api-fast-food/product/:id` |
| Eliminar | `DELETE /api-fast-food/product/:id` |

Ejemplo de cuerpo JSON:

```json
{
  "name": "Pastel de prueba",
  "price": 25,
  "image": "https://example.com/pastel.jpg",
  "category": "pastel"
}
```

La API no ofrece un campo `description`; las descripciones que captura la app se conservan localmente en el navegador, asociadas al ID del producto.

La colección `postman/FastFoodAPI.postman_collection.json` puede importarse en Postman. Ejecuta las solicitudes en orden para crear, consultar, editar y eliminar el mismo producto de prueba. Estas solicitudes todavía deben ejecutarse en Postman para generar capturas/resultados de prueba.

## Historial de compras

Al confirmar una compra, la app guarda un arreglo de ventas en `localStorage` bajo la clave `rebanaditas.historial.v1`. Cada venta contiene ID, fecha ISO, artículos, estado, subtotal, IVA (16%) y total.

Ejemplo de un registro:

```json
{
  "id": "1763337600000",
  "fecha": "2026-11-16T20:00:00.000Z",
  "items": [
    {
      "productoId": 1,
      "nombre": "Pastel de prueba",
      "precioUnitario": 25,
      "cantidad": 2,
      "subtotal": 50
    }
  ],
  "subtotal": 50,
  "iva": 8,
  "total": 58,
  "estado": "pendiente",
  "metodoPago": "Efectivo"
}
```

El historial permite filtrar por fechas, ajustar cantidades/fecha/estado, recalcular subtotal, IVA y total, y eliminar un registro.
