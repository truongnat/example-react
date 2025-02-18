
<p  align="center">

<a>

<img  src="./client/public/logo-mern.png"  width="320"  alt="Server API Logo" />

</a>

</p>

<p  align="center">Mern Stack.</p>


## Description

- Learning concept [ReactJS](https://reactjs.org/docs/getting-started.html) framework development by Facebook.

- Learning ecosystem for ReactJS, example : [react-router-dom](https://reactrouter.com/web/guides/quick-start), [redux](https://redux.js.org/), [Chakra UI](https://chakra-ui.com/).

- Implement project example with [CRA](https://create-react-app.dev/).

- Build project and implement with SPA or SSR.

- Deploy source to hosting.



## Feature

- Authentication :
	+ Sign in.
	+ Sign up.
	+ Auto remember login.
	+ Forgot password.
	+ Send email forgot password.
	+ Verity OTP via email.
	+ Update user information, change password.
  
- Loading all in.

- CRUD todo example.

- UI profile and more...etc.

- Build static SSR.

- Search friend `<coming soon>`

- Request add friend `<coming soon>`

- Chat realtime (chat one to one, group chat, ...) `<coming soon>`
  
- Invite group chat `<coming soon>`

- Tutorial detail deployment fullstack app `<coming soon>`.




## Setup



We are using template Create React App.



> Note :
> - Node version have Node >= 10 on your local development machine. You have download [Node JS](https://nodejs.org/en/) or update with command : *npm update*.
> - Using IDE [Visual Studio Code](https://code.visualstudio.com/) or [WebStorm](https://www.jetbrains.com/webstorm/)
> *All you need left is to know a little bit of [Javascript](https://www.w3schools.com/js/) .*



## Docs & Started

- Docs for concept React JS.
- What is [JSX](https://reactjs.org/docs/introducing-jsx.html) ?
- How [rendering](https://reactjs.org/docs/rendering-elements.html)  with React ?
- How to create [Component React and Props](https://reactjs.org/docs/components-and-props.html) ?
- [React State ? LifeCycle ?](https://reactjs.org/docs/state-and-lifecycle.html)
- How to [handle event](https://reactjs.org/docs/handling-events.html) React JS ?
- [Condition Rendering ?](https://reactjs.org/docs/conditional-rendering.html)
- [Lists and Keys?](https://reactjs.org/docs/lists-and-keys.html)
- Difference between Class Component and Functional Components. ( [Link docs](https://reactjs.org/docs/react-component.html#render) | [Link dev](https://dev.to/mehmehmehlol/class-components-vs-functional-components-in-react-4hd3) )
- State management with [redux](https://redux.js.org/)
- Middleware for client [redux saga](https://redux-saga.js.org/)

## Running the app
*We are split two folder: client and server*

`Run only client`

```bash
# development

$ npm run start | yarn start

# build mode

$ npm run build | yarn build


```

`Run only server`

```bash
# development

$ npm run start:dev | yarn start:dev

# production mode

$ npm run start:prod | yarn start:prod


```

## Run SSR

*Run script in root folder*

```bash

cd {root project}.

- open .env file, set IS_SSR=true
 *IS_SSR enable public folder build from client*

# bash script

$ ./ssr.sh

```
## Deployment


> Deployment FE:
	
	Vercel allows for automatic deployment on every branch push and merges onto the production branch.

  - [Login Vercel](https://vercel.com/login)
  - Click button new project => import repository from github.
  - When choose repository, you will see form config, then change root-directory ( ./client )
  - Set ENV in step Environment Variables ( copy and paste all env inside env file ), attention with REACT_APP_BASE_URL, it should be set server link build production.
  - Wait vercel build and done.


> Deployment BE

  - [Login Heroku](https://id.heroku.com/login)
  - On dashboard, create new app {name_repo}.
  - Have two ways:
    - Heroku CLI:
    
      + install heroku cli
        ```
        npm install -g heroku
        ```
      + check version heroku
        ```
        heroku --version
        ```
      + login heroku
        ```
        heroku login
        ```
      + create a new Git repository
        ```
        cd my-project/
        git init
        heroku git:remote -a {name_repo}
        ```
      + deploy your application
        ```
        git add .
        git commit -am "make it better"
        git push heroku master
        ```
      + if existing Git repository
        ```
        heroku git:remote -a testing-be-server
        ```

    - Github connection:
      - Coming soon!
## Stay in touch
## Author - Shivani Yadav
