import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Calendar from "expo-calendar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split(".").map(Number);
  if (!day || !month || !year || day > 31 || month > 12) {
    throw new Error("Invalid date format");
  }
  return new Date(year, month - 1, day);
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const addEventToCalendar = async (title, date) => {
  try {
    // בקשת הרשאות CALENDAR
    const { status: calendarStatus } = await Calendar.requestCalendarPermissionsAsync();
    if (calendarStatus !== "granted") {
      Alert.alert("שגיאה", "אין הרשאה לגשת ללוח השנה");
      return;
    }

    // בקשת הרשאות REMINDERS
    const { status: remindersStatus } = await Calendar.requestRemindersPermissionsAsync();
    if (remindersStatus !== "granted") {
      Alert.alert("שגיאה", "אין הרשאה להוספת תזכורות");
      return;
    }

    const calendars = await Calendar.getCalendarsAsync();
    //console.log("calendars --> ", calendars);
    const defaultCalendar = calendars.find(
      (cal) => cal.isPrimary || cal.title === "Calendar" || cal.source.name === "iCloud"
    );

    if (!defaultCalendar) {
      Alert.alert("שגיאה", "לא נמצא לוח שנה מתאים במכשיר");
      return;
    }

    await Calendar.createEventAsync(defaultCalendar.id, {
      title: title,
      startDate: date,
      endDate: new Date(date.getTime() + 60 * 60 * 1000), // שעה אחת
      timeZone: "UTC",
      notes: `תזכורת: ${title}`,
    });

    Alert.alert("האירוע נוסף בהצלחה ללוח השנה");
  } catch (error) {
    Alert.alert("שגיאה", "שגיאה בהוספת האירוע ללוח השנה");
    console.error(error);
  }
};


