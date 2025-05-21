import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const ScheduleSlotCard = ({ slot, onUpdate }) => {
  const isBooked = slot.status === "Booked";
  
  return (
    <View style={[
      styles.container,
      isBooked ? styles.bookedContainer : styles.availableContainer
    ]}>
      <View style={styles.timeSection}>
        <Ionicons name="time-outline" size={22} color="#555" />
        <Text style={styles.timeText}>{slot.slot}</Text>
      </View>
      
      <View style={styles.statusSection}>
        {isBooked ? (
          <View style={[styles.badge, styles.bookedBadge]}>
            <Ionicons name="close-circle" size={16} color="#fff" />
            <Text style={styles.badgeText}>Đã Đặt</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.availableBadge]}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.badgeText}>Trống</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.actionButton,
          isBooked ? styles.cancelButton : styles.bookButton
        ]}
        onPress={onUpdate}
      >
        <Ionicons 
          name="swap-horizontal" 
          size={16} 
          color="#fff" 
        />
        <Text style={styles.actionButtonText}>
          {isBooked ? "Hủy Chỗ" : "Đặt Chỗ"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookedContainer: {
    backgroundColor: "#fff5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  availableContainer: {
    backgroundColor: "#f5fffa",
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  timeSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  statusSection: {
    flex: 1,
    alignItems: "center",
    marginLeft: 15
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  bookedBadge: {
    backgroundColor: "#dc3545",
  },
  availableBadge: {
    backgroundColor: "#28a745",
  },
  badgeText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 5,
  },
  bookButton: {
    backgroundColor: "#0066cc",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default ScheduleSlotCard;