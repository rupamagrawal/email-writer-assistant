package com.email.writer.Service;

import com.email.writer.Model.EmailRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("model", "gemini-2.5-flash");
        requestBody.put("input", prompt);

        try {

            ObjectMapper mapper = new ObjectMapper();

//            System.out.println("========== GEMINI REQUEST ==========");
//            System.out.println(
//                    mapper.writerWithDefaultPrettyPrinter()
//                            .writeValueAsString(requestBody)
//            );

            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", geminiApiKey)
                    .bodyValue(requestBody)
                    .exchangeToMono(clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .map(body -> {

//                                        System.out.println("========== GEMINI RESPONSE ==========");
//                                        System.out.println(clientResponse.statusCode());
//                                        System.out.println(body);
//                                        System.out.println("====================================");

                                        return body;
                                    })
                    )
                    .block();

            return extractResponseContent(response);

        } catch (Exception e) {

            e.printStackTrace();
            return "Error : " + e.getMessage();
        }
    }
    private String extractResponseContent(String response) {

        try {

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);

            JsonNode steps = rootNode.path("steps");

            for (JsonNode step : steps) {

                if ("model_output".equals(step.path("type").asText())) {

                    JsonNode content = step.path("content");

                    if (content.isArray() && content.size() > 0) {

                        return content.get(0)
                                .path("text")
                                .asText();
                    }
                }
            }

            return "No response generated.";

        } catch (Exception e) {

            return "Error processing response: " + e.getMessage();

        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "Generate a professional email reply for the following email content. " +
                        "Do not generate a subject line."
        );

        if (emailRequest.getTone() != null &&
                !emailRequest.getTone().trim().isEmpty()) {
            prompt.append(" Use a ")
                    .append(emailRequest.getTone())
                    .append(" tone.");
        }

        if (emailRequest.getLength() != null &&
                !emailRequest.getLength().trim().isEmpty()) {
            prompt.append("\nReply Length: ")
                    .append(emailRequest.getLength());
        }

        prompt.append("\n\nOriginal Email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}
