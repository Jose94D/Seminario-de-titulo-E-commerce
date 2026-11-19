<p align="center">
  <img src="docs/banner.png" alt="Seminario de título: E-commerce con base de datos no relacional">
</p>

# Tunning Shop Linares

Tienda online para un local de tuning y accesorios automotrices de Linares, Chile. Los clientes navegan el catálogo, arman su carrito y pagan con **PayPal**; el dueño administra productos, pedidos y usuarios desde un **panel de administración** aparte.

Está hecha con el stack **MERN**: una API en **Express** sobre **MongoDB**, y dos aplicaciones **React** con **Redux** (la tienda y el panel).

> **Versión de tesis (2023), congelada.** Esta rama conserva el proyecto de **seminario de título** tal como se presentó en 2023, con lo mínimo para publicarlo (credenciales fuera del código y este README). No recibe cambios.
>
> **Versión nueva:** la versión 2, con optimizaciones, correcciones de seguridad y rediseño, está en la rama [`main`](../../tree/main).

## Capturas

Con los productos y cuentas de ejemplo del proyecto (por eso el catálogo muestra calzado).

<!-- Sin tabla: en una tabla GitHub ajusta cada columna al texto y las imágenes quedan de distinto tamaño. -->
<p align="center">
  <img src="docs/capturas/inicio.png" width="420" alt="Inicio con buscador, categorías y catálogo de productos">
  <img src="docs/capturas/producto.png" width="420" alt="Ficha de producto con precio, stock, valoración y botón para añadir al carro">
</p>
<p align="center">
  <img src="docs/capturas/carrito.png" width="420" alt="Carrito con dos productos y selector de cantidad">
  <img src="docs/capturas/confirmar_pedido.png" width="420" alt="Resumen del pedido antes de pagar: cliente, entrega, productos y total">
</p>
<p align="center">
  <img src="docs/capturas/pedido.png" width="420" alt="Pedido pagado y enviado, con los productos y el total">
  <img src="docs/capturas/perfil.png" width="420" alt="Perfil del cliente con RUT, teléfono y lista de compras">
</p>

* **Catálogo:** búsqueda por nombre y paginación de 12 productos.
* **Producto:** precio, stock, valoración y reseñas de los clientes.
* **Compra:** carrito, dirección de envío, método de pago, resumen y pago con PayPal.
* **Perfil:** datos del cliente (incluido RUT, teléfono y dirección) e historial de pedidos.
* **Local:** páginas de horario de atención, ubicación con Google Maps y sobre nosotros.

### Panel de administración

<p align="center">
  <img src="docs/capturas/admin_login.png" width="420" alt="Inicio de sesión del panel">
  <img src="docs/capturas/admin_resumen.png" width="420" alt="Resumen con ingresos, ventas y productos; los gráficos de MongoDB Charts quedan cargando sin el cluster original">
</p>
<p align="center">
  <img src="docs/capturas/admin_productos.png" width="420" alt="Listado de productos con botones para editar y eliminar">
  <img src="docs/capturas/admin_pedidos.png" width="420" alt="Ventas con estado de pago y de envío">
</p>
<p align="center">
  <img src="docs/capturas/admin_pedido.png" width="420" alt="Detalle de una venta con cliente, envío y productos">
  <img src="docs/capturas/admin_usuarios.png" width="420" alt="Usuarios registrados: administrador y cliente">
</p>

* **Acceso:** login solo para cuentas de administrador.
* **Resumen:** totales de ventas, pedidos y productos, últimos pedidos y gráficos embebidos de **MongoDB Charts** (dependían del cluster de Atlas original, que ya no existe, así que hoy quedan cargando).
* **Productos:** crear, editar y eliminar.
* **Pedidos:** listado, detalle y marcar como entregado.
* **Usuarios:** listado de clientes registrados.
* **Categorías:** solo maqueta visual, no está conectada a la API.

## Funciones

**Ya funcionan:**

* Registro e inicio de sesión con **JWT** y contraseñas cifradas con **bcrypt**.
* Carrito guardado en el navegador y flujo de compra en pasos.
* Pago con el botón de **PayPal** y registro del resultado en el pedido.
* Reseñas de productos con recálculo de la valoración promedio.
* Rutas privadas en la tienda y en el panel, y rutas de la API protegidas por usuario y por rol de administrador.
* Carga de datos de ejemplo (usuarios y productos) desde la API.

## Seguridad

Lo que tiene:

* Contraseñas con hash **bcrypt**; nunca se devuelven en las respuestas.
* Token **JWT** firmado con una clave del `.env`, exigido en las rutas privadas.
* Las rutas de administración exigen además `isAdmin`.
* Credenciales (MongoDB, PayPal, JWT, Google Maps) fuera del código, en archivos `.env`.

Problemas conocidos, que dejo documentados en vez de corregirlos para conservar el proyecto como se entregó:

