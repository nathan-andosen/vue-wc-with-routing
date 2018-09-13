# Vue WC Seed

Seed app to build Web Components using VueJs, Typescript and Scss.

## Features

* Uses RollupJs to create different builds:
  * __.bundle.umd.min.js__ - UMD build that includes all dependencies
  * __.umd.min.js__ - UMD build excluding dependencies
  * __.esm.js__ - ES module build to be used with a module bundler like webpack or rollup
* Creates a Scss bundle file, this way you can import the scss file in your prject so you can override styles (refer to the helpful example component below)
* All assets are included into the style file (either the css or scss file), for example, fonts, font icons or images are base64 encoded into the .css or .scss file. This makes it easier to distribute your web component via npm
* Typescript & Scss is used
* Easy development process via live reloading and file watching

# Getting started

_Follow the steps below to use this seed app to build your own Web Components using VueJs._

1. Clone the repository: ``git clone https://github.com/nathan-andosen/vue-wc-seed my-component-name``

2. ``cd my-component-name``

3. Remove the git origin: ``git remote rm origin``

4. Run the init command: ``npm run init -- -n my-component-name``

5. Thats it, your component is now setup, you can start development. Refer to the helpful example component below for help on how to accomplish common tasks.

## Helpful example component

__Repo:__ https://github.com/nathan-andosen/example-vue-wc

The example component demonstrates the following:

* Using third party libraries in your component, such as Bootstrap
* How to fire events from your web component
* How to pass data to your web component
* How you can use your web component in other libraries, such as Angular
* How to use font icons and images inside your component
* How you can override styles (if you are using your web component with scss inside another application)
* How to distrubute your web component via npm

# Development

``npm run dev`` - Run this command when developing on your component. It will start start a server for you and open up the browser (pointing to http://localhost:9001). It will watch for file changes, re-compile and reload the browser.

# Distribution

``npm run build`` - Will compile the distribution files.

_Refer to the helpful example component above which will show you how to use the component with npm._
