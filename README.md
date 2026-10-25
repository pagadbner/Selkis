# Selkies Cloud Desktop — panel web

Proyecto para ejecutar Selkies en GitHub Codespaces con una página web que permite **iniciar, detener y consultar el estado** del escritorio desde Android. La idea es que, después de la configuración inicial, no tengas que escribir comandos para controlar Selkies.

> **Límite de hardware:** Codespaces no ofrece una GPU dedicada para gaming. El panel puede controlar el escritorio, pero no convierte Codespaces en una VM gaming. GTA V, Fortnite y Minecraft con shaders requieren una máquina con GPU compatible y un entorno compatible con cada juego.

## Archivos

```text
selkies-cloud-desktop-web/
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
```

## Configuración inicial (solo una vez)

1. Crea un repositorio en https://github.com/new, por ejemplo `selkies-cloud-desktop`.
2. Sube todos los archivos del ZIP a la raíz del repositorio. Conserva la carpeta `.devcontainer`.
3. Abre https://github.com/settings/codespaces.
4. En **Codespaces secrets**, crea el secreto `SELKIES_PASSWORD`. Usa una contraseña larga y única que puedas recordar; el panel te la pedirá para iniciar sesión. Autoriza el secreto para este repositorio.
5. Abre el repositorio → **Code → Codespaces → Create codespace on main**.
6. Espera a que el Codespace termine de configurarse. El panel web se inicia automáticamente en el arranque del Codespace.
7. En la pestaña **Ports**, abre el puerto **8090**, etiquetado **Panel Selkies**. Si no se abre solo, pulsa el icono de abrir en el navegador.
8. Introduce la misma contraseña que guardaste como `SELKIES_PASSWORD`.

## Uso diario desde Android

En el panel web:

- **Iniciar escritorio:** descarga (si hace falta) la imagen y arranca Selkies.
- **Detener escritorio:** detiene y elimina el contenedor, conservando la configuración del proyecto.
- **Actualizar estado:** consulta el estado de Docker.
- **Abrir escritorio:** abre el puerto 8080 de Selkies.

No necesitas ejecutar `./scripts/start.sh` o `./scripts/stop.sh` en el uso normal. Esos scripts se mantienen como alternativa de diagnóstico.

### Si el panel no aparece

1. Comprueba que el Codespace esté encendido.
2. En VS Code abre **Ports** y busca `8090`.
3. Si el panel no está, abre una terminal y ejecuta una sola vez:

```bash
node control-panel/server.js
```

4. Revisa los registros si el proceso falla:

```bash
cat /tmp/selkies-control-panel.log
```

Si editaste `devcontainer.json`, usa **Codespaces: Rebuild Container** en la paleta de comandos. Si vuelve a aparecer *recovery mode*, abre **Ver registro de creación** y corrige el primer error del registro antes de intentarlo otra vez.

## Seguridad

- La API del panel requiere autenticación con `SELKIES_PASSWORD`.
- No escribas la contraseña en el repositorio ni en el README.
- Mantén el puerto 8090 como **Private** en Codespaces; no lo publiques.
- No compartas las URL del Codespace con personas no autorizadas.
- La contraseña se introduce en el navegador y se mantiene solo en memoria de la página mientras el panel está abierto.
- El servicio de control puede iniciar y detener contenedores Docker, por lo que debes mantener el acceso al panel privado.
- Si la contraseña se filtra, cámbiala en Codespaces Secrets y reinicia el entorno.

## Notas técnicas y limitaciones

- El panel Node.js se ejecuta dentro del Codespace y llama a `docker compose`.
- Puerto 8090: panel de control.
- Puerto 8080: escritorio Selkies.
- El `docker-compose.yml` utiliza la imagen `ghcr.io/selkies-project/selkies/desktop:latest-ubuntu26.04`, como se declara en `docker-compose.yml`. Si el proyecto oficial cambia el nombre de la imagen, la etiqueta o las variables admitidas, consulta la documentación oficial y actualiza el archivo antes de ejecutar.
- La imagen `mcr.microsoft.com/devcontainers/universal:2` incluye herramientas habituales de desarrollo y la integración Docker para Codespaces. Si Docker no está disponible después de reconstruir el contenedor, revisa el registro de creación del Codespace; el panel no puede iniciar contenedores si el daemon no funciona.
- Para uso gaming, migra a una VM Linux con GPU y configura los controladores y el acceso GPU según la documentación de Selkies. El panel por sí solo no añade GPU.

## Enlaces oficiales

- Selkies: https://github.com/selkies-project
- Documentación de Selkies: https://docs.selkies.io/start/
- GitHub Codespaces: https://docs.github.com/en/codespaces
