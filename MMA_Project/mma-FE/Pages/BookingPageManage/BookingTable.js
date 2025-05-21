import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";

const BookingTable = ({ bookings, handleUpdateStatus, prepareBill, openCancelModal }) => {
  return (
    <ScrollView style={styles.container} horizontal={true}>
      <View>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { width: 150 }]}>Tên khách</Text>
          <Text style={[styles.headerCell, { width: 200 }]}>Email</Text>
          <Text style={[styles.headerCell, { width: 120 }]}>Số điện thoại</Text>
          <Text style={[styles.headerCell, { width: 200 }]}>Dịch vụ</Text>
          <Text style={[styles.headerCell, { width: 150 }]}>Ngày giờ</Text>
          <Text style={[styles.headerCell, { width: 120 }]}>Trạng thái</Text>
          <Text style={[styles.headerCell, { width: 200 }]}>Hành động</Text>
        </View>

        <ScrollView>
          {bookings.map((booking) => (
            <View key={booking._id} style={styles.row}>
              <Text style={[styles.cell, { width: 150 }]}>{booking.customerName}</Text>
              <Text style={[styles.cell, { width: 200 }]}>{booking.customerEmail}</Text>
              <Text style={[styles.cell, { width: 120 }]}>{booking.customerPhone}</Text>
              <Text style={[styles.cell, { width: 200 }]}>{booking.service.join(", ")}</Text>
              <Text style={[styles.cell, { width: 150 }]}>
                {`${booking.bookingDate.date} - ${booking.bookingDate.timeSlot}`}
              </Text>
              <View style={[styles.cell, { width: 120 }]}>
                <StatusBadge status={booking.status} />
              </View>
              <View style={[styles.cell, { width: 200 }]}>
                <View style={styles.actionContainer}>
                  {booking.status === "Pending" && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={() => handleUpdateStatus(booking, "Confirmed")}
                    >
                      <Ionicons name="checkmark" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Xác nhận</Text>
                    </TouchableOpacity>
                  )}
                  
                  {booking.status === "Confirmed" && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleUpdateStatus(booking, "Completed")}
                    >
                      <Ionicons name="calendar-check" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Hoàn thành</Text>
                    </TouchableOpacity>
                  )}
                  
                  {booking.status === "Completed" && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.billButton]}
                      onPress={() => prepareBill(booking)}
                    >
                      <Ionicons name="document-text" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Tạo hóa đơn</Text>
                    </TouchableOpacity>
                  )}
                  
                  {(booking.status === "Pending" || booking.status === "Confirmed") && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => openCancelModal(booking)}
                    >
                      <Ionicons name="close" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Hủy</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  headerCell: {
    padding: 12,
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    backgroundColor: "#ffffff",
  },
  cell: {
    padding: 12,
    fontSize: 14,
    justifyContent: "center",
  },
  actionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  confirmButton: {
    backgroundColor: "#28a745",
  },
  completeButton: {
    backgroundColor: "#007bff",
  },
  billButton: {
    backgroundColor: "#17a2b8",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
});

export default BookingTable;