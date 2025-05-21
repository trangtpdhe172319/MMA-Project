import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialIcons, FontAwesome5, Ionicons } from 'react-native-vector-icons';
import { deleteService } from '../../apis';

const StatusBadge = ({ status }) => {
  const isActive = status === 'Hoạt động';
  
  return (
    <View style={[
      styles.statusBadge,
      isActive ? styles.activeBadge : styles.inactiveBadge
    ]}>
      <Text style={styles.statusText}>
        {status}
      </Text>
    </View>
  );
};

const ServiceCard = ({ service, onEdit, onRefresh }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa dịch vụ "${service.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteService(service._id);
              onRefresh();
            } catch (error) {
              console.error('Lỗi khi xóa dịch vụ:', error);
              Alert.alert('Lỗi', 'Không thể xóa dịch vụ. Vui lòng thử lại sau.');
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive'
        },
      ]
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getCategoryIcon = () => {
    if (service.category === 'Sửa chữa') {
      return <MaterialIcons name="build" size={16} color="#555" />;
    } else {
      return <FontAwesome5 name="oil-can" size={14} color="#555" />;
    }
  };

  return (
    <Card style={styles.card} elevation={2}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          {getCategoryIcon()}
          <Text style={styles.categoryText}>{service.category}</Text>
        </View>
        <StatusBadge status={service.status || 'Hoạt động'} />
      </View>
      
      <Card.Content>
        <Text style={styles.serviceName}>{service.name}</Text>
        
        {service.description && (
          <Text style={styles.description}>{service.description}</Text>
        )}
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color="#007AFF" />
            <Text style={styles.detailText}>{formatPrice(service.price)} VNĐ</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#007AFF" />
            <Text style={styles.detailText}>{service.duration} phút</Text>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={onEdit}
          disabled={isDeleting}
        >
          <Ionicons name="create-outline" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Ionicons name="trash-outline" size={16} color="#FFF" />
          <Text style={styles.buttonText}>
            {isDeleting ? 'Đang xóa...' : 'Xóa'}
          </Text>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  actions: {
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default ServiceCard;