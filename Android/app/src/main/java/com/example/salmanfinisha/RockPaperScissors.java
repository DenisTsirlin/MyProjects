package com.example.salmanfinisha;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Random;

public class RockPaperScissors extends AppCompatActivity {

    private TextView resultText;
    private String[] choices = {"אבן", "נייר", "מספריים"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rock_paper_scissors);

        Button rockButton = findViewById(R.id.rock_button);
        Button paperButton = findViewById(R.id.paper_button);
        Button scissorsButton = findViewById(R.id.scissors_button);
        resultText = findViewById(R.id.result_text);

        rockButton.setOnClickListener(view -> playRound("אבן"));
        paperButton.setOnClickListener(view -> playRound("נייר"));
        scissorsButton.setOnClickListener(view -> playRound("מספריים"));
    }

    private void playRound(String userChoice) {
        String computerChoice = choices[new Random().nextInt(choices.length)];
        String result = getResult(userChoice, computerChoice);
        resultText.setText("אתה בחרת: " + userChoice + "\nהמחשב בחר: " + computerChoice + "\n" + result);
    }

    private String getResult(String userChoice, String computerChoice) {
        if(userChoice.equals(computerChoice)) {
            return "תיקו!";
        }

        switch (userChoice) {
            case "אבן":
                return (computerChoice.equals("מספריים") ? "ניצחת!" : "הפסדת!");
            case "נייר":
                return (computerChoice.equals("אבן") ? "ניצחת!" : "הפסדת!");
            case "מספריים":
                return (computerChoice.equals("נייר") ? "ניצחת!" : "הפסדת!");
            default:
                return "error!!";
        }
    }
}