# Ecommerce de VideoJuegos Grupo 2 Back 1

Backend de un ecommerce de videojuegos que ofrece una plataforma para la gestión de usuarios y videojuegos. Los usuarios pueden registrarse y iniciar sesión con la opción de agregar una imagen de perfil, pueden editar sus datos personales, eliminar su cuenta, y todo de forma segura gracias al cifrado de contraseñas, ademas pueden guardar sus juegos preferidos en una lista de Favoritos.

Para los videojuegos, el sistema permite cargar títulos con detalles completos, como nombre, descripción, precio, plataformas, género, calificación, fecha de lanzamiento y imagen. Cada videojuego se puede editar, eliminar o actualizar fácilmente.

Funcion de carrito, los usuarios pueden comprar sus juegos en un carrito para luego ir a una pasarela de pago atravez de Mercado Pago, asi teniendo una compra rapido y segura.

Este backend incluye integraciones clave como:

MercadoPago: para gestionar pagos seguros.
WhatsApp: para notificaciones y comunicación.
Cloudinary: para manejar y almacenar imágenes de usuarios y videojuegos. Además, todas las contraseñas están cifradas para garantizar la seguridad de los usuarios.

## Índice

- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas API](#rutas-api)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Instalación

Sigue estos pasos para instalar el proyecto localmente:

1. Clona el repositorio:

    Coloca el siguiente comando en tu consola de preferencia ya sea CMD o la consola de visual code,

    git clone https://github.com/luumartinez/grupo2-back1.git

2. Ve al directorio del proyecto:

    cd nombre-del-repositorio

3. Instala las dependencias:

    Instala las dependencias necesarias para hacer funcionar el codigo.
    
    npm install

4. Crea un archivo `.env` en la carpeta raiz y ajusta las variables necesarias:

    NOTA: debera incluir los siguientes parametros, nosotros no proveemos de dichos datos

    MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/aqui_va_tu_base_de_datos
    JWT_SECRET=tu_secreto_jwt
    PORT=Tu_puerto_de_preferencia
    CLOUDINARY_API_KEY=tu_clave_cloudinary
    CLOUDINARY_SECRET=tu_secreto_cloudinary
    EMAIL_USER=tu_correo@example.com
    EMAIL_PASSWORD=tu_contraseña
    META_TEL_ID=tu_id_de_meta
    MP_ACCESS_TOKEN=Tu_token_de_mercado_pago
    

## Uso

Para iniciar el servidor, ejecuta el siguiente comando:

Coloca el siguiente comando en tu consola para iniciar el backend, puede demorar mas tiempo dependiendo de tu hardware.

npm start

## Tecnologías Utilizadas

Este proyecto fue construido utilizando las siguientes tecnologías:

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Express.js**: Framework web para Node.js que facilita el desarrollo de aplicaciones y APIs.
- **MongoDB**: Base de datos NoSQL que almacena datos en un formato flexible.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB, que permite modelar datos y realizar consultas de manera sencilla.
- **Electron**: Framework que permite construir aplicaciones de escritorio multiplataforma con tecnologías web.
- **dotenv**: Librería para cargar variables de entorno desde un archivo `.env`.
- **Nodemailer**: Módulo para enviar correos electrónicos desde aplicaciones Node.js.
- **Cloudinary**: Servicio de gestión de imágenes y videos en la nube.
- **Mercado Pago**: Plataforma de pagos online que facilita la integración de métodos de pago en la aplicación.

## Contribución

Las contribuciones son bienvenidas. Para contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m 'Agrega nueva funcionalidad'`).
4. Sube los cambios a tu fork (`git push origin nueva-funcionalidad`).
5. Abre un pull request para que podamos revisar tus cambios.

## Licencia

Este proyecto es un esfuerzo colaborativo entre compañeros y se encuentra bajo la licencia de uso público. Puedes utilizar, modificar y compartir el código, 
pero se recomienda dar crédito a los autores originales. 
