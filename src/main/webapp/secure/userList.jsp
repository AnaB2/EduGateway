<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:useBean id="users" scope="request" type="java.util.List"/>

<html>
<head>
    <title>Lista de usuarios</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
</head>
<body>
<nav>
    <a href="${pageContext.request.contextPath}/secure/user-list">Listar Usuarios</a>
    <a href="${pageContext.request.contextPath}/logout.do">Logout</a>
</nav>

<h1>Usuarios</h1>
<ul>
    <c:forEach var="user" items="${users}">
        <li>${user.lastName}, ${user.firstName}</li>
    </c:forEach>
</ul>
</body>
</html>