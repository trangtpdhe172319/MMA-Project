import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "Pending":
        return styles.warningBadge;
      case "Confirmed":
        return styles.primaryBadge;
      case "Completed":
        return styles.successBadge;
      case "Cancelled":
        return styles.dangerBadge;
      case "Billed":
        return styles.infoBadge;
      default:
        return styles.secondaryBadge;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "Pending":
        return "Chờ xác nhận";
      case "Confirmed":
        return "Đã xác nhận";
      case "Completed":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      case "Billed":
        return "Đã xuất hóa đơn";
      default:
        return status;
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={styles.badgeText}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  warningBadge: {
    backgroundColor: "#ffc107",
  },
  primaryBadge: {
    backgroundColor: "#007bff",
  },
  successBadge: {
    backgroundColor: "#28a745",
  },
  dangerBadge: {
    backgroundColor: "#dc3545",
  },
  infoBadge: {
    backgroundColor: "#17a2b8",
  },
  secondaryBadge: {
    backgroundColor: "#6c757d",
  },
});

export default StatusBadge;