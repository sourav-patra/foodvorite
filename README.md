# foodvorite

A food ordering app created using vanilla JS, HTML5, and CSS

## Install

Run `npm install` to install the required dependencies for the project

## Run server

There are 2 ways we can run the server:

### webpack-dev-server

- Use `npm run serve:webpack` that uses `webpack.dev.config` to bundle all required files and fire up the dev server. Make sure the file index.js has imported the scss files, otherwise the style-loader would not work

### live-server

- Use `npm run serve:live` that uses `live-server` and `node-sass` scss watcher. This assumes the entry point as `index.html`. Hence, make sure the file index.js does not import the scss file (done in the previous method)

```
// import "../styles/scss/style.scss";
```

## Build

- Use `npm run serve:dist` to created the minified prod bundle. Uses webpack.

## Initial Performance scores

![image](https://user-images.githubusercontent.com/61248036/102757879-f5545700-4397-11eb-8153-edf837e00764.png)
