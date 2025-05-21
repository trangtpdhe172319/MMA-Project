import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { API_ROOT } from "../utilities/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BookingScreen = () => {
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nearbyGarages, setNearbyGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [loadingGarages, setLoadingGarages] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);

  const services = [
    "Rửa xe",
    "Thay dầu máy",
    "Thay dầu phanh",
    "Cân chỉnh thước lái",
    "Thay lốp",
    "Bảo dưỡng hệ thống lạnh",
    "Sửa chữa hộp số",
    "Kiểm tra tổng quát",
  ];

  // Get user data from AsyncStorage when component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        console.log("checkdatabooing", userDataString);

        if (userDataString) {
          const parsedUserData = JSON.parse(userDataString);

          // Set user information from AsyncStorage to state
          if (parsedUserData.userId) setCustomerId(parsedUserData.userId);
          if (parsedUserData.fullName) setCustomerName(parsedUserData.fullName);
          if (parsedUserData.phone) setCustomerPhone(parsedUserData.phone);
          if (parsedUserData.email) setCustomerEmail(parsedUserData.email);

          // Save the full userData for potential future use
          setUserData(parsedUserData);
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    getUserData();
  }, []);

  // Hàm lấy vị trí hiện tại của người dùng
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền truy cập vị trí để tìm gara gần đây."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      return location.coords;
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy vị trí hiện tại. Vui lòng thử lại sau!"
      );
      return null;
    }
  };

  // Hàm lấy danh sách gara gần đây
  const fetchNearbyGarages = async (coords = null) => {
    try {
      setLoadingGarages(true);

      let latitude, longitude;

      if (coords) {
        latitude = coords.latitude;
        longitude = coords.longitude;
      } else if (userLocation) {
        latitude = userLocation.latitude;
        longitude = userLocation.longitude;
      } else {
        // Sử dụng tọa độ mặc định nếu không có vị trí người dùng
        latitude = 21.028511;
        longitude = 105.804817;
      }

      // Thay đổi URL từ localhost thành IP của máy bạn hoặc URL server thật
      // Lưu ý: localhost trên thiết bị di động sẽ không trỏ đến máy tính của bạn
      const response = await fetch(
        `${API_ROOT}/garages?lat=${latitude}&lon=${longitude}`
      );
      console.log(latitude, longitude);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Kiểm tra để đảm bảo data là một mảng
      if (Array.isArray(data)) {
        // Đảm bảo mỗi gara có một ID duy nhất
        const garagesWithIds = data.map((garage, index) => ({
          ...garage,
          id: garage.id || `garage-${index}`, // Sử dụng ID hiện có hoặc tạo mới
        }));
        setNearbyGarages(garagesWithIds);
      } else if (data && typeof data === "object") {
        // Nếu data là một object có property là mảng garages
        if (Array.isArray(data.garages)) {
          const garagesWithIds = data.garages.map((garage, index) => ({
            ...garage,
            id: garage.id || `garage-${index}`,
          }));
          setNearbyGarages(garagesWithIds);
        } else if (data.data && Array.isArray(data.data)) {
          // Trường hợp API trả về dữ liệu trong property data
          const garagesWithIds = data.data.map((garage, index) => ({
            ...garage,
            id: garage.id || `garage-${index}`,
          }));
          setNearbyGarages(garagesWithIds);
        } else {
          // Nếu không tìm thấy mảng, tạo một mảng từ các thuộc tính của object
          console.warn(
            "API response is not an array. Converting to array:",
            data
          );
          const garagesArray = Object.values(data).filter(
            (item) => typeof item === "object"
          );
          const garagesWithIds = garagesArray.map((garage, index) => ({
            ...garage,
            id: garage.id || `garage-${index}`,
          }));
          setNearbyGarages(garagesWithIds.length > 0 ? garagesWithIds : []);
        }
      } else {
        console.error("API did not return valid garage data:", data);
        setNearbyGarages([]);
      }

      setLoadingGarages(false);
    } catch (error) {
      console.error("Error fetching nearby garages:", error);
      setNearbyGarages([]);
      setLoadingGarages(false);
      Alert.alert(
        "Lỗi",
        "Không thể lấy danh sách gara gần đây. Vui lòng thử lại sau!"
      );
    }
  };

  // Lấy vị trí và danh sách gara khi component được mount
  useEffect(() => {
    const initLocation = async () => {
      const coords = await getUserLocation();
      if (coords) {
        fetchNearbyGarages(coords);
      } else {
        fetchNearbyGarages();
      }
    };

    initLocation();
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  };

  // Hàm để toggle dịch vụ (chọn hoặc bỏ chọn)
  const toggleService = (service) => {
    setSelectedServices((prevServices) => {
      if (prevServices.includes(service)) {
        // Nếu dịch vụ đã được chọn, bỏ chọn nó
        return prevServices.filter((s) => s !== service);
      } else {
        // Nếu dịch vụ chưa được chọn, thêm vào danh sách
        return [...prevServices, service];
      }
    });
  };

  const handleCreateBooking = async () => {
    if (
      !customerName ||
      !customerPhone ||
      selectedServices.length === 0 ||
      !selectedGarage
    ) {
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin bắt buộc, chọn ít nhất một dịch vụ và chọn gara!"
      );
      return;
    }

    try {
      setLoading(true);

      // Định dạng ngày: YYYY-MM-DD
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // Định dạng thời gian: HH:MM - (HH+1):MM
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeSlot = `${hours}:${formattedMinutes} - ${
        hours + 1
      }:${formattedMinutes}`;

      // Đảm bảo selectedGarage có ID hợp lệ
      if (!selectedGarage || !selectedGarage.id) {
        Alert.alert("Thông báo", "Vui lòng chọn một gara hợp lệ!");
        setLoading(false);
        return;
      }

      const bookingData = {
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        service: selectedServices,
        bookingDate: {
          date: formattedDate,
          timeSlot: timeSlot,
        },
        cancelReason: "",
        garageId: selectedGarage._id, // ID của gara đã chọn
      };

      // Add userId from userData if available
      if (userData && userData.userId) {
        bookingData.userId = userData.userId;
      }

      const response = await fetch(`${API_ROOT}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      console.log("With booking data:", JSON.stringify(bookingData));

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error details:", errorText);
        throw new Error(
          `Server responded with status: ${response.status}. Details: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Server response:", result);

      setLoading(false);
      Alert.alert(
        "Thành công",
        "Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.",
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form but keep customer info
              setSelectedServices([]);
              setDate(new Date());
              setTime(new Date());
              setSelectedGarage(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error creating booking:", error);
      setLoading(false);
      Alert.alert(
        "Lỗi",
        `Đã xảy ra lỗi khi đặt lịch: ${error.message}. Vui lòng thử lại sau!`
      );
    }
  };

  // Hiển thị khoảng cách
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Làm mới danh sách gara
  const refreshGarages = async () => {
    const coords = await getUserLocation();
    fetchNearbyGarages(coords);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Thông tin khách hàng</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Họ và tên <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#8A94A6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              value={customerName}
              onChangeText={setCustomerName}
              editable={!userData} // Make field non-editable if userData exists
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#8A94A6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              editable={!userData} // Make field non-editable if userData exists
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#8A94A6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              keyboardType="email-address"
              value={customerEmail}
              onChangeText={setCustomerEmail}
              editable={!userData} // Make field non-editable if userData exists
            />
          </View>
        </View>

        <View style={styles.stepIndicator}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Chọn gara gần đây</Text>
        </View>

        <View style={styles.garageRefreshContainer}>
          <Text style={styles.label}>
            Chọn gara <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshGarages}
          >
            <Ionicons name="refresh-outline" size={18} color="#FF6B6B" />
            <Text style={styles.refreshText}>Làm mới</Text>
          </TouchableOpacity>
        </View>

        {loadingGarages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Đang tìm gara gần đây...</Text>
          </View>
        ) : nearbyGarages.length === 0 ? (
          <View style={styles.noGaragesContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF6B6B" />
            <Text style={styles.noGaragesText}>
              Không tìm thấy gara nào gần đây!
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refreshGarages}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.garagesContainer}>
            {nearbyGarages.map((garage, index) => (
              <TouchableOpacity
                key={garage.id || index}
                style={[
                  styles.garageItem,
                  selectedGarage &&
                    selectedGarage.id === garage.id &&
                    styles.garageItemSelected,
                ]}
                onPress={() => {
                  // Chỉ chọn một gara duy nhất
                  setSelectedGarage(garage);
                  console.log("Selected garage:", garage.id);
                }}
              >
                <View style={styles.garageInfoContainer}>
                  <View style={styles.garageImageContainer}>
                    {garage.image ? (
                      <Image
                        source={{ uri: garage.image }}
                        style={styles.garageImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.garageImagePlaceholder}>
                        <Ionicons
                          name="car-outline"
                          size={24}
                          color="#8A94A6"
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.garageDetails}>
                    <Text style={styles.garageName}>
                      {garage.name || "Gara không tên"}
                    </Text>
                    <View style={styles.garageAddressRow}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#8A94A6"
                      />
                      <Text style={styles.garageAddress} numberOfLines={2}>
                        {garage.address || "Không có địa chỉ"}
                      </Text>
                    </View>
                    {garage.distance !== undefined && (
                      <View style={styles.garageDistanceRow}>
                        <Ionicons
                          name="navigate-outline"
                          size={14}
                          color="#8A94A6"
                        />
                        <Text style={styles.garageDistance}>
                          {formatDistance(garage.distance)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.garageRatingRow}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.garageRating}>
                        {garage.rating || "N/A"}{" "}
                        {garage.ratingCount && `(${garage.ratingCount})`}
                      </Text>
                    </View>
                  </View>
                </View>
                {selectedGarage && selectedGarage.id === garage.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#FF6B6B"
                    style={styles.garageSelectedIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.stepIndicator}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepTitle}>Chọn dịch vụ</Text>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={styles.label}>
            Chọn dịch vụ <Text style={styles.required}>*</Text>
            <Text style={styles.serviceHelper}> (Có thể chọn nhiều)</Text>
          </Text>
          {services.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.serviceOption,
                selectedServices.includes(item) && styles.serviceOptionSelected,
              ]}
              onPress={() => toggleService(item)}
            >
              <Text
                style={[
                  styles.serviceOptionText,
                  selectedServices.includes(item) &&
                    styles.serviceOptionTextSelected,
                ]}
              >
                {item}
              </Text>
              {selectedServices.includes(item) && (
                <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.stepIndicator}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <Text style={styles.stepTitle}>Chọn thời gian</Text>
        </View>

        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={styles.dateTimePicker}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#8A94A6"
              style={styles.inputIcon}
            />
            <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimePicker}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color="#8A94A6"
              style={styles.inputIcon}
            />
            <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <View style={styles.noteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#FF6B6B"
          />
          <Text style={styles.noteText}>
            Lưu ý: Garage mở cửa từ 8:00 - 18:00 hàng ngày. Vui lòng đặt lịch
            trước ít nhất 24 giờ.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookingButton,
            loading && styles.bookingButtonDisabled,
          ]}
          onPress={handleCreateBooking}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.bookingButtonText}>Đang xử lý...</Text>
          ) : (
            <Text style={styles.bookingButtonText}>Đặt lịch ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  content: {
    padding: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumber: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 8,
  },
  required: {
    color: "#FF6B6B",
  },
  serviceHelper: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#8A94A6",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: "#4A4A4A",
  },
  // Styles cho danh sách gara
  garageRefreshContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  refreshText: {
    color: "#FF6B6B",
    marginLeft: 4,
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    color: "#4A4A4A",
    fontSize: 14,
  },
  noGaragesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
  },
  noGaragesText: {
    marginTop: 12,
    marginBottom: 16,
    color: "#4A4A4A",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  garagesContainer: {
    marginBottom: 16,
  },
  garageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    padding: 12,
  },
  garageItemSelected: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF0F0",
  },
  garageInfoContainer: {
    flexDirection: "row",
    flex: 1,
  },
  garageImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  garageImage: {
    width: "100%",
    height: "100%",
  },
  garageImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E4EC",
    justifyContent: "center",
    alignItems: "center",
  },
  garageDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  garageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A4A",
    marginBottom: 4,
  },
  garageAddressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  garageAddress: {
    fontSize: 12,
    color: "#8A94A6",
    marginLeft: 4,
    flex: 1,
  },
  garageDistanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  garageDistance: {
    fontSize: 12,
    color: "#8A94A6",
    marginLeft: 4,
  },
  garageRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  garageRating: {
    fontSize: 12,
    color: "#8A94A6",
    marginLeft: 4,
  },
  garageSelectedIcon: {
    marginLeft: 8,
  },
  // Styles hiện có
  servicesContainer: {
    marginBottom: 16,
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  serviceOptionSelected: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF0F0",
  },
  serviceOptionText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
  serviceOptionTextSelected: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateTimePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    padding: 12,
    width: "48%",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
  noteContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  noteText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginLeft: 12,
    flex: 1,
  },
  bookingButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  bookingButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  bookingButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;
