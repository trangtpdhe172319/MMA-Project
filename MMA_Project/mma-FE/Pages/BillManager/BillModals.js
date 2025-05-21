import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SummaryModal = ({ visible, onClose, dailySummary }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {dailySummary && dailySummary.isExisting 
                ? 'Thông tin tổng kết'
                : 'Tổng kết ngày'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {dailySummary && (
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Icon name="people-outline" size={24} color="#0066cc" style={styles.summaryIcon} />
                <Text style={styles.summaryLabel}>Tổng số khách:</Text>
                <Text style={styles.summaryValue}>{dailySummary.billSummary.totalCustomers}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Icon name="cash-outline" size={24} color="#0066cc" style={styles.summaryIcon} />
                <Text style={styles.summaryLabel}>Tổng doanh thu:</Text>
                <Text style={styles.summaryValue}>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(dailySummary.billSummary.totalRevenue)}
                </Text>
              </View>
              
              {dailySummary.isExisting && (
                <View style={styles.noticeContainer}>
                  <Icon name="information-circle-outline" size={20} color="#e74c3c" />
                  <Text style={styles.noticeText}>
                    Ngày này đã được tổng kết trước đó
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.closeModalButton}
            onPress={onClose}
          >
            <Text style={styles.closeModalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  closeButton: {
    padding: 4,
  },
  summaryContent: {
    marginVertical: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f2',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noticeText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontWeight: '500',
  },
  closeModalButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default { SummaryModal };