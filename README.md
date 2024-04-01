Esta aplicación tiene los siguientes casos de uso resueltos:
* Registración de usuario
  src/main/webapp/signup.html (html con formulario con estilos obtenidos de la libraria de CSS e  Bootstrap)
  src/main/java/austral/ing/lab1/service/Signup.java (Servlet con lógica de registración)

* Login de usuario
  src/main/webapp/login.html
  src/main/webapp/WEB-INF/web.xml (Configuración del Security Filter en la web app)
  src/main/webapp/WEB-INF/securityfilter-config.xml (Configuración del Security Filter)
  src/main/java/austral/ing/lab1/service/UserRealm.java (Clase con la lógica para autenticar a un usuario)

* Logout de usuario
  src/main/webapp/secure/home.html
  src/main/java/austral/ing/lab1/service/Logout.java (Servlet con invalidación de la sesión http)

* Listar usuarios (server side usando JSP)
  src/main/webapp/secure/home.html
  src/main/java/austral/ing/lab1/service/UserList.java (Servlet)
  src/main/webapp/secure/userList.jsp (JSP)

* Listar usuarios (client side usando AJAX)
  src/main/webapp/secure/home.html
  src/main/webapp/secure/users.html (html con JS para hacer la llamada al server para obtener los usuarios)
  src/main/java/austral/ing/lab1/service/UserServlet.java

Configuración de la web app
src/main/webapp/WEB-INF/web.xml

Stack
* Servlets: https://www.oracle.com/java/technologies/java-servlet-tec.html
  src/main/webapp/signup.html

* Java JSP: https://www.oracle.com/java/technologies/jspt.html
* Security filter (http://securityfilter.sourceforge.net/): Libreria que sirve para agregar seguridad a nuestra web app. Necesitamos hacer el login para acceder a recursos no públicos
* JPA  implementado por HIbernate: Librería ORM
* HSQL: Motor de base de datos
* Bootstrap: Librería de front-end para el diseño de web apps https://getbootstrap.com/


[Tutorial para configura Tomcat](/tutorial/tutorial.md)