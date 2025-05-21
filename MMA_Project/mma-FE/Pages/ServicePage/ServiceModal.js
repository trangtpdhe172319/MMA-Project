import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { createService, updateService } from '../../apis';

const ServiceModal = ({ visible, service, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'Bảo dưỡng',
    status: 'Hoạt động'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        price: service.price ? String(service.price) : '',
        duration: service.duration ? String(service.duration) : '',
        category: service.category || 'Bảo dưỡng',
        status: service.status || 'Hoạt động'
      });
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'Bảo dưỡng',
        status: 'Hoạt động'
      });
    }
    setErrors({});
  }, [service, visible]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Tên dịch vụ không được để trống';
    }
    
    if (!form.price.trim()) {
      newErrors.price = 'Giá dịch vụ không được để trống';
    } else if (isNaN(form.price) || parseInt(form.price) < 0) {
      newErrors.price = 'Giá dịch vụ phải là số dương';
    }
    
    if (!form.duration.trim()) {
      newErrors.duration = 'Thời gian thực hiện không được để trống';
    } else if (isNaN(form.duration) || parseInt(form.duration) <= 0) {
      newErrors.duration = 'Thời gian thực hiện phải là số dương';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const serviceData = {
        ...form,
        price: parseInt(form.price),
        duration: parseInt(form.duration)
      };
      
      if (service) {
        await updateService(service._id, serviceData);
        Alert.alert('Thành công', 'Cập nhật dịch vụ thành công');
      } else {
        await createService(serviceData);
        Alert.alert('Thành công', 'Thêm dịch vụ thành công');
      }
      
      onClose(true);
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể lưu dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeCategory = (category) => {
    setForm(prev => ({ ...prev, category }));
  };

  const handleChangeStatus = (status) => {
    setForm(prev => ({ ...prev, status }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => onClose(false)}
    >
      <TouchableWithoutFeedback onPress={() => onClose(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </Text>
          <TouchableOpacity onPress={() => onClose(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên dịch vụ</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên dịch vụ"
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              error={!!errors.name}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mô tả dịch vụ"
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Giá (VNĐ)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập giá dịch vụ"
                value={form.price}
                onChangeText={(text) => setForm(prev => ({ ...prev, price: text }))}
                keyboardType="numeric"
                error={!!errors.price}
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Thời gian (phút)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập thời gian"
                value={form.duration}
                onChangeText={(text) => setForm(prev => ({ ...prev, duration: text }))}
                keyboardType="numeric"
                error={!!errors.duration}
              />
              {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Loại dịch vụ</Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  form.category === 'Bảo dưỡng' && styles.optionButtonActive
                ]}
                onPress={() => handleChangeCategory('Bảo dưỡng')}
              >
                <Ionicons
                  name="car-outline"
                  size={18}
                  color={form.category === 'Bảo dưỡng' ? '#FFF' : '#007AFF'}
                />
                <Text style={[
                  styles.optionText,
                  form.category === 'Bảo dưỡng' && styles.optionTextActive
                ]}>Bảo dưỡng</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  form.category === 'Sửa chữa' && styles.optionButtonActive
                ]}
                onPress={() => handleChangeCategory('Sửa chữa')}
              >
                <Ionicons
                  name="construct-outline"
                  size={18}
                  color={form.category === 'Sửa chữa' ? '#FFF' : '#007AFF'}
                />
                <Text style={[
                  styles.optionText,
                  form.category === 'Sửa chữa' && styles.optionTextActive
                ]}>Sửa chữa</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Trạng thái</Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  form.status === 'Hoạt động' && styles.optionButtonActive
                ]}
                onPress={() => handleChangeStatus('Hoạt động')}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={form.status === 'Hoạt động' ? '#FFF' : '#4CAF50'}
                />
                <Text style={[
                  styles.optionText,
                  form.status === 'Hoạt động' && styles.optionTextActive,
                  form.status !== 'Hoạt động' && { color: '#4CAF50' }
                ]}>Hoạt động</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  form.status === 'Tạm ngừng' && styles.optionButtonActive,
                  form.status === 'Tạm ngừng' && { backgroundColor: '#E53935' }
                ]}
                onPress={() => handleChangeStatus('Tạm ngừng')}
              >
                <Ionicons
                  name="pause-circle-outline"
                  size={18}
                  color={form.status === 'Tạm ngừng' ? '#FFF' : '#E53935'}
                />
                <Text style={[
                  styles.optionText,
                  form.status === 'Tạm ngừng' && styles.optionTextActive,
                  form.status !== 'Tạm ngừng' && { color: '#E53935' }
                ]}>Tạm ngừng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => onClose(false)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 50,
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 4,
  },
  optionButtons: {
    flexDirection: 'row',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#007AFF',
  },
  optionTextActive: {
    color: '#FFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ServiceModal;