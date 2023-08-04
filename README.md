# Refactored_Rest_API
based on https://github.com/gitdagray/mongo_async_crud

# NPM Package's
- [nodemon](https://www.npmjs.com/package/nodemon)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [path](https://www.npmjs.com/package/path)
- [cors](https://www.npmjs.com/package/cors)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [mssql](https://www.npmjs.com/package/mssql)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

# Setup Steps
1) Download & Install Node.js - [https://nodejs.org/en](https://nodejs.org/en)
2) Clone Repo - [https://github.com/AIT-Group-Project/Refactored_Rest_API.git](https://github.com/AIT-Group-Project/Refactored_Rest_API.git)
3) Open the terminal in project directory
4) Run `npm i` to install all the required dependencies
5) Choses from Available Scripts

# Available Scripts
|Command|Execution|Info|
|-------|---------|----|
|`npm start`|node server.js|runs the application|
|`npm run dev`|nodemon server.js|runs the application with nodemon|

# API Endpoints

|Address|Request-Type|Body-Data|JWT-Auth-Required|
|-------|------------|---------|-----------------|
|http://localhost:3500/auth|POST|email - password|No|
|http://localhost:3500/register|POST|email - password - firstName - LastName|No|
|http://localhost:3500/|-|-|
|http://localhost:3500/|-|-|


