import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, 
  SafeAreaView, TouchableOpacity 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateSelector from "./DateSelector";
import ScheduleSlotCard from "./ScheduleSlotCard";
import { fetchSchedule, updateScheduleSlot } from "../../apis";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const garageId = "65a4c1e2f4d2b41234abcd10"; // Thay bằng garageId thực tế

  useEffect(() => {
    if (selectedDate) {
      loadSchedule();
    }
  }, [selectedDate]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await fetchSchedule(garageId, selectedDate);
      setSchedule(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch đặt chỗ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlot = async (slot) => {
    setLoading(true);
    const newStatus = slot.status === "Available" ? "Booked" : "Available";
    const data = {
      date: selectedDate,
      slot: slot.slot,
      status: newStatus,
      bookingId: newStatus === "Booked" ? "sample-booking-id" : null,
    };
    try {
      await updateScheduleSlot(garageId, data);
      loadSchedule();
    } catch (error) {
      console.error("Lỗi khi cập nhật slot", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    // Tạo các thành phần ngày tháng
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Tên các ngày trong tuần tiếng Việt
    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const weekday = weekdays[date.getDay()];
    
    // Tên các tháng tiếng Việt
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const monthName = months[date.getMonth()];
    
    return `${weekday}, ngày ${day} ${monthName} năm ${year}`;
  };

  const countSlotsByStatus = (status) => {
    if (!schedule || !schedule.timeSlots) return 0;
    return schedule.timeSlots.filter(slot => slot.status === status).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.pageTitle}>
          <Ionicons name="calendar" size={24} color="#333" /> Quản lý Lịch Đặt Chỗ
        </Text>
      </View>

      <View style={styles.filterCard}>
        <DateSelector 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
        
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Ionicons name="time-outline" size={18} color="#555" />
            <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        schedule && (
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleCardHeader}>
              <Text style={styles.scheduleCardTitle}>
                <Ionicons name="time-outline" size={20} color="#333" /> Các Khung Giờ
              </Text>
            </View>
            
            <ScrollView style={styles.slotsContainer}>
              {schedule.timeSlots.map((slot, index) => (
                <ScheduleSlotCard 
                  key={index}
                  slot={slot}
                  onUpdate={() => handleUpdateSlot(slot)}
                />
              ))}
            </ScrollView>
            
            <View style={styles.summaryContainer}>
              <View style={[styles.summaryItem, { backgroundColor: "#d4edda" }]}>
                <Ionicons name="checkmark-circle" size={18} color="#28a745" />
                <Text style={[styles.summaryText, { color: "#28a745" }]}>
                  Trống: {countSlotsByStatus("Available")}
                </Text>
              </View>
              <View style={[styles.summaryItem, { backgroundColor: "#f8d7da" }]}>
                <Ionicons name="close-circle" size={18} color="#dc3545" />
                <Text style={[styles.summaryText, { color: "#dc3545" }]}>
                  Đã Đặt: {countSlotsByStatus("Booked")}
                </Text>
              </View>
            </View>
          </View>
        )
      )}

      {!selectedDate && !loading && (
        <View style={styles.noDateContainer}>
          <Ionicons name="calendar" size={60} color="#ccc" />
          <Text style={styles.noDateText}>Vui lòng chọn ngày để xem lịch đặt chỗ</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 12,
  },
  headerRow: {
    marginBottom: 15,
    paddingVertical: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  selectedDateText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleCardHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  scheduleCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  slotsContainer: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 15,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  summaryText: {
    marginLeft: 6,
    fontWeight: "600",
  },
  noDateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  noDateText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default SchedulePage;