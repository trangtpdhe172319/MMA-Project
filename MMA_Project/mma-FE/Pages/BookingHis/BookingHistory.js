import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fetchBookings } from "../../apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingHistoryList = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const filterOptions = [
    "Tất cả",
    "Hoàn thành",
    "Đang chờ",
    "Đã hủy",
    "Đã xuất hóa đơn",
  ];

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const rawUserData = await AsyncStorage.getItem("userData");
        if (!rawUserData)
          throw new Error("Không tìm thấy thông tin người dùng");

        const storedUserData = JSON.parse(rawUserData);
        if (!storedUserData?.userId)
          throw new Error("ID người dùng không hợp lệ");

        setUserId(storedUserData.userId);

        const data = await fetchBookings();
        // Lọc theo userId nếu cần thiết
        const filteredData = data.filter(
          (booking) => booking.customerId === storedUserData.userId
        );
        setBookings(filteredData);
      } catch (error) {
        Alert.alert("Lỗi", error.message);
        console.error("Chi tiết lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Format date cho hiển thị
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Lấy màu hiển thị dựa theo trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "Pending":
        return "#FF9800";
      case "Cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  // Dịch trạng thái sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "Completed":
        return "Hoàn thành";
      case "Pending":
        return "Đang chờ";
      case "Cancelled":
        return "Đã hủy";
      case "Billed":
        return "Đã xuất hóa đơn";
      default:
        return status;
    }
  };

  // Render từng item đặt lịch
  const renderBookingItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate("BookingDetail", { id: item._id })}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.dateText}>
          {format(new Date(item.bookingDate.date), "dd/MM/yyyy")}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="access-time" size={16} color="#666" />
        <Text style={styles.infoText}>{item.bookingDate.timeSlot}</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="build" size={16} color="#666" />
        <Text style={styles.infoText}>{item.service.join(", ")}</Text>
      </View>
    </TouchableOpacity>
  );

  // Component hiển thị FilterChip
  const FilterChip = ({ label, active, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.activeFilterChip]}
      onPress={onPress}
    >
      <Text
        style={[styles.filterChipText, active && styles.activeFilterChipText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Lọc booking theo userId và trạng thái đã chọn
  const filteredBookings = bookings.filter((booking) => {
    return (
      booking.customerId === userId &&
      (activeFilter === "Tất cả" ||
        getStatusText(booking.status) === activeFilter)
    );
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A59FE" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đặt lịch</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={[
            styles.filterScrollContent,
            { flexDirection: "row", alignItems: "center" },
          ]}
          showsHorizontalScrollIndicator={false}
        >
          {filterOptions.map((option) => (
            <FilterChip
              key={option}
              label={option}
              active={activeFilter === option}
              onPress={() => setActiveFilter(option)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item._id.$oid}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5", // nền xám nhạt tạo cảm giác hiện đại
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterScrollContent: {
    paddingHorizontal: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#26a69a",
  },
  filterChipText: {
    color: "#666",
    fontSize: 14,
  },
  activeFilterChipText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookingHistoryList;
