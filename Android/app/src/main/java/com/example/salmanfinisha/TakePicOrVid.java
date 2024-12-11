package com.example.salmanfinisha;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class TakePicOrVid extends AppCompatActivity {
    private Button btnCameraPic;
    private Button btnCameraVid;

    private ImageView imageViewPic;
    private VideoView videoView;
    static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final int REQUEST_VIDEO_CAPTURE = 2;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_take_pic_or_vid);
        btnCameraPic = findViewById(R.id.btnCameraPic);
        btnCameraVid = findViewById(R.id.btnCameraVid);
        imageViewPic = findViewById(R.id.imageViewPic);
        videoView = findViewById(R.id.videoView);
        btnCameraPic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ContextCompat.checkSelfPermission(TakePicOrVid.this, Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED) {
                    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    startActivityForResult(intent, REQUEST_IMAGE_CAPTURE);
                }
                else {
                    requestPermissions(new String[]{Manifest.permission.CAMERA},REQUEST_IMAGE_CAPTURE);
                }
            }
        });

        btnCameraVid.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ContextCompat.checkSelfPermission(TakePicOrVid.this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                    Intent takeVideoIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
                    if (takeVideoIntent.resolveActivity(getPackageManager()) != null) {
                        startActivityForResult(takeVideoIntent, REQUEST_VIDEO_CAPTURE);
                    }
                } else {
                    requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_VIDEO_CAPTURE);
                }
            }
        });


    }

    @Override

    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            // Handle image capture
            Bitmap image = (Bitmap) data.getExtras().get("data");
            imageViewPic.setImageBitmap(image);
        } else if (requestCode == REQUEST_VIDEO_CAPTURE && resultCode == RESULT_OK) {
            // Handle video capture
            Uri videoUri = data.getData();
            if (videoUri != null) {
                // Set video URI to VideoView
                videoView.setVideoURI(videoUri);
                // Start video playback
                videoView.start();
            } else {
                Toast.makeText(this, "Failed to retrieve video", Toast.LENGTH_SHORT).show();
            }
        }
    }


}