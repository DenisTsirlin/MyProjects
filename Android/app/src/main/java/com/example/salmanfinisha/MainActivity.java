package com.example.salmanfinisha;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private ImageButton imgGuessPage;
    private ImageButton imgCameraPage;
    private ImageButton imgCalcPage;
    private ImageButton imgGamePage;
    private ImageButton imgMapsPage;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        imgGuessPage.setOnClickListener(this);
        imgCameraPage.setOnClickListener(this);
        imgCalcPage.setOnClickListener(this);
        imgGamePage.setOnClickListener(this);
        imgMapsPage.setOnClickListener(this);
    }

    private void initViews() {
        imgGuessPage = findViewById(R.id.imgGuessPage);
        imgCameraPage = findViewById(R.id.imgCameraPage);
        imgCalcPage = findViewById(R.id.imgCalcPage);
        imgGamePage = findViewById(R.id.imgGamePage);
        imgMapsPage = findViewById(R.id.imgMapsPage);


    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.imgGuessPage) {
            MediaPlayer mediaImgGuess = MediaPlayer.create(this, R.raw.soundguess);
            if (mediaImgGuess != null) {
                mediaImgGuess.start();
            }
            startActivity(new Intent(MainActivity.this, GuessTheNumber.class));
        }
        if (v.getId() == R.id.imgCameraPage) {
            MediaPlayer mediaImgPic = MediaPlayer.create(MainActivity.this, R.raw.picture_page);
            if (mediaImgPic != null) {
                mediaImgPic.start();
            }
            startActivity(new Intent(MainActivity.this, TakePicOrVid.class));
        }
        if (v.getId() == R.id.imgCalcPage){
            startActivity(new Intent(MainActivity.this,Calculator.class));
        }
        if (v.getId() == R.id.imgGamePage){
            startActivity(new Intent(MainActivity.this,RockPaperScissors.class));
        }
        if (v.getId() == R.id.imgMapsPage){
            startActivity(new Intent(MainActivity.this, Maps.class));
        }

    }
}