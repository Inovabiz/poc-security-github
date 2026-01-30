# API Simple con Express y Node.js

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Ejecutar en producción

```bash
npm start
```

## Endpoints disponibles

- `GET /` - Mensaje de bienvenida
- `GET /api/users` - Obtener lista de usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario

## Ejemplo de uso

### Obtener todos los usuarios
```bash
curl http://localhost:3000/api/users
```

### Crear un nuevo usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez","email":"juan@example.com"}'
```
