package com.example.salmanfinisha;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;

import java.util.Stack;

public class Calculator extends AppCompatActivity implements View.OnClickListener {
    private TextView txtSolution, txtResult;
    private MaterialButton btnC, btnOpenBracket, btnCloseBracket;
    private MaterialButton btnDivide, btnMultiply, btnPlus, btnMinus, btnEqul;
    private MaterialButton btn0, btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9;
    private MaterialButton btnAc, btnDot;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calculator);

        initViews();
        txtSolution.setOnClickListener(this);
        txtResult.setOnClickListener(this);
        btnC.setOnClickListener(this);
        btnOpenBracket.setOnClickListener(this);
        btnCloseBracket.setOnClickListener(this);
        btnDivide.setOnClickListener(this);
        btnMultiply.setOnClickListener(this);
        btnPlus.setOnClickListener(this);
        btnMinus.setOnClickListener(this);
        btnEqul.setOnClickListener(this);
        btn0.setOnClickListener(this);
        btn1.setOnClickListener(this);
        btn2.setOnClickListener(this);
        btn3.setOnClickListener(this);
        btn4.setOnClickListener(this);
        btn5.setOnClickListener(this);
        btn6.setOnClickListener(this);
        btn7.setOnClickListener(this);
        btn8.setOnClickListener(this);
        btn9.setOnClickListener(this);
        btnAc.setOnClickListener(this);
        btnDot.setOnClickListener(this);




    }

    private void initViews() {
        txtSolution = findViewById(R.id.txtSolution);
        txtResult = findViewById(R.id.txtResult);
        btnC = findViewById(R.id.btnC);
        btnOpenBracket = findViewById(R.id.btnOpenBracket);
        btnCloseBracket = findViewById(R.id.btnCloseBracket);
        btnDivide = findViewById(R.id.btnDivide);
        btnMultiply = findViewById(R.id.btnMultiply);
        btnPlus = findViewById(R.id.btnPlus);
        btnMinus = findViewById(R.id.btnMinus);
        btnEqul = findViewById(R.id.btnEqul);
        btn0 = findViewById(R.id.btn0);
        btn1 = findViewById(R.id.btn1);
        btn2 = findViewById(R.id.btn2);
        btn3 = findViewById(R.id.btn3);
        btn4 = findViewById(R.id.btn4);
        btn5 = findViewById(R.id.btn5);
        btn6 = findViewById(R.id.btn6);
        btn7 = findViewById(R.id.btn7);
        btn8 = findViewById(R.id.btn8);
        btn9 = findViewById(R.id.btn9);
        btnAc = findViewById(R.id.btnAc);
        btnDot = findViewById(R.id.btnDot);


    }


    @Override
    public void onClick(View v) {
        MaterialButton button = (MaterialButton) v;
        String btnText = button.getText().toString();

        if (btnText.equals("AC")) {
            // Clear the input and result
            txtSolution.setText("");
            txtResult.setText("0");
        } else if (btnText.equals("=")) {
            // Calculate the result
            try {
                double result = ExpressionEvaluator.evaluate(txtSolution.getText().toString());
                txtResult.setText(String.valueOf(result));
            } catch (ArithmeticException e) {
                txtResult.setText("Error");
            }
        } else if (btnText.equals("C")) {
            // Clear the input
            txtSolution.setText("");
        } else {
            // Append the button text to the input
            txtSolution.append(btnText);
        }
    }





}

