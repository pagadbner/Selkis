Selkies Cloud Desktop

<p align="center">
  <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/monitor.svg" width="64" height="64" alt="Icono de escritorio remoto"/>
</p><p align="center">
  <strong>Escritorio remoto en GitHub Codespaces</strong>
  <br/>
  Control del escritorio Selkies desde el navegador mediante un panel web.
</p><p align="center">
  <img src="https://img.shields.io/badge/Plataforma-GitHub%20Codespaces-24292f?style=flat-square&logo=github" alt="Plataforma GitHub Codespaces"/>
  <img src="https://img.shields.io/badge/Contenedores-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Interfaz-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js"/>
</p>---

Descripción

Selkies Cloud Desktop permite ejecutar un escritorio remoto Selkies dentro de GitHub Codespaces y administrarlo mediante un panel web accesible desde un navegador, incluido Android.

El panel permite iniciar y detener el escritorio, consultar su estado y abrir la interfaz remota sin tener que ejecutar manualmente los comandos de Docker en cada operación.

Funciones

- Control del escritorio: iniciar, detener y consultar el estado del servicio.
- Acceso remoto: abrir Selkies desde el navegador mediante el puerto "8080".
- Panel web: administrar el servicio desde el puerto "8090".
- Ejecución en contenedor: utilizar Docker para gestionar el escritorio.
- Acceso protegido: autenticar el acceso con una contraseña configurada fuera del repositorio.

Estructura del proyecto

Selkis/
├── .devcontainer/
│   ├── devcontainer.json
│   ├── post-create.sh
│   └── start-control-panel.sh
├── control-panel/
│   ├── index.html
│   └── server.js
├── scripts/
│   ├── start.sh
│   ├── stop.sh
│   └── status.sh
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md

Requisitos

- Una cuenta de GitHub con acceso a Codespaces.
- Docker y Docker Compose disponibles y operativos dentro del entorno.
- Node.js para ejecutar el panel web.
- Una contraseña configurada mediante los secretos de Codespaces.
- Puertos "8080" y "8090" disponibles para su reenvío.

La configuración de ".devcontainer/devcontainer.json" determina la imagen y las herramientas instaladas al crear el entorno. Si modificas esa configuración, puede ser necesario reconstruir el Codespace.

Instalación y configuración

1. Crear el Codespace

1. Sube el proyecto al repositorio de GitHub, conservando la estructura de archivos y la carpeta ".devcontainer".
2. Abre el repositorio y entra en Code → Codespaces.
3. Crea un Codespace desde la rama que contiene el proyecto.
4. Espera a que finalice la configuración inicial.

2. Configurar la contraseña

