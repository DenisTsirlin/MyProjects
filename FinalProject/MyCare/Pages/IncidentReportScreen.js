import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Linking, Image, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const headerImage = require('../assets/opps.jpg');

const insuranceCompanies = [
  { name: 'הפניקס', phone: '1-22-28-888', towing: 'שגריר' },
  { name: 'הראל', phone: '*8888', towing: 'שגריר' },
  { name: 'AIG', phone: '1-22-28-888', towing: 'שגריר' },
  { name: 'מנורה מבטחים', phone: '03-9535656', towing: 'פמי פרימיום' },
  { name: 'קופל גרופ', phone: '*5676', towing: 'סטארט קאר קופל' },
  { name: 'ממסי', phone: '03-5641122', towing: 'ממסי' },
];

const IncidentReportScreen = () => {
  const [insuranceUrl, setInsuranceUrl] = useState(null);
  const [openSection, setOpenSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [showInsuranceList, setShowInsuranceList] = useState(false);
  const [images, setImages] = useState({
    license: null,
    insurance: null,
    damage: null,
    otherCarDamage: null,
    additionalPhotos: null,
  });
  const [imageLinks, setImageLinks] = useState({
    license: null,
    insurance: null,
    damage: null,
    otherCarDamage: null,
    additionalPhotos: null,
  });
  const [loadingStates, setLoadingStates] = useState({
    license: false,
    insurance: false,
    damage: false,
    otherCarDamage: false,
    additionalPhotos: false,
  });
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCallConfirmation = (company) => {
    Alert.alert(
      `התקשר לחברת ${company.towing}`,
      `האם ברצונך להתקשר ל-${company.phone}?`,
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'התקשר', onPress: () => Linking.openURL(`tel:${company.phone}`) },
      ]
    );
  };

  const uploadImageToCloudinary = async (imageUri, key) => {
    setLoadingStates((prevLoading) => ({ ...prevLoading, [key]: true }));

    let data = new FormData();
    data.append('file', imageUri);
    data.append('api_key', '5fwGfJQUBIMi_RvMHFP2bGnOSas');
    data.append('upload_preset', 'MyCare');

    try {
      let response = await fetch(
        'https://api.cloudinary.com/v1_1/dphqcfyz8/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      let jsonResponse = await response.json();

      setImageLinks((prevLinks) => ({ ...prevLinks, [key]: jsonResponse.secure_url }));
      setImages((prevImages) => ({ ...prevImages, [key]: 'uploaded' }));
    } catch (error) {
      console.error('שגיאה בהעלאת התמונה:', error);
    } finally {
      setLoadingStates((prevLoading) => ({ ...prevLoading, [key]: false }));
    }
  };

  const takePhoto = async (key) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('הרשאת גישה נדחתה', 'יש לאשר גישה למצלמה כדי לצלם תמונה.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImages((prevImages) => ({ ...prevImages, [key]: imageUri }));
      await uploadImageToCloudinary(imageUri, key);
    }
  };

  const sendReport = () => {
    if (!phone || !email) {
      Alert.alert('שגיאה', 'אנא מלא את מספר הטלפון וכתובת המייל.');
      return;
    }

    const imageUrls = Object.values(imageLinks).filter(Boolean);
    if (imageUrls.length === 0) {
      Alert.alert('שגיאה', 'עליך לצלם לפחות תמונה אחת.');
      return;
    }

    const mailtoUrl = `mailto:${email}?subject=דו"ח תאונה&body=טלפון: ${phone}
    רישיון: ${imageLinks.license || 'לא צולמה תמונה'}
    פוליסת ביטוח: ${imageLinks.insurance || 'לא צולמה תמונה'}
    נזק לרכב: ${imageLinks.damage || 'לא צולמה תמונה'}
    נזק לרכב המעורב: ${imageLinks.otherCarDamage || 'לא צולמה תמונה'}
    תמונות נוספות: ${imageLinks.additionalPhotos || 'לא צולמה תמונה'}`;

    Linking.openURL(mailtoUrl);
  };

  const sendEmailWithImages = async () => {
    if (!phone || !email) {
      Alert.alert('שגיאה', 'אנא מלא את מספר הטלפון וכתובת המייל.');
      return;
    }

    const templateParams = {
      phone: phone,
      email: email,
      license: imageLinks.license || 'לא צולמה תמונה',
      insurance: imageLinks.insurance || 'לא צולמה תמונה',
      damage: imageLinks.damage || 'לא צולמה תמונה',
      otherCarDamage: imageLinks.otherCarDamage || 'לא צולמה תמונה',
      additionalPhotos: imageLinks.additionalPhotos || 'לא צולמה תמונה',
    };

    try {
      await send(
        'service_nc9wlu9',
        'template_shzbewu',
        templateParams,
        { publicKey: 'xKn5M1BvQW7YVym7q' }
      );

      Alert.alert('הודעה', 'המייל נשלח בהצלחה!');
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
      }

      Alert.alert('שגיאה', 'שליחת המייל נכשלה.');
      console.error('ERROR', err);
    }
  };

  

  // שליפת כתובת התמונה מ-AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                if (parsedUser._id) {
                    const cars = await fetchCarDetails(parsedUser._id);
                    if (cars.length > 0 && cars[0].insuranceUrl) {
                        setInsuranceUrl(cars[0].insuranceUrl); // קח את insuranceUrl של הרכב הראשון
                    } else {
                        console.log('No insuranceUrl found in vehicles');
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user or vehicle details:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
}, []);

