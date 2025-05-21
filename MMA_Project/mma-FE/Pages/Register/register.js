import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_ROOT } from "../../utilities/constants";

const RegisterForm = ({ navigation: propNavigation }) => {
  const navigation = propNavigation || useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vehicles, setVehicles] = useState([
    { licensePlate: "", brand: "", model: "", year: "", color: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedVehicles, setExpandedVehicles] = useState([0]); // Initially expand first vehicle

  // Xử lý thay đổi thông tin xe
  const handleVehicleChange = (index, key, value) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][key] = value;
    setVehicles(updatedVehicles);
  };

  // Thêm một xe mới vào danh sách
  const addVehicle = () => {
    const newIndex = vehicles.length;
    setVehicles([
      ...vehicles,
      { licensePlate: "", brand: "", model: "", year: "", color: "" },
    ]);
    // Auto expand newly added vehicle
    setExpandedVehicles([...expandedVehicles, newIndex]);
  };

  // Xóa xe khỏi danh sách
  const removeVehicle = (index) => {
    if (vehicles.length === 1) {
      Alert.alert("Thông báo", "Bạn cần có ít nhất 1 xe");
      return;
    }

    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);

    // Update expanded vehicles
    setExpandedVehicles(
      expandedVehicles
        .filter((i) => i !== index)
        .map((i) => (i > index ? i - 1 : i))
    );
  };

  // Toggle vehicle details expansion
  const toggleVehicleExpand = (index) => {
    if (expandedVehicles.includes(index)) {
      setExpandedVehicles(expandedVehicles.filter((i) => i !== index));
    } else {
      setExpandedVehicles([...expandedVehicles, index]);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async () => {
    // Existing validation code...
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ!");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ (cần 10 chữ số)!");
      return;
    }

    // Kiểm tra biển số không được để trống
    for (let vehicle of vehicles) {
      if (!vehicle.licensePlate) {
        setError("Biển số xe không được để trống!");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_ROOT}/auth/register`, {
        fullName,
        email,
        phone,
        password,
        role: "customer", // Mặc định là khách hàng
        vehicles,
      });

      console.log("Phản hồi từ API:", response.data);

      Alert.alert(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
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

  // Render a single vehicle card
  const renderVehicleCard = (vehicle, index) => {
    const isExpanded = expandedVehicles.includes(index);

    return (
      <View key={index} style={styles.vehicleCard}>
        <TouchableOpacity
          style={styles.vehicleHeader}
          onPress={() => toggleVehicleExpand(index)}
        >
          <View style={styles.vehicleHeaderContent}>
            <Text style={styles.vehicleTitle}>
              {vehicle.licensePlate
                ? `Xe ${index + 1}: ${vehicle.licensePlate}`
                : `Xe ${index + 1}`}
            </Text>
            {vehicle.brand && (
              <Text style={styles.vehicleSubtitle}>
                {`${vehicle.brand} ${vehicle.model || ""} ${
                  vehicle.color || ""
                }`}
              </Text>
            )}
          </View>
          <View style={styles.vehicleActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeVehicle(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
            </TouchableOpacity>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#FFD700"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.vehicleDetails}>
            <TextInput
              style={styles.vehicleInput}
              placeholder="Biển số xe *"
              value={vehicle.licensePlate}
              onChangeText={(value) =>
                handleVehicleChange(index, "licensePlate", value)
              }
            />
            <TextInput
              style={styles.vehicleInput}
              placeholder="Hãng xe"
              value={vehicle.brand}
              onChangeText={(value) =>
                handleVehicleChange(index, "brand", value)
              }
            />
            <TextInput
              style={styles.vehicleInput}
              placeholder="Mẫu xe"
              value={vehicle.model}
              onChangeText={(value) =>
                handleVehicleChange(index, "model", value)
              }
            />
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.vehicleInput, styles.halfInput]}
                placeholder="Năm SX"
                value={vehicle.year}
                onChangeText={(value) =>
                  handleVehicleChange(index, "year", value)
                }
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.vehicleInput, styles.halfInput]}
                placeholder="Màu xe"
                value={vehicle.color}
                onChangeText={(value) =>
                  handleVehicleChange(index, "color", value)
                }
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={{
        uri: "https://inkythuatso.com/uploads/thumbnails/800/2022/05/5516600-17-13-55-32.jpg",
      }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Carcare</Text>
          <Text style={styles.premiumText}>PREMIUM</Text>
        </View>

        <Text style={styles.titleText}>Đăng ký tài khoản</Text>

        {error && <Text style={styles.errorMessage}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.vehicleSectionHeader}>
          <Text style={styles.subTitleText}>Thông tin xe</Text>
          <Text style={styles.requiredNote}>* Bắt buộc</Text>
        </View>

        <View style={styles.vehicleList}>
          {vehicles.map((vehicle, index) => renderVehicleCard(vehicle, index))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addVehicle}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Thêm xe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập ngay</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
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
    elevation: 5,
  },
  vehicleSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
  },
  subTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
  },
  requiredNote: {
    fontSize: 14,
    color: "#FF4C4C",
    fontStyle: "italic",
  },
  vehicleList: {
    width: "90%",
    marginBottom: 10,
  },
  vehicleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
  },
  vehicleHeaderContent: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  vehicleActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginRight: 15,
    padding: 5,
  },
  vehicleDetails: {
    padding: 12,
  },
  vehicleInput: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 15,
    color: "#333",
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginTop: 5,
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  errorMessage: {
    color: "#FF4C4C",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 8,
    borderRadius: 5,
    width: "90%",
  },
  registerButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  loginText: {
    color: "#FFD700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});

export default RegisterForm;
