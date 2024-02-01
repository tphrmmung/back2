** env_guide **

PORT=

JWT_KEY=

------------------

** api_service **

method        path              params         body

POST         /auth/register     none           {user,password,comfrimPassword,email}
POST         /auth/login        none           {user,password}
<!-- PUT          /todo               :id           {title,duedate} -->

----------------

notes

MVC (Models, route+Controller,View)