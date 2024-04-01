package austral.ing.lab1.util;

import javax.persistence.EntityManagerFactory;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

public class Servlets {

  private static final String EMF_KEY = "emf";

  private Servlets() {}

  public static EntityManagerFactory getEntityManagerFactory(HttpServletRequest req) {
    return getEntityManagerFactory(req.getServletContext());
  }


  public static EntityManagerFactory getEntityManagerFactory(ServletContext ctx) {
    return (EntityManagerFactory) ctx.getAttribute("emf");
  }

  public static void setEntityManagerFactory(ServletContext ctx, EntityManagerFactory emf) {
    ctx.setAttribute(EMF_KEY, emf);
  }

}
