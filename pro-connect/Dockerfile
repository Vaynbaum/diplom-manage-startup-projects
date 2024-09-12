FROM node:18.15.0 as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN rm /usr/src/app/node_modules/ngx-photo-editor/photo-editor.css
COPY ./photo-editor.css /usr/src/app/node_modules/ngx-photo-editor
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/pro-connect/browser /usr/share/nginx/html
EXPOSE 4200