Abre la configuración de "GitHub Codespaces" (https://github.com/settings/codespaces) y crea un secreto llamado:

SELKIES_PASSWORD

Asigna una contraseña larga y única, y autoriza su uso en el repositorio correspondiente.

El archivo "docker-compose.yml" utiliza esta variable para configurar la autenticación de Selkies y la contraseña del usuario del escritorio. No introduzcas la contraseña directamente en el código ni la subas al repositorio.

También puedes definir "SELKIES_USER" para cambiar el nombre de usuario de autenticación del servicio. Si no se define, la configuración actual utiliza "ubuntu".

3. Comprobar el entorno

Desde la terminal del Codespace:

node --version
docker --version
docker compose version
docker info

Los comandos deben ejecutarse sin errores. Si "docker info" no puede comunicarse con el servidor, el panel no podrá iniciar el escritorio hasta que Docker vuelva a estar operativo.

4. Iniciar el proyecto

El panel está configurado para iniciarse durante el arranque del Codespace. Si necesitas iniciarlo manualmente:

node control-panel/server.js

Para administrar el escritorio desde la terminal, utiliza los scripts incluidos en "scripts/".

Uso diario

Desde el panel web

En la pestaña Ports de Visual Studio Code, localiza el puerto "8090" y abre su dirección en el navegador.

Desde el panel puedes utilizar las funciones que estén implementadas en la versión instalada:

- Iniciar el escritorio Selkies.
- Detener el escritorio.
- Consultar su estado.
- Abrir la interfaz remota.

El puerto "8080" corresponde al escritorio Selkies. El puerto "8090" corresponde al panel de control.

Desde la terminal

Ejecuta los comandos desde la raíz del repositorio.

Acción| Comando
Iniciar el escritorio| "bash scripts/start.sh"
Detener el escritorio| "bash scripts/stop.sh"
Consultar el estado| "bash scripts/status.sh"
Ver los contenedores| "docker compose ps"
Consultar registros| "docker compose logs --tail=100 selkies"
Reiniciar el contenedor| "docker compose restart selkies"
Recrear el contenedor| "docker compose up -d --force-recreate"

Los scripts son la forma recomendada de iniciar y detener el escritorio desde la terminal. El reinicio y la recreación directa con Docker Compose son operaciones alternativas para mantenimiento y diagnóstico.

Antes de recrear el contenedor, asegúrate de que "SELKIES_PASSWORD" esté disponible en el entorno de ejecución.

Configuración de Docker Compose

El servicio Selkies se define en "docker-compose.yml".

Parámetro| Función
"image"| Imagen de Selkies utilizada para crear el escritorio.
"container_name"| Nombre asignado al contenedor: "selkies-desktop".
"restart"| Política de reinicio del contenedor.
"shm_size"| Memoria compartida asignada al contenedor.
"ports"| Publicación del puerto "8080".
"SELKIES_ENABLE_HTTPS"| Desactiva HTTPS dentro del contenedor, ya que Codespaces termina la conexión HTTPS en su proxy.
"SELKIES_ENABLE_BASIC_AUTH"| Habilita la autenticación básica de Selkies.
"SELKIES_BASIC_AUTH_USER"| Usuario para la autenticación web.
"SELKIES_BASIC_AUTH_PASSWORD"| Contraseña de acceso a Selkies.
"PASSWD"| Contraseña del usuario del escritorio, según la configuración de la imagen.
"security_opt"| Ajustes de seguridad aplicados al contenedor.

La imagen utilizada actualmente es:

ghcr.io/selkies-project/selkies/desktop:latest-ubuntu26.04

Si el proyecto oficial cambia la imagen, sus etiquetas o las variables admitidas, revisa la documentación oficial antes de actualizar la configuración.

Consideración sobre "seccomp"

Si el archivo contiene:

security_opt:
  - seccomp=unconfined

Docker ejecutará el contenedor sin su perfil seccomp predeterminado. Esta opción puede servir para diagnosticar ciertos errores de permisos de llamadas al sistema, pero reduce el aislamiento del contenedor.

No la añadas ni la mantengas sin necesidad. Si una aplicación falla con "Operation not permitted", comprueba primero los registros y determina qué operación está bloqueada.

Seguridad

- Mantén el puerto "8090" en modo Private en Codespaces.
- No publiques "SELKIES_PASSWORD" ni otros secretos en archivos, registros o capturas.
- No compartas las direcciones privadas del Codespace con personas no autorizadas.
- Mantén el panel actualizado y limita su acceso a usuarios de confianza.
- Ten en cuenta que el panel puede ejecutar operaciones de Docker con permisos importantes sobre el entorno.
- Si una contraseña se ve comprometida, cámbiala y reinicia los servicios afectados.

La autenticación de Selkies y la del panel son mecanismos distintos. Comprueba que ambos estén protegidos según la implementación actual del proyecto.

Limitaciones

Recursos de GitHub Codespaces

Codespaces es un entorno de desarrollo en la nube, no una máquina dedicada a juegos. Los recursos disponibles dependen de la configuración y los límites de la cuenta.

- No se garantiza la disponibilidad de una GPU dedicada.
- El rendimiento gráfico depende de los recursos asignados y de la configuración de Selkies.
- Los juegos y aplicaciones que requieren aceleración gráfica pueden no funcionar correctamente.
- Los límites de CPU, memoria, almacenamiento y uso de Codespaces siguen siendo aplicables.

Persistencia y disponibilidad

El escritorio se ejecuta dentro de un contenedor Docker. Su ciclo de vida depende del Codespace y de la configuración del contenedor.

- Codespaces puede detenerse por inactividad, límites de uso o acciones del usuario.
- "restart: unless-stopped" no mantiene activo un Codespace que GitHub haya detenido.
- Los datos guardados dentro del sistema de archivos del contenedor pueden perderse al eliminar o recrear el contenedor.
- Los archivos del repositorio y los datos del contenedor tienen ciclos de vida diferentes.
- Este proyecto no garantiza disponibilidad permanente ni sustituye un servidor dedicado.

Guarda los archivos importantes en una ubicación persistente antes de detener o recrear el entorno.

Solución de problemas

El panel web no aparece

Comprueba que el Codespace esté encendido y busca el puerto "8090" en la pestaña Ports.

Si el proceso no está iniciado:

node control-panel/server.js

Para revisar el registro del panel, si existe:

cat /tmp/selkies-control-panel.log

Docker no puede iniciar el escritorio

Comprueba el servicio y sus registros:

docker info
docker compose ps
docker compose logs --tail=100 selkies

Si la configuración requiere "SELKIES_PASSWORD", verifica que la variable esté disponible en el entorno desde el que se ejecuta Docker Compose.

Error "Operation not permitted"

El error puede proceder de restricciones del contenedor, permisos del sistema o una operación no permitida por el entorno.

Revisa los registros de Selkies y de la aplicación afectada. Si utilizas "seccomp=unconfined" como prueba, recuerda que reduce el aislamiento de seguridad y no garantiza resolver todas las causas de este error.

El escritorio no está disponible después de cerrar Codespaces

Vuelve a abrir el Codespace y comprueba el estado del contenedor:

docker compose ps

Si el contenedor está detenido, utiliza:

bash scripts/start.sh

Si el Codespace se ha detenido, primero debes reanudarlo desde GitHub.

Documentación

- "Repositorio de Selkies" (https://github.com/selkies-project)
- "Documentación oficial de Selkies" (https://docs.selkies.io/start/)
- "Documentación de GitHub Codespaces" (https://docs.github.com/en/codespaces)
- "Documentación de Docker Compose" (https://docs.docker.com/compose/)

---

<p align="center">
  <sub>Selkies Cloud Desktop · Proyecto comunitario para gestionar un escritorio remoto desde GitHub Codespaces.</sub>
</p>
