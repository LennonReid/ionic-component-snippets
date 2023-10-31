# ionic-component-snippets

## Start the app

To start the development server run `nx serve ionic-component-snippets or npx nx serve`. Open your browser and navigate to http://localhost:4200/. Happy coding!


### build app first

`npx nx run build --prod` or `yarn nx run build --prod`

### create android/ios folder

`npx nx run ionic-component-snippets:add:android` or `yarn nx run ionic-component-snippets:add:android` (Android)  
`npx nx run ionic-component-snippets:add:ios` or `yarn nx run ionic-component-snippets:add:ios` (IOS)

### capacitor sync native files

`cd apps/ionic-component-snippets`
`npx cap sync android` or
`npx cap sync ios`

### open in android studio

`npx nx run ionic-component-snippets:open:android --preserveProjectNodeModules=true
`

### run on emulator

`npx nx run ionic-component-snippets:run:android` or `yarn nx run ionic-component-snippets:run:android` (Android)  
`npx nx run ionic-component-snippets:run:ios` or `yarn nx run ionic-component-snippets:run:ios` (IOS)

<p>
  <i>To run on mobile please check Ionic website for prior installation</i>
</p>

### run on live-reload mode

`cd apps/ionic-component-snippets`
`npx ionic capacitor run android --livereload --external --project=ionic-component-snippets`
