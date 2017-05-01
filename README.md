# AngularJS-School-Management-System



## Architecture:

- **Client-side code** is located in `/client/components/` directory (*.html templates, *.js components*, etc.)
- **Code shared by client and server** is located in the `/imports/` directory. (For example, *models*)
- **Server-side code** is located in `/server/` directory (For example, *Meteor methods*)
- **Dependencies**: main angular dependencies and imports are declared in the entry file: `/client/app.js`. The rest of the files only declare their own dependencies and the dependecy of `app.js`. This way the main dependencies are only declared one time and propagated to the other files.
>
>For testing the real time capabilities open another browser version in incognito mode. Changes made by one user in the data are inmediately propagated to the rest of users.
>




## Stack

- **Front-end**: AngularJS and EcmasScript 2015 (ES6)
- **Back-end**: Meteor 1.3 and NodeJS
- **Database**: MongoDB
- **Realtime data:** WebSockets





## Requirements for running the application
- [Meteor Framework](http://www.meteor.com) 1.3+
