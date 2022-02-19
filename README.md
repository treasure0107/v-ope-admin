# operation-system-web

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

```
operation-system-web
├─ .browserslistrc
├─ .env.development
├─ .env.production
├─ .eslintrc.js
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ babel.config.js
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ README.md
├─ src
│  ├─ api
│  │  ├─ index.js 
│  │  └─ user.js
│  ├─ App.vue
│  ├─ assets
│  │  ├─ icons
│  │  │  ├─ index.js
│  │  │  ├─ svg
│  │  │  │  ├─ dashboard.svg
│  │  │  │  ├─ password.svg
│  │  │  │  └─ user.svg
│  │  │  └─ svgo.yml
│  │  ├─ images
│  │  │  ├─ 401_images
│  │  │  │  └─ 401.gif
│  │  │  ├─ 404_images
│  │  │  │  ├─ 404.png
│  │  │  │  └─ 404_cloud.png
│  │  │  ├─ avatar.png
│  │  │  ├─ login-bg.jpg
│  │  │  └─ logo.png
│  │  └─ styles
│  │     ├─ element-ui.scss
│  │     ├─ index.scss
│  │     ├─ reset.scss
│  │     ├─ mixin.scss
│  │     ├─ sidebar.scss
│  │     ├─ transition.scss
│  │     └─ variables.scss
│  ├─ components
│  │  ├─ Breadcrumb
│  │  │  └─ index.vue
│  │  ├─ Hamburger
│  │  │  └─ index.vue
│  │  └─ SvgIcon
│  │     └─ index.vue
│  ├─ layout
│  │  ├─ components
│  │  │  ├─ AppMain.vue
│  │  │  ├─ index.js
│  │  │  ├─ Navbar.vue
│  │  │  └─ Sidebar
│  │  │     ├─ FixiOSBug.js
│  │  │     ├─ index.vue
│  │  │     ├─ Item.vue
│  │  │     ├─ Link.vue
│  │  │     ├─ Logo.vue
│  │  │     └─ SidebarItem.vue
│  │  ├─ index.vue
│  │  └─ mixin
│  │     └─ ResizeHandler.js
│  ├─ main.js
│  ├─ permission.js
│  ├─ router
│  │  └─ index.js
│  ├─ settings.js
│  ├─ store
│  │  ├─ getters.js
│  │  ├─ index.js
│  │  └─ modules
│  │     ├─ app.js
│  │     ├─ settings.js
│  │     └─ user.js
│  ├─ utils
│  │  ├─ auth.js
│  │  ├─ get-page-title.js
│  │  ├─ index.js
│  │  ├─ request.js
│  │  └─ validate.js
│  └─ views
│     ├─ errorPage
│     │  ├─ 401.vue
│     │  ├─ 404.vue
│     │  └─ redirect.vue
│     ├─ groupManagement
│     │  ├─ daily.vue
│     │  └─ index.vue
│     ├─ home
│     │  ├─ components
│     │  │    ├─ Backlog.vue
│     │  │    ├─ Communication.vue
│     │  │    ├─ FormTemplate.vue
│     │  │    └─ Message.vue
│     │  └─ monthly.vue
│     ├─ operationManagement
│     │  ├─ runningLog
│     │  │    └─ index.vue
│     │  ├─ transitionManagement
│     │  │    └─ index.vue
│     ├─ operationTicketManagement
│     │  └─ index.vue
│     ├─ personnelManagement
│     │  ├─ outsideStationPerson
│     │  │    └─ index.vue
│     │  ├─ stationPerson
│     │  │    └─ index.vue
│     ├─ roleManagement
│     │  └─ index.vue
│     └─ Login.vue
├─ vue.config.js
└─ yarn.lock

```