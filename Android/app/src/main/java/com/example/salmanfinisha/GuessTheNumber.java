package com.example.salmanfinisha;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class GuessTheNumber extends AppCompatActivity {

    private EditText etGuess;
    private Button btnCheck;
    private int minNumber = 1;
    private int maxNumber = 10;
    private int randomNumber;
    private TextView tvInstruction;
    private Button btnBackMenu;
    private MediaPlayer winGame;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guess_the_number);

        etGuess = findViewById(R.id.etGuess);
        btnCheck = findViewById(R.id.btnCheck);
        tvInstruction = findViewById(R.id.tvInstruction);
        btnBackMenu = findViewById(R.id.btnBackMenu);
        // Generate random number between 1 and 10 initially
        generateRandomNumber(minNumber, maxNumber);

        btnCheck.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String guessStr = etGuess.getText().toString();

                if (guessStr.isEmpty()) {
                    Toast.makeText(GuessTheNumber.this, "Enter a number", Toast.LENGTH_SHORT).show();
                    return;
                }

                int guess = Integer.parseInt(guessStr);

                if (guess == randomNumber) {
                    Toast.makeText(GuessTheNumber.this, "Congratulations! You guessed the number.", Toast.LENGTH_SHORT).show();
                    if (maxNumber == 10) {
                        tvInstruction.setText("Medium level: Guess the number between 1-25");
                        // Change the range to 1-25 after successful guess in easy level
                        minNumber = 1;
                        maxNumber = 25;
                    } else if (maxNumber == 25) {
                        tvInstruction.setText("Hard level: Guess the number between 1-50");
                        // Change the range to 1-50 after successful guess in medium level
                        minNumber = 1;
                        maxNumber = 50;
                    } else {
                        // This means the user successfully guessed the number in the hard level (1-50)
                        winGame = MediaPlayer.create(GuessTheNumber.this, R.raw.win_guees_game);
                        winGame.start();
                        Toast.makeText(GuessTheNumber.this, "Well done, you won the game!", Toast.LENGTH_SHORT).show();

                    }
                    // Generate a new random number for the updated range
                    generateRandomNumber(minNumber, maxNumber);
                } else {
                    Toast.makeText(GuessTheNumber.this, "Try again!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        btnBackMenu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent backToPage = new Intent(GuessTheNumber.this, MainActivity.class);
                startActivity(backToPage);
                finish();
            }
        });

    }

    private void generateRandomNumber(int min, int max) {
        randomNumber = (int) (Math.random() * (max - min + 1)) + min;
    }
}