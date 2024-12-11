package com.example.salmanfinisha;

import java.util.Stack;

public class ExpressionEvaluator {
    // פונקציה לחישוב הביטוי והחזרת התוצאה
    public static double evaluate(String expression) {
        // המרת מחרוזת הביטוי למערך של תווים
        char[] tokens = expression.toCharArray();

        // יצירת מחסנית לאחסון אופרנדים (מספרים)
        Stack<Double> values = new Stack<>();

        // יצירת מחסנית לאחסון אופרטורים (+, -, *, /)
        Stack<Character> operators = new Stack<>();

        // לולאה שעוברת על כל תו בביטוי
        for (int i = 0; i < tokens.length; i++) {
            // דילוג על תווים רווחים
            if (tokens[i] == ' ')
                continue;

            // אם התו הנוכחי הוא מספר או נקודה (עבור מספרים עשרוניים), בנה את האופרנד
            if (Character.isDigit(tokens[i]) || tokens[i] == '.') {
                StringBuilder sb = new StringBuilder();
                // קריאה לספרות ולנקודה כדי לבנות את המספר
                while (i < tokens.length && (Character.isDigit(tokens[i]) || tokens[i] == '.')) {
                    sb.append(tokens[i++]);
                }
                //יחסיר את האינדקס כדי לתקן את הקפיצה הנוספת בלולאה
                i--;
                // המרת מחרוזת האופרנד למספר double והוספתו למחסנית של הערכים
                values.push(Double.parseDouble(sb.toString()));
            }
            // אם התו הנוכחי הוא פתיחת סוגריים, הוספה אותו למחסנית האופרטורים
            else if (tokens[i] == '(') {
                operators.push(tokens[i]);
            }
            // אם התו הנוכחי הוא סגירת סוגריים, חשב את הביטויים בתוך הסוגריים
            else if (tokens[i] == ')') {
                while (operators.peek() != '(')
                    // החל האופרטור על האיברים העליונים במחסנית הערכים
                    values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
                // הסר את הסימן '(' ממחסנית האופרטורים
                operators.pop();
            }
            // אם התו הנוכחי הוא אופרטור (+, -, *, /)
            else if (tokens[i] == '+' || tokens[i] == '-' ||
                    tokens[i] == '*' || tokens[i] == '/') {
                // כל עוד האופרטור העליון במחסנית אופרטורים עם אותו או יותר עדיפות מהתו הנוכחי
                // חל האופרטור העליון על האיברים העליונים במחסנית ערכים
                while (!operators.empty() && hasPrecedence(tokens[i], operators.peek()))
                    values.push(applyOperator(operators.pop(), values.pop(), values.pop()));
                // הוספת התו הנוכחי למחסנית האופרטורים
                operators.push(tokens[i]);
            }
        }

        // כל הביטוי עובר על ידי, חישוב האופרטורים הנותרים על הערכים הנותרים
        while (!operators.empty())
            values.push(applyOperator(operators.pop(), values.pop(), values.pop()));

        // הערך העליון במחסנית הערכים מכיל את התוצאה
        return values.pop();
    }

    // פונקציה לבדיקת העדיפות של האופרטורים
    private static boolean hasPrecedence(char op1, char op2) {
        return (op2 != '(' && op2 != ')' && ((op1 == '*' || op1 == '/') || (op2 == '+' || op2 == '-')));
    }

    // פונקציה להחלת האופרטור על שני אופרנדים
    private static double applyOperator(char operator, double b, double a) {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b == 0)
                    throw new ArithmeticException("Division by zero");
                return a / b;
        }
        return 0;
    }
}
