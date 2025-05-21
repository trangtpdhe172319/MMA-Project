import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from 'react-native-vector-icons';

const HeaderBar = ({ title, subtitle, onFilterRepair, onFilterMaintenance, activeFilter }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              activeFilter === 'Sửa chữa' && styles.activeFilterButton
            ]} 
            onPress={onFilterRepair}
          >
            <MaterialIcons 
              name="build" 
              size={16} 
              color={activeFilter === 'Sửa chữa' ? '#FFF' : '#007AFF'} 
            />
            <Text style={[
              styles.filterText,
              activeFilter === 'Sửa chữa' && styles.activeFilterText
            ]}>Sửa chữa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              activeFilter === 'Bảo dưỡng' && styles.activeFilterButton
            ]} 
            onPress={onFilterMaintenance}
          >
            <FontAwesome5 
              name="oil-can" 
              size={14} 
              color={activeFilter === 'Bảo dưỡng' ? '#FFF' : '#007AFF'} 
            />
            <Text style={[
              styles.filterText,
              activeFilter === 'Bảo dưỡng' && styles.activeFilterText
            ]}>Bảo dưỡng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  activeFilterButton: {
    backgroundColor: '#0056B3',
  },
  filterText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#FFF',
  },
});

export default HeaderBar;