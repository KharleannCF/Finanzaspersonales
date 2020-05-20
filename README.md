# Finanzas Personales


### Prerrequisitos
  
  ```
  - Yarn
  - Node.js
  - MySQL
  ```

### Instalación de dependencias
Para ejecutar el proyecto es necesario instalar las dependencias para esto es necesario utilizar el comando:
 ```
 yarn add package.json
 ```
 (Es necesario tener yarn para el funcionamiento del proyecto)
 
 Situado en la carpeta principal del proyecto
 
 ### MySQL
 El proyecto fue realizado utilizando MySQL como base de datos, por lo tanto es necesario tener un servidor de MySQL
 para garantizar su funcionamiento, para esto es posible usar XAMPP (En este caso activar también el servidor apache) o MySQL
 
 En el archivo *credentials.js* cambiar los datos por los correspondientes a la computadora donde se prueben
 Es necesario el que el usuario tenga permisos de administrador en el servidor de MySQL (se recomienda el usuario root) pues esté creará una nueva
 base de datos con sus respectivas tablas a medida que se avance en la aplicación.
 
 ### EndPoints
 
  - localhost:8080/users
    - Registro de un nuevo usuario
  - localhost:8080/users/login
    - ingreso al sistema con una cuenta
  - localhost:8080/app (para acceder a este punto es necesario haber ingresado al sistema con una cuenta de usuario)
    - Menú principal
  - localhost:8080/app/admin/:option (es necesario que la cuenta tenga permisos de administrador)
    - Lista con los elementos (que se encuentren en la base de datos) correspondientes a la opción enviada en el URL, los enlaces a estas opciones son visibles en el menú principal si se poseen permisos de administrador
  - localhost:8080/app/categorias/:id/edit
    - Ventana de edición de una categoría
  - localhost:8080/app/categorias
    - Lista de todas las categorías a las que el usuario tiene acceso
  - localhost:8080/app/cliente/:id/edit
    - Ventana de edición de un cliente
  - localhost:8080/app/perfil
    - Ventana de edición del perfil del usuario actual
  - localhost:8080/app/gastos/:transaccion
    - Ventana de registro de un nuevo campo del tipo de la transacción (ingresos o gastos)
  - localhost:8080/app/gastos/:transaccion/listado
    - Lista con las distintas transacciones realizadas del tipo de *:/transaccion*
  - localhost:8080/app/gastos/:transaccion/:id
    - Información detallada de la transacción correspondiente al id enviado por el URL
  - localhost:8080/app/gastos/:transaccion/:id/edit
    - Ventana de edición de la transacción correspondiente al id enviado por el URL
  - localhost:8080/app/reportes
    - Lista de los reportes posibles
  - localhost:8080/app/reportes/catXmes
    - Lista de los meses para generar el reporte
  - localhost:8080/app/reportes/gasXmes
    - Lista de los meses para generar el reporte
    
  - Nota Algunos de los endpoints dependen del método con el cual se acceda a ellos para esto se tienen distintos formularios entro los que estan la eliminacion o edicion de campos
    
  
  
    
  
  

 
 
 
 
 
