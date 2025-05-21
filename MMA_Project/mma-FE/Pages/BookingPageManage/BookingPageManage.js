import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import {
  fetchBookings,
  updateBooking,
  fetchServiceByName,
  createBill,
  fetchAllServices,
  updateScheduleSlot,
} from "../../apis";
import BookingCard from "./BookingCard";
import BookingTable from "./BookingTable";
import CancelModal from "./CancelModal";
import BillModal from "./BillModal";
import { useWindowDimensions } from "react-native";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [billServices, setBillServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const garageId = "65a4c1e2f4d2b41234abcd10";
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách booking:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách đặt lịch");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();

    // Fetch all services for the bill modal
    const loadAllServices = async () => {
      try {
        const data = await fetchAllServices();
        setAllServices(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    loadAllServices();
  }, []);

  const handleUpdateStatus = async (booking, newStatus) => {
    try {
      const updatedBooking = await updateBooking(booking._id, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? updatedBooking : b))
      );
      const data = {
        date: booking.bookingDate.date,
        slot: booking.bookingDate.timeSlot,
        status: "Booked",
        bookingId: booking._id,
      };

      await updateScheduleSlot(garageId, data);
    } catch (error) {
      console.error("Lỗi khi cập nhật booking:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || !cancelReason) return;
    try {
      // Tìm booking cần hủy
      const bookingToCancel = bookings.find(
        (b) => b._id === selectedBooking._id
      );

      if (!bookingToCancel) {
        console.error("Lỗi: Không tìm thấy booking để hủy");
        return;
      }

      // Gửi yêu cầu cập nhật trạng thái booking
      const updatedBooking = await updateBooking(selectedBooking._id, {
        status: "Cancelled",
        cancelReason,
      });

      // Cập nhật danh sách bookings trong state
      setBookings((prev) =>
        prev.map((b) => (b._id === selectedBooking._id ? updatedBooking : b))
      );

      // Kiểm tra nếu booking có trạng thái Confirmed hoặc Pending, cập nhật lịch
      if (
        (bookingToCancel.status === "Confirmed" ||
          bookingToCancel.status === "Pending") &&
        bookingToCancel.bookingDate &&
        bookingToCancel.bookingDate.date
      ) {
        const slotData = {
          date: bookingToCancel.bookingDate.date,
          slot: bookingToCancel.bookingDate.timeSlot,
          status: "Available",
          bookingId: null,
        };

        await updateScheduleSlot(garageId, slotData);
      }

      // Reset state sau khi hủy
      setSelectedBooking(null);
      setCancelReason("");
      setShowCancelModal(false);
    } catch (error) {
      console.error("Lỗi khi hủy booking:", error);
      Alert.alert("Lỗi", "Không thể hủy đặt lịch");
    }
  };

  const prepareBill = async (booking) => {
    setSelectedBooking(booking);
    try {
      // Lấy thông tin chi tiết của các dịch vụ từ booking
      const serviceDetails = await Promise.all(
        booking.service.map(async (serviceName) => {
          const service = await fetchServiceByName(serviceName);
          return {
            ...service,
            quantity: 1,
          };
        })
      );

      setBillServices(serviceDetails);
      calculateTotal(serviceDetails);
      setShowBillModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin dịch vụ:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin dịch vụ");
    }
  };

  const calculateTotal = (services) => {
    const total = services.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedServices = [...billServices];
    updatedServices[index].quantity = Math.max(1, newQuantity);
    setBillServices(updatedServices);
    calculateTotal(updatedServices);
  };

  const handleRemoveService = (index) => {
    const updatedServices = billServices.filter((_, i) => i !== index);
    setBillServices(updatedServices);
    calculateTotal(updatedServices);
  };

  const handleAddService = (serviceId) => {
    if (!serviceId) return;

    const serviceToAdd = allServices.find((s) => s._id === serviceId);
    if (serviceToAdd) {
      // Kiểm tra xem dịch vụ đã có trong bill chưa
      const existingIndex = billServices.findIndex(
        (s) => s._id === serviceToAdd._id
      );

      if (existingIndex !== -1) {
        // Nếu đã có, tăng số lượng
        const updatedServices = [...billServices];
        updatedServices[existingIndex].quantity += 1;
        setBillServices(updatedServices);
        calculateTotal(updatedServices);
      } else {
        // Nếu chưa có, thêm mới với số lượng 1
        const newServices = [...billServices, { ...serviceToAdd, quantity: 1 }];
        setBillServices(newServices);
        calculateTotal(newServices);
      }
    }
  };

  const handleSaveBill = async () => {
    try {
      const billData = {
        bookingId: selectedBooking._id,
        customerId: selectedBooking.customerId,
        customerName: selectedBooking.customerName,
        customerPhone: selectedBooking.customerPhone,
        customerEmail: selectedBooking.customerEmail,
        services: billServices.map((service) => ({
          serviceId: service._id,
          name: service.name,
          price: service.price,
          quantity: service.quantity,
        })),
        totalAmount: totalAmount,
        paymentStatus: "Unpaid",
        garageId: garageId,
      };

      // Gọi API tạo hóa đơn
      const response = await createBill(billData);

      if (response) {
        Alert.alert("Thành công", "Tạo hóa đơn thành công!");
        // Cập nhật trạng thái booking thành "Billed"
        const updatedBooking = await updateBooking(selectedBooking._id, {
          status: "Billed",
        });
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBooking._id ? updatedBooking : b))
        );
        setShowBillModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo hóa đơn");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý Đặt lịch</Text>
      </View>

      {isTablet ? (
        <BookingTable
          bookings={bookings}
          handleUpdateStatus={handleUpdateStatus}
          prepareBill={prepareBill}
          openCancelModal={(booking) => {
            setSelectedBooking(booking);
            setShowCancelModal(true);
          }}
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              handleUpdateStatus={handleUpdateStatus}
              prepareBill={prepareBill}
              openCancelModal={() => {
                setSelectedBooking(item);
                setShowCancelModal(true);
              }}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <CancelModal
        visible={showCancelModal}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onConfirm={handleCancelBooking}
        onClose={() => setShowCancelModal(false)}
      />

      <BillModal
        visible={showBillModal}
        booking={selectedBooking}
        services={billServices}
        allServices={allServices}
        totalAmount={totalAmount}
        onQuantityChange={handleQuantityChange}
        onRemoveService={handleRemoveService}
        onAddService={handleAddService}
        onSave={handleSaveBill}
        onClose={() => setShowBillModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default BookingPage;