const fetchCarDetails = async (customerId) => {
  try {
      const response = await fetch(`https://my-care-server.onrender.com/api/vehicle/customer/${customerId}`);
      const carData = await response.json();
      return carData?.vehicles || [];
  } catch (error) {
      console.error('Error fetching car details:', error);
      return [];
  }
};

const handleImageView = () => {
  if (insuranceUrl) {
      Alert.alert('תמונת ביטוח', 'האם ברצונך לצפות בתמונה?', [
          { text: 'ביטול', style: 'cancel' },
          { text: 'צפה', onPress: () => Linking.openURL(insuranceUrl) },
      ]);
  } else {
      Alert.alert('חסר תמונה', 'לא הועלתה תמונה לביטוח הרכב.');
  }
};


  return (
    <ScrollView style={styles.container}>
      <Image
        source={headerImage}
        style={styles.headerImage}
        resizeMode="contain"
      />



      <TouchableOpacity style={styles.section} onPress={() => toggleSection('injury')}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="ambulance" size={30} color="orange" />
          <Text style={styles.sectionTitle}>אירוע נזק גופני</Text>
          <FontAwesome name={openSection === 'injury' ? 'chevron-up' : 'chevron-down'} size={20} color="orange" />
        </View>
      </TouchableOpacity>
      {openSection === 'injury' && (
        <View style={styles.sectionContent}>
          <Text style={styles.infoText}>נפגע אדם באירוע? מחובתך להודיע על כך למשטרה ולמד"א</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL('tel:100')}>
              <Text style={styles.buttonText}>חייג למשטרה</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL('tel:101')}>
              <Text style={styles.buttonText}>חייג למד"א</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* סעיף סיוע וגרירה */}

      <TouchableOpacity style={styles.section} onPress={() => toggleSection('towing')}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="tow-truck" size={30} color="orange" />
          <Text style={styles.sectionTitle}>סיוע וגרירה</Text>
          <FontAwesome name={openSection === 'towing' ? 'chevron-up' : 'chevron-down'} size={20} color="orange" />
        </View>
      </TouchableOpacity>
      {openSection === 'towing' && (
        <View style={styles.sectionContent}>
          <ScrollView style={styles.scrollContainer}>
            {/* משפט הכוונה */}
            <Text style={styles.infoText}>
              במידה ואינך יודע את חברת הביטוח, ניתן להתקשר ישירות ל"ידידים" לסיוע.
            </Text>
            {/* כפתור להתקשר לידידים */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Linking.openURL('tel:1230')}
            >
              <Text style={styles.buttonText}>התקשר ל"ידידים"</Text>
            </TouchableOpacity>

            {/* תצוגת תמונת הביטוח */}
            <View style={styles.itemRow}>
              <MaterialCommunityIcons
                name="image"
                size={30}
                color="orange"
                onPress={() => handleImageView(insuranceUrl)}
              />
              <Text style={[styles.labelText, { color: insuranceUrl ? 'green' : 'red' }]}>
                {insuranceUrl ? 'תמונת הביטוח שלך' : 'חסר תמונה לביטוח רכב'}
              </Text>
            </View>
            {/* הצגת התמונה במידה והיא קיימת */}
            {insuranceUrl && (
              <Image source={{ uri: insuranceUrl }} style={styles.insuranceImage} />
            )}

            {/* בחירת חברת ביטוח */}
            <Text style={[styles.labelText,styles.infoText]}>בחר חברת ביטוח:</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowInsuranceList(!showInsuranceList)}
            >
              <Text style={styles.buttonText}>
                {showInsuranceList ? 'סגור רשימה' : 'הצג רשימת חברות ביטוח'}
              </Text>
            </TouchableOpacity>
            {showInsuranceList && (
              <View>
                {insuranceCompanies.map((company, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.insuranceButton}
                    onPress={() => {
                      setSelectedInsurance(company);
                      setShowInsuranceList(false);
                      handleCallConfirmation(company);
                    }}
                  >
                    <Text style={styles.insuranceText}>{company.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {selectedInsurance && (
              <Text style={styles.labelText}>
                חברת הביטוח שנבחרה: {selectedInsurance.name}
              </Text>
            )}
          </ScrollView>

        </View>
      )}


      <TouchableOpacity style={styles.section} onPress={() => toggleSection('documentation')}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="camera" size={30} color="orange" />
          <Text style={styles.sectionTitle}>תיעוד האירוע</Text>
          <FontAwesome name={openSection === 'documentation' ? 'chevron-up' : 'chevron-down'} size={20} color="orange" />
        </View>
      </TouchableOpacity>
      {openSection === 'documentation' && (
        <ScrollView style={styles.sectionContent}>
          {[
            { key: 'license', label: 'צלם את הרישיון של הנהג המעורב' },
            { key: 'insurance', label: 'צלם את הפוליסה של הנהג המעורב' },
            { key: 'damage', label: 'צלם את הנזק ברכב' },
            { key: 'otherCarDamage', label: 'צלם את הנזק ברכב המעורב' },
            { key: 'additionalPhotos', label: 'תמונות נוספות' },
          ].map(({ key, label }) => (
            <View key={key} style={styles.itemRow}>
              <MaterialCommunityIcons name="camera" size={30} color="orange" />
              <Text style={[styles.labelText,styles.infoText]}>{label}</Text>
              {loadingStates[key] ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="gray" />
                  <Text style={styles.loadingText}>טוען...</Text>
                </View>
              ) : images[key] === 'uploaded' ? (
                <TouchableOpacity style={styles.actionButtonWithIcon} disabled={true}>
                  <Text style={styles.buttonTextWithIcon}>תמונה עלתה</Text>
                  <FontAwesome name="check-circle" size={20} color="green" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.actionButton} onPress={() => takePhoto(key)}>
                  <Text style={styles.buttonText}>צלם עכשיו</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Text style={[styles.labelText,styles.infoText]}>הטלפון שלך ליצירת קשר</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="הזן מספר טלפון"
          />

          <Text style={[styles.labelText,styles.infoText]}>כתובת מייל</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="הזן כתובת מייל"
          />

          <TouchableOpacity style={styles.submitButton} onPress={sendReport}>
            <Text style={styles.submitText}>שלח</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={sendEmailWithImages}>
            <Text style={styles.submitText}>שלח מייל לחברה</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
  },
  sectionContent: {
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 10,
    maxHeight: 300,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    color: 'orange',
  },
  actionButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionButtonWithIcon: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonTextWithIcon: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: 'gray',
  },
  contactLabel: {
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  insuranceButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  insuranceText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    marginLeft: 10,
  },
  insuranceImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  scrollContainer: {
    maxHeight: 300, // גובה מרבי של האזור הנגלל
    paddingHorizontal: 10,
    marginTop: 10,
  },
  infoText: {
    color: 'white', 
    textAlign: 'right', 
    writingDirection: 'rtl', 
    fontSize: 16,
    marginBottom: 10,
},
});

export default IncidentReportScreen;
