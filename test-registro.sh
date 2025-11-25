#!/bin/bash

# Script para probar el endpoint de registro en producción

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Probando el endpoint de registro..."
echo ""

# URL del backend en Render
BACKEND_URL="https://inmedt.onrender.com/api"

# Datos de prueba
TEST_USER=$(cat <<EOF
{
  "nombre": "Usuario Test",
  "email": "test_$(date +%s)@ejemplo.com",
  "password": "Test123456",
  "rucCedula": ""
}
EOF
)

echo "📤 Enviando petición a: ${BACKEND_URL}/auth/register"
echo "📦 Datos: ${TEST_USER}"
echo ""

# Hacer la petición
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BACKEND_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "${TEST_USER}")

# Separar el body y el status code
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "📊 Respuesta HTTP: ${HTTP_CODE}"
echo ""

# Verificar el resultado
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ ¡Registro exitoso!${NC}"
    echo "📄 Respuesta:"
    echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"
elif [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${RED}❌ Error 400: Bad Request${NC}"
    echo "📄 Respuesta:"
    echo "$HTTP_BODY"
    echo ""
    echo -e "${YELLOW}Posibles causas:${NC}"
    echo "  - Validación de datos fallida"
    echo "  - Email o RUC/Cédula ya registrados"
    echo "  - Formato de email inválido"
elif [ "$HTTP_CODE" -eq 500 ]; then
    echo -e "${RED}❌ Error 500: Internal Server Error${NC}"
    echo "📄 Respuesta:"
    echo "$HTTP_BODY"
    echo ""
    echo -e "${YELLOW}Posibles causas:${NC}"
    echo "  - Error en la base de datos"
    echo "  - Problema con las variables de entorno"
    echo "  - Error en el código del backend"
else
    echo -e "${YELLOW}⚠️  Código HTTP inesperado: ${HTTP_CODE}${NC}"
    echo "📄 Respuesta:"
    echo "$HTTP_BODY"
fi

echo ""
echo "🔍 Para más detalles, revisa:"
echo "  - Logs de Render: https://dashboard.render.com"
echo "  - Variables de entorno en Render"
echo "  - Configuración de CORS"