const NotificationsManagement = () => {
  const [lastServiceDate150, setLastServiceDate150] = useState("");
  const [lastServiceDate30, setLastServiceDate30] = useState("");
  const [driverLicenseDate, setDriverLicenseDate] = useState("");
  const [tireChangeDate, setTireChangeDate] = useState("");
  const [annualTestDate, setAnnualTestDate] = useState(""); // חדש
  const [customNote, setCustomNote] = useState("");
  const [customAlertDate, setCustomAlertDate] = useState("");
  const [notificationsList, setNotificationsList] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("שגיאה", "אין הרשאה להתראות");
      }
    };
    requestPermissions();
  }, []);

  const scheduleNotification = async (title, body, triggerDate) => {
    try {
      if (isNaN(triggerDate.getTime())) {
        throw new Error("Invalid date");
      }
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: { date: triggerDate },
      });

      setNotificationsList((prev) => [
        ...prev,
        { id: notificationId, title, body, triggerDate },
      ]);
      Alert.alert("התראה תוזמנה בהצלחה");
    } catch (error) {
      Alert.alert("שגיאה", "שגיאה בתזמון ההתראה");
      console.error(error);
    }
  };

  const handleSetNotification = (type) => {
    let triggerDate;
    let title, body;

    try {
      switch (type) {
        case "service150":
          if (!lastServiceDate150) {
            return Alert.alert("שגיאה", "אנא הזן תאריך לטיפול 150 אלף");
          }
          triggerDate = parseDate(lastServiceDate150);
          triggerDate.setFullYear(triggerDate.getFullYear() + 1);
          title = "טיפול 150 אלף";
          body = "הגיע הזמן לטיפול 150 אלף";
          break;

        case "service30":
          if (!lastServiceDate30) {
            return Alert.alert("שגיאה", "אנא הזן תאריך לטיפול 30 אלף");
          }
          triggerDate = parseDate(lastServiceDate30);
          triggerDate.setFullYear(triggerDate.getFullYear() + 1);
          title = "טיפול 30 אלף";
          body = "הגיע הזמן לטיפול 30 אלף";
          break;

        case "driverLicense":
          if (!driverLicenseDate) {
            return Alert.alert("שגיאה", "אנא הזן תאריך רישיון נהיגה");
          }
          triggerDate = parseDate(driverLicenseDate);
          triggerDate.setFullYear(triggerDate.getFullYear() + 5);
          title = "רישיון נהיגה";
          body = "הרישיון שלך עומד לפוג";
          break;

        case "tireReplacement":
          if (!tireChangeDate) {
            return Alert.alert("שגיאה", "אנא הזן תאריך להחלפת גלגלים");
          }
          triggerDate = parseDate(tireChangeDate);
          triggerDate.setFullYear(triggerDate.getFullYear() + 3);
          title = "החלפת גלגלים";
          body = "הגיע הזמן להחליף גלגלים";
          break;

        case "winterCheck":
          triggerDate = new Date(new Date().setMonth(new Date().getMonth() + 3));
          title = "בדיקת חורף";
          body = "בדוק לחץ אוויר בגלגלים לחורף";
          break;

          case "annualTest":
            if (!annualTestDate) {
              return Alert.alert("שגיאה", "אנא הזן תאריך לטסט השנתי");
            }
            triggerDate = parseDate(annualTestDate);
            triggerDate.setFullYear(triggerDate.getFullYear() + 1);
            title = "טסט שנתי";
            body = "הגיע הזמן לטסט השנתי";
            break;

        case "monthlyCheck":
          triggerDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
          title = "בדיקת שמן ומים";
          body = "בדוק שמן ומים במנוע";
          break;

        case "customNotification":
          if (!customAlertDate || !customNote) {
            return Alert.alert("שגיאה", "אנא הזן תאריך והתראה מותאמת אישית");
          }
          triggerDate = parseDate(customAlertDate);
          title = "התראה מותאמת אישית";
          body = customNote;
          break;

        default:
          return Alert.alert("שגיאה", "אנא בחר התראה תקינה");
      }

      scheduleNotification(title, body, triggerDate);
      addEventToCalendar(title, triggerDate);
    } catch (error) {
      Alert.alert("שגיאה", "אנא הזן תאריך תקין בפורמט dd.mm.yyyy");
    }
  };

  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setNewDate(formatDate(new Date(notification.triggerDate)));
  };

  const saveEditedNotification = () => {
    try {
      const updatedTriggerDate = parseDate(newDate);
      const updatedNotifications = notificationsList.map((notif) =>
        notif.id === editingNotification.id
          ? { ...notif, triggerDate: updatedTriggerDate }
          : notif
      );

      setNotificationsList(updatedNotifications);
      setEditingNotification(null);
      setNewDate("");
      Alert.alert("התראה עודכנה בהצלחה");
    } catch (error) {
      Alert.alert("שגיאה", "אנא הזן תאריך תקין בפורמט dd.mm.yyyy");
    }
  };

  const handleDeleteNotification = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    setNotificationsList((prev) => prev.filter((notif) => notif.id !== id));
    Alert.alert("התראה נמחקה בהצלחה");
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>שם התראה: {item.title}</Text>
      <Text style={styles.notificationText}>
        תאריך התראה: {formatDate(new Date(item.triggerDate))}
      </Text>
      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditNotification(item)}
        >
          <Text style={styles.buttonText}>ערוך</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(item.id)}
        >
          <Text style={styles.buttonText}>מחק</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>דף ניהול התראות</Text>

      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => setShowNotificationsModal(true)}
      >
        <Text style={styles.buttonText}>התראות פעילות</Text>
      </TouchableOpacity>

      {[
        { type: "service150", title: "טיפול 150 אלף", state: lastServiceDate150, setState: setLastServiceDate150 },
        { type: "service30", title: "טיפול 30 אלף", state: lastServiceDate30, setState: setLastServiceDate30 },
        { type: "driverLicense", title: "רישיון נהיגה", state: driverLicenseDate, setState: setDriverLicenseDate },
        { type: "tireReplacement", title: "החלפת גלגלים", state: tireChangeDate, setState: setTireChangeDate },
        { type: "winterCheck", title: "בדיקת חורף", state: "", setState: null },
        { type: "monthlyCheck", title: "בדיקת שמן ומים", state: "", setState: null },
        { type: "annualTest", title: "טסט שנתי", state: annualTestDate, setState: setAnnualTestDate }, 
        { type: "customNotification", title: "התראה מותאמת אישית", state: customAlertDate, setState: setCustomAlertDate },
      ].map(({ type, title, state, setState }) => (
        <View style={styles.block} key={type}>
          <Text style={styles.blockTitle}>{title}</Text>
          {setState && (
            <TextInput
              style={styles.input}
              value={state}
              placeholder="בחר תאריך (dd.mm.yyyy)"
              onChangeText={setState}
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSetNotification(type)}
          >
            <Text style={styles.buttonText}>הפעל</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal visible={showNotificationsModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>התראות פעילות</Text>
          <FlatList
            data={notificationsList}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
          />
          {editingNotification && (
            <View style={styles.editSection}>
              <TextInput
                style={styles.input}
                value={newDate}
                placeholder="תאריך חדש (dd.mm.yyyy)"
                onChangeText={setNewDate}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveEditedNotification}
              >
                <Text style={styles.buttonText}>שמור</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowNotificationsModal(false)}
          >
            <Text style={styles.buttonText}>סגור</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", color: "purple", textAlign: "center" },
  block: { backgroundColor: "purple", padding: 20, borderRadius: 8, marginBottom: 10 },
  blockTitle: { fontSize: 18, color: "white", marginBottom: 5 },
  input: { backgroundColor: "white", borderRadius: 5, padding: 10, marginBottom: 5 },
  button: { backgroundColor: "green", borderRadius: 5, padding: 10 },
  buttonText: { color: "white", textAlign: "center" },
  manageButton: { backgroundColor: "orange", padding: 12, marginVertical: 20 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: "white" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "purple", marginBottom: 50 },
  notificationItem: { backgroundColor: "lightgray", borderRadius: 5, padding: 10, marginBottom: 10 },
  notificationText: { fontSize: 16, marginBottom: 5 },
  notificationActions: { flexDirection: "row", justifyContent: "space-between" },
  editButton: { backgroundColor: "blue", padding: 10, borderRadius: 5 },
  deleteButton: { backgroundColor: "red", padding: 10, borderRadius: 5 },
  editSection: { marginTop: 20 },
  saveButton: { backgroundColor: "green", padding: 10, borderRadius: 5, marginTop: 10 },
  closeButton: { backgroundColor: "red", padding: 10, borderRadius: 5, marginTop: 10 },
});

export default NotificationsManagement;
