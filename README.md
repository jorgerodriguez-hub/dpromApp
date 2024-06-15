# Aplicativo Móvil Espacio Público Saludable Juvenil

- Módulo de Registro Espacio Público Saludable de Juego
- Módulo de Edición Espacio Público Saludable de Juego
- Carga de imágenes al servidor.
- Geolocalización

El Aplicativo Móvil Espacio Público Saludable Juvenil está integrada con la plataforma web DPROM_JUVENIL, la cuál se encuentra desarrollada en Odoo con Base de Datos en PostgreSQL.


CLONE DPROM JUVENIL MOVIL
-------------------
git clone https://git.minsa.gob.pe/oidt/epsj_movil.git


Instalación
------------
*Para la siguiente instalación se asume que ya tiene instalado la versión mínima de node (v. 20.11) de no ser asi puedes seguir el siguiente instructivo (https://nodejs.org/en/)*


Requisitos del sistema operativo:
--------------------------------
- Node
- Android Studio
- Visual Studio Code


Instalación Nueva:
-----------------
1. Abrir el proyecto en Visual Studio Code.
2. Ejectuar `npm install` en el terminal (esto permitirá instalar todas las dependencias).
3. Ejecutar `npm start` en el terminal.
4. Abrir Android Studio y crear un dispotivo virtual (https://reactnative.dev/docs/set-up-your-environment).


Configuración básica del archivo .env
------------------------------------------
```
API_URL = https://dpromociondelasalud.minsa.gob.pe/jsonrpc
BADE_DE_DATOS = BD_DPROM_JUVENIL
TABLE_EPSJ = minsa.epsj
USUARIO = form.usuario
PASSWORD = form.password
```

Se están consumiendo los servicios de JSON RPC para integrar Odoo con React Native utilizando JSON como protocolo de comunicación.


Generar APK del Aplicativo Móvil
----------------------
1. Ejeucutar `npx react-native build-android --mode=release` en el terminal.

Se recomienda seguir la documentación (https://reactnative.dev/docs/signed-apk-android).
