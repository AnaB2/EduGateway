package austral.ing.lab1.controllers;

import com.mercadopago.MercadoPagoConfig;
import austral.ing.lab1.model.PreferenceRequestDTO;
import com.google.gson.Gson;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import spark.Route;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MercadoPagoController {

    private static final Gson gson = new Gson();

    public static Route handleCreatePreference = (spark.Request request, spark.Response response) -> {

        // Agrega credenciales
        MercadoPagoConfig.setAccessToken("APP_USR-8064485401291403-010213-63a77306dc121dc0aae5ef34c0fbe025-2191234246");

        try {
            // Leer y parsear el cuerpo de la solicitud
            String body = request.body();
            PreferenceRequestDTO preferenceDTO = new Gson().fromJson(body, PreferenceRequestDTO.class);

            // Crear el ítem
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title(preferenceDTO.getTitle())
                    .unitPrice(new BigDecimal(preferenceDTO.getPrice()))
                    .quantity(1)
                    .build();

            // Agregar el ítem a la lista
            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            // Construir la preferencia
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .build();

            // Crear la preferencia utilizando el cliente de Mercado Pago
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            // Responder con el ID de la preferencia
            response.type("application/json");
            return new Gson().toJson(new Response(preference.getId()));
        } catch (Exception e) {
            e.printStackTrace(); // Registrar errores en la consola
            response.status(500);
            return new Gson().toJson(new ErrorResponse("Error al crear la preferencia: " + e.getMessage()));
        }
    };


    // Clases auxiliares para respuestas
    private static class Response {
        private final String preferenceId;

        public Response(String preferenceId) {
            this.preferenceId = preferenceId;
        }

        public String getPreferenceId() {
            return preferenceId;
        }
    }

    private static class ErrorResponse {
        private final String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }
}
