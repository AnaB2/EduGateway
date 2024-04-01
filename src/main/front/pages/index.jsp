<jsp:useBean id="param1" scope="request" type="java.lang.String"/>
<jsp:useBean id="param2" scope="request" type="java.lang.String"/>

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Ejemplo JSP</title>
  </head>
  <body>
    <h1>Ejemplo JSP</h1>
    <ul>
      <li>param1: ${param1}</li>
      <li>param2: ${param2}</li>
    </ul>
  </body>
</html>