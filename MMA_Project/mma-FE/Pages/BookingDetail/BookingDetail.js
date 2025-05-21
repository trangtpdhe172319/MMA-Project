import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fetchBookings } from "../../apis";

const BookingDetail = ({ route, navigation }) => {
  const { id } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data = await fetchBookings();
        const foundBooking = data.find(
          (b) => b._id === id || (b._id && b._id.$oid === id)
        );
        if (!foundBooking) {
          Alert.alert("Lỗi", "Không tìm thấy thông tin đơn đặt lịch");
        }
        setBooking(foundBooking);
      } catch (error) {
        Alert.alert("Lỗi", error.message);
        console.error("Chi tiết lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const formatDateTime = (dateInput) => {
    try {
      const date =
        typeof dateInput === "object" && dateInput.$date
          ? new Date(dateInput.$date)
          : new Date(dateInput);
      return format(date, "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateInput;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin đơn đặt lịch.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đặt lịch</Text>
      </View>
      <View style={styles.content}>
        <DetailRow
          icon="calendar-today"
          label="Ngày đặt:"
          value={
            booking.bookingDate && booking.bookingDate.date
              ? format(new Date(booking.bookingDate.date), "dd/MM/yyyy")
              : ""
          }
        />
        <DetailRow
          icon="access-time"
          label="Khung giờ:"
          value={booking.bookingDate && booking.bookingDate.timeSlot}
        />
        <DetailRow
          icon="build"
          label="Dịch vụ:"
          value={booking.service ? booking.service.join(", ") : ""}
        />
        <DetailRow icon="person" label="Khách hàng:" value={booking.customerName} />
        <DetailRow icon="phone" label="SĐT:" value={booking.customerPhone} />
        <DetailRow icon="email" label="Email:" value={booking.customerEmail} />
        <DetailRow
          icon="info"
          label="Trạng thái:"
          value={
            booking.status === "Billed"
              ? "Đã xuất hóa đơn"
              : booking.status === "Cancelled"
              ? "Đã hủy"
              : booking.status
          }
        />
        {booking.status === "Cancelled" && booking.cancelReason && (
          <DetailRow icon="cancel" label="Lý do hủy:" value={booking.cancelReason} />
        )}
        <DetailRow
          icon="date-range"
          label="Ngày tạo:"
          value={booking.createdAt ? formatDateTime(booking.createdAt) : ""}
        />
        <DetailRow
          icon="update"
          label="Cập nhật:"
          value={booking.updatedAt ? formatDateTime(booking.updatedAt) : ""}
        />
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <MaterialIcons name={icon} size={24} color="#6200ea" style={styles.rowIcon} />
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Nền xám nhạt tạo cảm giác hiện đại
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ea", // Màu chủ đạo
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rowIcon: {
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200ea",
    width: 130,
  },
  rowValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#F44336",
  },
});

export default BookingDetail;
