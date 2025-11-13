package com.stackroute.authapp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @Value("${firebase.config.path:/app/zestora-firebase.json}")
    private String firebaseConfigPath;

    @PostConstruct
    public void init() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) return;

            FirebaseOptions options = null;

            // 1️⃣ Check environment variable (Render deployment secret)
            String firebaseKey = System.getenv("FIREBASE_KEY");

            if (firebaseKey != null && !firebaseKey.isBlank()) {
                System.out.println("🌐 Using FIREBASE_KEY from environment variable");
                ByteArrayInputStream serviceAccount =
                        new ByteArrayInputStream(firebaseKey.getBytes(StandardCharsets.UTF_8));

                options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
            }

            // 2️⃣ Check Docker / Linux path
            else {
                File dockerKeyFile = new File(firebaseConfigPath);
                if (dockerKeyFile.exists()) {
                    System.out.println("🐳 Using Firebase key from Docker path: " + firebaseConfigPath);

                    FileInputStream serviceAccount = new FileInputStream(dockerKeyFile);
                    options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                            .build();
                }
                // 3️⃣ Fallback: check local resources (IDE)
                else {
                    File localKey = new File("src/main/resources/zestora-dc0ed-firebase-adminsdk-fbsvc-8cd225cfc3.json");
                    if (localKey.exists()) {
                        System.out.println("💻 Using local Firebase key from resources");
                        FileInputStream serviceAccount = new FileInputStream(localKey);

                        options = FirebaseOptions.builder()
                                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                .build();
                    } else {
                        System.out.println("⚠️ No Firebase key found — skipping initialization.");
                        return;
                    }
                }
            }

            // Initialize Firebase
            if (options != null) {
                FirebaseApp.initializeApp(options);
                System.out.println("🔥 Firebase initialized successfully!");
            }

        } catch (Exception e) {
            System.out.println("❌ Firebase initialization failed: " + e.getMessage());
        }
    }
}
