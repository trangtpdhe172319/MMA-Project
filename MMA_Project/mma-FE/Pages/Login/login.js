import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { API_ROOT } from "../../utilities/constants";

const LoginForm = ({ navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Kiểm tra tài khoản đã đăng nhập
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const storedUserData = await AsyncStorage.getItem("userData");

        // console.log("Token từ AsyncStorage:", token);
        // console.log("Dữ liệu từ AsyncStorage:", storedUserData);

        if (token && storedUserData) {
          setIsLoggedIn(true);
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ AsyncStorage:", error);
      }
    };

    checkLoginStatus();
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email và mật khẩu là bắt buộc!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_ROOT}/auth/login`, {
        email,
        password,
      });

      console.log("Dữ liệu từ API:", response.data);

      const { token } = response.data;
      if (!token) throw new Error("Không có token trả về từ server!");

      const decodedUserData = jwtDecode(token);
      console.log("Dữ liệu giải mã JWT:", decodedUserData);

      // Lưu thông tin vào AsyncStorage
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(decodedUserData));

      // Kiểm tra ngay sau khi lưu
      const checkToken = await AsyncStorage.getItem("userToken");
      const checkUserData = await AsyncStorage.getItem("userData");
      console.log("Kiểm tra lại token:", checkToken);
      console.log("Kiểm tra lại userData:", checkUserData);

      setIsLoggedIn(true);
      setUserData(decodedUserData);

      Alert.alert(
        "Thành công",
        `Chào mừng, ${decodedUserData.fullName || decodedUserData.email}!`
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      let errorMessage = "Đã xảy ra lỗi server";

      if (error.response) {
        errorMessage =
          error.response.data.message || `Lỗi: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra mạng!";
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      Alert.alert("Lỗi", errorMessage);
    }

    setLoading(false);
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    Alert.alert("Đăng xuất", "Bạn đã đăng xuất thành công!");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://inkythuatso.com/uploads/thumbnails/800/2022/05/5516600-17-13-55-32.jpg",
      }}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Carcare</Text>
        <Text style={styles.premiumText}>PREMIUM</Text>
      </View>

      {error && <Text style={styles.errorMessage}>{error}</Text>}

      {isLoggedIn ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>
            Xin chào,{" "}
            {userData?.name?.trim()
              ? userData.fullName
              : userData?.fullName || "Người dùng"}
            !
          </Text>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: "#4CAF50",
                borderRadius: 10,
                padding: 12,
                elevation: 5,
              },
            ]}
            onPress={() => navigation.navigate("BookingHistoryScreen")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                { color: "white", fontWeight: "bold", fontSize: 16 },
              ]}
            >
              📅 Lịch sử đặt lịch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>ĐĂNG XUẤT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#A9A9A9"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#A9A9A9"
          />

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("RegisterForm")}>
            <Text style={styles.signupText}>
              Chưa có tài khoản? Đăng ký ngay
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A2E", // Màu nền tối để tăng độ tương phản
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFD700", // Màu vàng gold
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  premiumText: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "500",
  },
  input: {
    height: 50,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    borderColor: "#FFD700",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Hiệu ứng nổi trên Android
  },
  errorMessage: {
    color: "#FF4C4C",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 20,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 5,
    fontWeight: "500",
  },
  loginButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#FFD700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
  forgotPassword: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: "auto",
    marginBottom: 10,
    fontWeight: "500",
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#222831",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default LoginForm;
