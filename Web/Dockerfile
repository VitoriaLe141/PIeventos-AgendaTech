FROM node:24-alpine AS build

WORKDIR /app
# Declara o argumento que vem do docker-compose
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx vite build

FROM nginx:alpine

# Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
