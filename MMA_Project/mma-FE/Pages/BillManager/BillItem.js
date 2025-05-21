import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';

const BillItem = ({ bill }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity 
      style={styles.billItem} 
      onPress={toggleExpand}
      activeOpacity={0.8}
    >
      {/* Bill Header */}
      <View style={styles.billHeader}>
        <View style={styles.headerLeft}>
          <Icon name="person-circle-outline" size={24} color="#0066cc" style={styles.customerIcon} />
          <Text style={styles.billCustomerName}>{bill.customerName}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.billTotalAmount}>
            {new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(bill.totalAmount)}
          </Text>
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>
      </View>

      <Collapsible collapsed={!isExpanded}>
        <View style={styles.billDetails}>
          <View style={styles.detailRow}>
            <Icon name="construct-outline" size={18} color="#555" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Dịch vụ:</Text>
            <Text style={styles.detailValue}>{bill.services.map(s => s.name).join(', ')}</Text>
          </View>
          
          
          {bill.notes && (
            <View style={styles.detailRow}>
              <Icon name="document-text-outline" size={18} color="#555" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Ghi chú:</Text>
              <Text style={styles.detailValue}>{bill.notes}</Text>
            </View>
          )}
        </View>
      </Collapsible>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  billItem: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  customerIcon: {
    marginRight: 8,
  },
  billCustomerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  billTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginRight: 8,
  },
  billDetails: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  paymentStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  paid: {
    color: '#27ae60',
    backgroundColor: '#e8f5e9',
  },
  unpaid: {
    color: '#e74c3c',
    backgroundColor: '#ffeaea',
  }
});

export default BillItem;