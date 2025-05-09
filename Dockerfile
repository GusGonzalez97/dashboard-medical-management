# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Definimos los ARGs que vamos a usar en build-time
ARG NEXT_PUBLIC_CLIENT_NAME
ARG NEXT_PUBLIC_DOCTOR_ID
ARG NEXT_PUBLIC_GATEWAY_URL

# Las hacemos accesibles para el build
ENV NEXT_PUBLIC_CLIENT_NAME=$NEXT_PUBLIC_CLIENT_NAME
ENV NEXT_PUBLIC_DOCTOR_ID=$NEXT_PUBLIC_DOCTOR_ID
ENV NEXT_PUBLIC_GATEWAY_URL=$NEXT_PUBLIC_GATEWAY_URL

# Instalamos dependencias
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiamos el resto de los archivos
COPY . .

# Construimos la app
RUN yarn build

# Etapa 2: Producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copiamos solo lo necesario para correr la app
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["yarn", "start"]