* `POST /api/import/user` y `POST /api/import/products` no piden sesión y **reemplazan** usuarios y productos. Solo para uso local.
* `GET /api/orders/:id` no comprueba que el pedido sea del usuario que lo pide.
* El token se guarda en `localStorage` y CORS acepta cualquier origen.

## Tecnología

| Pieza | Elección |
| --- | --- |
| API | **Node.js**, **Express 4**, express-async-handler, morgan |
| Base de datos | **MongoDB Atlas** con **Mongoose 6** |
| Autenticación | **jsonwebtoken**, **bcryptjs** |
| Tienda | **React 17**, **Redux** + redux-thunk, React Router 5, axios |
| Panel admin | **React 17**, **Redux** + redux-thunk, React Router 5, axios |
| Pagos | react-paypal-button-v2 (PayPal) |
| Extras | Font Awesome, react-toastify, Google Maps, MongoDB Charts |

```text
 Cliente  ───► Tienda React  (:3000) ──┐
                                        ├──► API Express (:5000) ──► MongoDB Atlas
 Admin    ───► Panel React   (:4000) ──┘          │
                                                   └──► PayPal (client ID para el botón)
```

### Base de datos

```mermaid
erDiagram
    User ||--o{ Order : "hace"
    User ||--o{ Review : "escribe"
    Product ||--o{ Review : "tiene"
    Order ||--|{ OrderItem : "contiene"
    Product ||--o{ OrderItem : "aparece en"

    User {
        ObjectId _id PK
        string name
        string email UK
        string password "hash bcrypt"
        bool isAdmin
        string telefono
        string direccion
        string rut
    }
    Product {
        ObjectId _id PK
        string name
        string image
        string description
        number rating
        number numReviews
        number price
        number countInStock
    }
    Review {
        string name
        number rating
        string comment
        ObjectId user FK
    }
    Order {
        ObjectId _id PK
        ObjectId user FK
        object shippingAddress
        string paymentMethod
        object paymentResult
        number taxPrice
        number shippingPrice
        number totalPrice
        bool isPaid
        date paidAt
        bool isDelivered
        date deliveredAt
    }
    OrderItem {
        string name
        number qty
        string image
        number price
        ObjectId product FK
    }
```

## Ejecutar

Requisitos: Node.js y una base MongoDB (local o Atlas). El proyecto se hizo con Node 16 y en 2026 se volvió a levantar con Node 26. Con versiones nuevas de Node, `npm start` de las apps React puede fallar con `options.allowedHosts[0] should be a non-empty string`, un error conocido de `react-scripts` 5 con la opción `proxy`; en ese caso se pueden compilar con `npm run build` y servir la carpeta `build/`.

API:

```bash
cd server
npm install
copy .env.example .env
npm run server
```

`server/.env`:

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto de la API. Las apps React esperan `5000`. |
| `NODE_ENV` | `development` o `production`. |
| `JWT_SECRET` | Firma los tokens. Usa una cadena larga y aleatoria. |
| `PAYPAL_CLIENT_ID` | Client ID de una app PayPal (sandbox para pruebas). |
| `MONGO_URL` | Cadena de conexión de MongoDB. |

Con la API corriendo, carga los datos de ejemplo (borra los existentes):

```bash
curl -X POST http://localhost:5000/api/import/user
curl -X POST http://localhost:5000/api/import/products
```

Quedan dos cuentas de prueba, `admin@example.com` (administrador) y `user@example.com`, ambas con la contraseña `password`.

Tienda (en otra terminal, abre `http://localhost:3000`):

```bash
cd "client frontend"
npm install
copy .env.example .env
npm start
```

`client frontend/.env` necesita `REACT_APP_GOOGLE_MAPS_KEY` para la página de ubicación.

Panel de administración (abre `http://localhost:4000`):

```bash
cd dashboard
npm install
npm start
```

## Estructura

```text
├── server/                 API Express
│   ├── config/             conexión a MongoDB
│   ├── Models/             User, Product, Order
│   ├── Routes/             /api/users, /api/products, /api/orders
│   ├── Middleware/         protect, admin y manejo de errores
│   ├── data/               usuarios y productos de ejemplo
│   └── DataImport.js       rutas /api/import
├── client frontend/        tienda (React + Redux)
│   └── src/
│       ├── screens/        páginas: inicio, producto, carrito, pago, perfil…
│       ├── components/     header, footer, paginación, reseñas
│       └── Redux/          actions, reducers, constants y store
├── dashboard/              panel de administración (React + Redux)
│   └── src/
│       ├── screens/        resumen, productos, pedidos, usuarios
│       ├── components/
│       └── Redux/
└── Informe de seminario.docx
```

## Nota de uso

Proyecto académico. Los productos y las cuentas son datos de ejemplo, y para probar los pagos conviene usar una app PayPal en modo sandbox. El informe completo del seminario está en `Informe de seminario.docx`.

## Licencia

La información sobre la licencia y las condiciones de uso se incorporará más adelante.
