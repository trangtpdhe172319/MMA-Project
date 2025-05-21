import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterCard = ({ 
  viewMode, 
  setViewMode, 
  date, 
  setDate, 
  month, 
  setMonth, 
  year, 
  setYear, 
  fetchData, 
  loading 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    
    // Format date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];
    setDate(formattedDate);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.filterCard}>
      <Text style={styles.cardTitle}>Bộ lọc thống kê</Text>
      
      {/* Chế độ xem */}
      <View style={styles.formGroup}>
        <Text style={styles.filterLabel}>
          <Ionicons name="options-outline" size={18} color="#555" style={styles.iconMargin} />
          Chọn chế độ xem
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={viewMode}
            onValueChange={setViewMode}
            style={styles.picker}
            dropdownIconColor="#0066cc"
          >
            <Picker.Item label="Thống kê theo ngày" value="day" />
            <Picker.Item label="Thống kê theo tháng" value="month" />
            <Picker.Item label="Thống kê theo năm" value="year" />
          </Picker>
        </View>
      </View>

      {/* Chọn ngày (với DatePicker) */}
      {viewMode === 'day' && (
        <View style={styles.formGroup}>
          <Text style={styles.filterLabel}>
            <Ionicons name="calendar-outline" size={18} color="#555" style={styles.iconMargin} /> 
            Chọn ngày
          </Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {date ? formatDateForDisplay(date) : "Chọn ngày"}
            </Text>
            <Ionicons name="calendar" size={20} color="#0066cc" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      )}

      {/* Chọn tháng */}
      {viewMode === 'month' && (
        <View style={styles.rowContainer}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.filterLabel}>
              <Ionicons name="calendar-outline" size={18} color="#555" style={styles.iconMargin} />
              Chọn năm
            </Text>
            <TextInput
              style={styles.textInput}
              value={year || ''}
              onChangeText={setYear}
              keyboardType="numeric"
              placeholder="YYYY"
              maxLength={4}
            />
          </View>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.filterLabel}>
              <Ionicons name="calendar-number-outline" size={18} color="#555" style={styles.iconMargin} />
              Chọn tháng
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={month}
                onValueChange={setMonth}
                style={styles.picker}
                dropdownIconColor="#0066cc"
              >
                <Picker.Item label="Chọn tháng" value="" />
                {Array.from({ length: 12 }, (_, i) => (
                  <Picker.Item key={i + 1} label={`Tháng ${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      )}

      {/* Chọn năm */}
      {viewMode === 'year' && (
        <View style={styles.formGroup}>
          <Text style={styles.filterLabel}>
            <Ionicons name="calendar-outline" size={18} color="#555" style={styles.iconMargin} />
            Chọn năm
          </Text>
          <TextInput
            style={styles.textInput}
            value={year || ''}
            onChangeText={setYear}
            keyboardType="numeric"
            placeholder="YYYY"
            maxLength={4}
          />
        </View>
      )}

      {/* Nút tìm kiếm */}
      <TouchableOpacity 
        style={[styles.searchButton, loading && styles.disabledButton]}
        onPress={fetchData}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="#fff" style={styles.spinnerMargin} />
            <Text style={styles.buttonText}>Đang tải...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="search" size={20} color="#fff" style={styles.spinnerMargin} />
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    height: 60,
  },
  
  picker: {
    height: 60, // Đảm bảo cùng chiều cao với container
    width: '100%',
    fontSize: 30,
  },  
  
  textInput: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  searchButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#8ab4de',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spinnerMargin: {
    marginRight: 8,
  },
  iconMargin: {
    marginRight: 6,
  },
});

export default FilterCard;