import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import Collapsible from 'react-native-collapsible';

const BookingCard = ({ booking, handleUpdateStatus, prepareBill, openCancelModal }) => {
  const [isServicesCollapsed, setIsServicesCollapsed] = useState(true);

  const toggleServicesCollapse = () => {
    setIsServicesCollapsed(!isServicesCollapsed);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{booking.customerName}</Text>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={18} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{booking.customerEmail}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Feather name="phone" size={18} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{booking.customerPhone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={18} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{booking.bookingDate.date}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="time" size={18} color="#666" style={styles.icon} />
          <Text style={styles.infoText}>{booking.bookingDate.timeSlot}</Text>
        </View>

        <TouchableOpacity 
          style={styles.accordionHeader} 
          onPress={toggleServicesCollapse}
        >
          <Text style={styles.accordionTitle}>Dịch vụ đã đặt</Text>
          <Ionicons 
            name={isServicesCollapsed ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>

        <Collapsible collapsed={isServicesCollapsed}>
          <View style={styles.serviceList}>
            {booking.service.map((service, idx) => (
              <Text key={idx} style={styles.serviceItem}>• {service}</Text>
            ))}
          </View>
        </Collapsible>

        <View style={styles.actionButtons}>
          {booking.status === "Pending" && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleUpdateStatus(booking, "Confirmed")}
            >
              <Ionicons name="checkmark" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          )}
          
          {booking.status === "Confirmed" && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleUpdateStatus(booking, "Completed")}
            >
              {/* <Ionicons name="calendar-check" size={18} color="#fff" style={styles.buttonIcon} /> */}
              <Text style={styles.buttonText}>Hoàn thành</Text>
            </TouchableOpacity>
          )}
          
          {booking.status === "Completed" && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.billButton]}
              onPress={() => prepareBill(booking)}
            >
              <Ionicons name="document-text" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Tạo hóa đơn</Text>
            </TouchableOpacity>
          )}
          
          {(booking.status === "Pending" || booking.status === "Confirmed") && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={openCancelModal}
            >
              <Ionicons name="close" size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardBody: {
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  serviceList: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  serviceItem: {
    fontSize: 14,
    color: "#444",
    paddingVertical: 3,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 5,
  },
  buttonIcon: {
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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

export default BookingCard;