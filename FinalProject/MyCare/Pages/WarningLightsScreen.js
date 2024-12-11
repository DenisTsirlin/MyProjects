import React from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ייבוא האייקון

// ייבוא התמונה של הנורות
const warningLightsImage = require('../assets/warningLightsImage.jpg');

const WarningLightsScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // הגדרת גובה התמונה שתהיה 50% מגובה המסך
  const imageHeight = screenHeight * 0.5;

  // פונקציה לטיפול בלחיצה על נורה
  const handleLightPress = (lightName, description, urgencyLevel) => {
    let urgencyMessage = '';

    if (urgencyLevel === 'immediate') {
      urgencyMessage = 'יש להגיע למוסך באופן מיידי.';
    }
    else if (urgencyLevel === 'soon') {
      urgencyMessage = 'אין צורך להגיע למוסך במיידי, אך יש לטפל בתקלה בהקדם.';
    }
    else if (urgencyLevel === 'good') {
      urgencyMessage = 'אין צורך להגיע למוסך.';
    }
  

    Alert.alert(
      `מידע: ${lightName}`,
      `${description}\n\n${urgencyMessage}`,
      urgencyLevel === 'immediate'
        ? [
          {
            text: 'נווט למוסך',
            onPress: () => navigation.navigate('NearbyGarages'),
          },
          { text: 'ביטול', style: 'cancel' },
        ]
        : [{ text: 'אוקיי', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="car" size={30} color="purple" style={styles.icon} />
        <Text style={styles.title}>תקלות נורות חיווי ברכב</Text>
      </View>

      <Text style={styles.subtitle}>אנא לחץ על הנורה שנדלקה לך וקבל מידע על התקלה ומה צריך לעשות</Text>

      <View style={styles.imageContainer}>
        <Image source={warningLightsImage} style={{ width: screenWidth, height: imageHeight }} resizeMode="contain" />

        {/* לחיצה על כל נורה לפי המיקומים שנמדדו לפי גודל התמונה */}
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.07, left: screenWidth * 0.05 }]}
          onPress={() =>
            handleLightPress(
              'נורת מערכת בלמים',
              'מציינת בעיה במערכת הבלמים, ייתכן מחסור בנוזל בלמים או בעיה אחרת.',
              'immediate'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.06, left: screenWidth * 0.31 }]}
          onPress={() =>
            handleLightPress(
              'נורת מנוע',
              'מציינת תקלה במנוע או במערכת הפליטה. ייתכן שחלק זקוק להחלפה או תיקון.',
              'immediate'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.06, left: screenWidth * 0.57 }]}
          onPress={() =>
            handleLightPress(
              'נורת מצבר',
              'מציינת בעיה במצבר או במערכת החשמל של הרכב.',
              'immediate'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.06, left: screenWidth * 0.84 }]}
          onPress={() =>
            handleLightPress(
              'מחממי מצתים אינם תקינים',
              'תקלה במערכת חימום המצתים, חיונית במיוחד ברכבי דיזל.',
              'good'
            )
          }
        />

        {/* שורה שניה */}
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.30, left: screenWidth * 0.05 }]}
          onPress={() =>
            handleLightPress(
              'נורת החלקה',
              'מציינת בעיה במערכת בקרת החלקה.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.30, left: screenWidth * 0.31 }]}
          onPress={() =>
            handleLightPress(
              'נורת דלק',
              'מציינת שהדלק במיכל קרוב להיגמר.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.30, left: screenWidth * 0.57 }]}
          onPress={() =>
            handleLightPress(
              'נורת לחיצה על דוושת הבלם',
              'יש ללחוץ על דוושת הבלם לפני התנעה.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.30, left: screenWidth * 0.84 }]}
          onPress={() =>
            handleLightPress(
              'נורת חום מנוע',
              'מציינת שהמנוע חם מדי. ייתכן מחסור בנוזל קירור.',
              'immediate'
            )
          }
        />

        {/* שורה שלישית */}
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.56, left: screenWidth * 0.05 }]}
          onPress={() =>
            handleLightPress(
              'נורת אורות אזהרה',
              'מציינת הפעלת אורות אזהרה ברכב. תיעלם כאשר תכבו את האורות.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.55, left: screenWidth * 0.31 }]}
          onPress={() =>
            handleLightPress(
              'נורת מפשיר אדים אחורי',
              'מציינת שהמפשיר האחורי מופעל.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.55, left: screenWidth * 0.57 }]}
          onPress={() =>
            handleLightPress(
              'נורת כרית אוויר',
              'מציינת תקלה במערכת כריות האוויר.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.55, left: screenWidth * 0.84 }]}
          onPress={() =>
            handleLightPress(
              'נורת לחץ אוויר בצמיגים',
              'מציינת לחץ אוויר לא תקין בצמיגים.',
              'immediate'
            )
          }
        />

        {/* שורה רביעית */}
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.80, left: screenWidth * 0.06 }]}
          onPress={() =>
            handleLightPress(
              'נורת פנסי ערפל',
              'מציינת שהפעלת את פנסי הערפל.',
              'good'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.80, left: screenWidth * 0.30 }]}
          onPress={() =>
            handleLightPress(
              'נורת שמן',
              'מציינת לחץ שמן נמוך או מחסור בשמן מנוע.',
              'immediate'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.80, left: screenWidth * 0.58 }]}
          onPress={() =>
            handleLightPress(
              'נורת ABS',
              'מציינת תקלה במערכת ה-ABS.',
              'soon'
            )
          }
        />
        <TouchableOpacity
          style={[styles.iconTouchable, { top: imageHeight * 0.80, left: screenWidth * 0.85 }]}
          onPress={() =>
            handleLightPress(
              'נורת חגורת בטיחות',
              'מציינת שחגורת הבטיחות אינה חגורה.',
              'good'
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'purple',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  iconTouchable: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
});

export default WarningLightsScreen;
