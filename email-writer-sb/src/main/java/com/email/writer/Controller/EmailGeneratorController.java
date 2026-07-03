package com.email.writer.Controller;

import com.email.writer.Model.EmailRequest;
import com.email.writer.Service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/email")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {

//        System.out.println("========== FRONTEND REQUEST ==========");
//        System.out.println("Email Content: " + emailRequest.getEmailContent());
//        System.out.println("Tone: " + emailRequest.getTone());
//        System.out.println("======================================");

        String response = emailGeneratorService.generateEmailReply(emailRequest);

        return ResponseEntity.ok(response);
    }
}