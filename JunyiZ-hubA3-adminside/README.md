# Admin-side for PROG2002 A3

This project is the **Admin-side website** for the PROG2002 Assessment 3 task.  
It is built using **AngularJS (version 1.x)** and connects to a Node.js + MySQL backend via RESTful APIs.

### How to Configure and Run

1. Open the project in VS Code.
2. In `app.js`, update the following constant with your backend API address:

   ```js
   app.constant('API_BASE_URL', 'http://localhost:3000/api/events');
