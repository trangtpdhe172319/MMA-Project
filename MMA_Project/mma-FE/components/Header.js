import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Menu, Divider, Provider } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

export default function Header({ title }) {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <Provider>
      {" "}
      {/* Bọc Provider ở đây */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>

        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setVisible(true)}>
              <FontAwesome name="user-circle" size={28} color="white" />
            </TouchableOpacity>
          }
          contentStyle={styles.menu}
        >
          <Menu.Item
            onPress={() => navigation.navigate("BookingHistory")}
            title="Lịch sử đặt lịch"
          />
          <Divider />
          <Menu.Item onPress={() => alert("Đăng xuất")} title="Đăng xuất" />
        </Menu>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 100, // Giảm chiều cao xuống
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center", // Căn giữa theo chiều dọc
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 50, // Tránh che trên iOS
    elevation: 4, // Đổ bóng trên Android
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 4,
  },
});
