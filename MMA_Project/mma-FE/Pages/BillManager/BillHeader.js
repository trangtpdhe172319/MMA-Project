import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const BillHeader = ({ 
  selectedDate, 
  setSelectedDate, 
  onDateChange, 
  showDatePicker, 
  setShowDatePicker, 
  handleSummarizeBills 
}) => {
  
  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.dateControls}>
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={handlePreviousDay}
        >
          <Icon name="chevron-back" size={24} color="#0066cc" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={toggleDatePicker}
        >
          <Icon name="calendar-outline" size={20} color="#0066cc" style={styles.calendarIcon} />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('vi-VN')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.arrowButton}
          onPress={handleNextDay}
        >
          <Icon name="chevron-forward" size={24} color="#0066cc" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              if (onDateChange) onDateChange(date);
            }
          }}
        />
      )}
      
      <TouchableOpacity 
        style={styles.summaryButton}
        onPress={handleSummarizeBills}
      >
        <Icon name="stats-chart" size={18} color="#ffffff" style={styles.buttonIcon} />
        <Text style={styles.summaryButtonText}>Tổng kết</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
  },
  dateControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
  summaryButton: {
    backgroundColor: '#0066cc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 6,
  },
  summaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default BillHeader;