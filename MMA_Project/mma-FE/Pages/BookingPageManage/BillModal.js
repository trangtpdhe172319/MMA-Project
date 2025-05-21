import React from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const BillModal = ({
  visible,
  booking,
  services,
  allServices,
  totalAmount,
  onQuantityChange,
  onRemoveService,
  onAddService,
  onSave,
  onClose
}) => {
  const [selectedService, setSelectedService] = React.useState("");

  const handleAddService = () => {
    if (selectedService) {
      onAddService(selectedService);
      setSelectedService("");
    }
  };

  if (!booking) return null;

  const renderServiceItem = ({ item, index }) => (
    <View style={styles.serviceRow}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price.toLocaleString()}đ</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onQuantityChange(index, item.quantity - 1)}
        >
          <Ionicons name="remove" size={18} color="#333" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.quantityInput}
          value={item.quantity.toString()}
          keyboardType="numeric"
          onChangeText={(text) => {
            const num = parseInt(text) || 1;
            onQuantityChange(index, num);
          }}
        />
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onQuantityChange(index, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.serviceTotal}>
        <Text style={styles.serviceTotalText}>
          {(item.price * item.quantity).toLocaleString()}đ
        </Text>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemoveService(index)}
        >
          <Ionicons name="close-circle" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tạo Hóa Đơn</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.infoCards}>
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Thông tin khách hàng:</Text>
                <View style={styles.infoItem}>
                  <Ionicons name="person" size={18} color="#666" style={styles.icon} />
                  <Text style={styles.infoText}>{booking.customerName}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Feather name="phone" size={18} color="#666" style={styles.icon} />
                  <Text style={styles.infoText}>{booking.customerPhone}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialIcons name="email" size={18} color="#666" style={styles.icon} />
                  <Text style={styles.infoText}>{booking.customerEmail}</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Thông tin đặt lịch:</Text>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar" size={18} color="#666" style={styles.icon} />
                  <Text style={styles.infoText}>{booking.bookingDate.date}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time" size={18} color="#666" style={styles.icon} />
                  <Text style={styles.infoText}>{booking.bookingDate.timeSlot}</Text>
                </View>
              </View>
            </View>

            <View style={styles.servicesCard}>
              <Text style={styles.cardTitle}>Danh sách dịch vụ</Text>
              
              {services.length > 0 ? (
                <FlatList
                  data={services}
                  renderItem={renderServiceItem}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.emptyMessage}>Chưa có dịch vụ nào</Text>
              )}
              
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}đ</Text>
              </View>
            </View>

            <View style={styles.addServiceCard}>
              <Text style={styles.cardTitle}>Thêm dịch vụ:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedService}
                  onValueChange={(itemValue) => setSelectedService(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn dịch vụ..." value="" />
                  {allServices.map((service) => (
                    <Picker.Item
                      key={service._id}
                      label={`${service.name} - ${service.price.toLocaleString()}đ`}
                      value={service._id}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddService}
                disabled={!selectedService}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Thêm dịch vụ</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.closeFooterButton]}
              onPress={onClose}
            >
              <Text style={styles.closeFooterButtonText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Lưu hóa đơn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    maxWidth: 600,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 15,
  },
  infoCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    minWidth: 250,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
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
  servicesCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  serviceInfo: {
    flex: 2,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "500",
  },
  servicePrice: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight:20
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    textAlign: "center",
    width: 40,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
  },
  serviceTotal: {
    flex: 1,
    flexDirection: "column", // Đưa số tiền xuống dòng dưới
    alignItems: "flex-end", // Căn lề phải cho đẹp
    marginTop: 5, // Thêm khoảng cách với số lượng
  },
  
  serviceTotalText: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 10,
  },
  removeButton: {
    padding: 3,
  },
  emptyMessage: {
    textAlign: "center",
    padding: 15,
    color: "#666",
    fontStyle: "italic",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  addServiceCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  addButton: {
    backgroundColor: "#28a745",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  footerButton: {
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 100,
    alignItems: "center",
    marginLeft: 10,
  },
  closeFooterButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeFooterButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  }
});

export default BillModal;