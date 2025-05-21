import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { fetchAllServices } from '../../apis';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import AddServiceButton from './AddServiceButton';
import NoServices from './NoServices';
import HeaderBar from './HeaderBar';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllServices();
      setServices(data);
    } catch (error) {
      console.error('Lỗi khi tải dịch vụ:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  const openAddModal = () => {
    setSelectedService(null);
    setModalVisible(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const closeModal = (shouldRefresh = false) => {
    setModalVisible(false);
    if (shouldRefresh) {
      loadServices();
    }
  };

  const toggleCategoryFilter = (category) => {
    if (categoryFilter === category) {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(category);
    }
  };

  const filteredServices = categoryFilter 
    ? services.filter(service => service.category === categoryFilter)
    : services;

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loaderText}>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <HeaderBar 
        title="Quản Lý Dịch Vụ" 
        subtitle={`${services.length} dịch vụ`}
        onFilterRepair={() => toggleCategoryFilter('Sửa chữa')}
        onFilterMaintenance={() => toggleCategoryFilter('Bảo dưỡng')}
        activeFilter={categoryFilter}
      />

      <FlatList
        data={filteredServices}
        renderItem={({ item }) => (
          <ServiceCard 
            service={item} 
            onEdit={() => openEditModal(item)}
            onRefresh={loadServices}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<NoServices />}
      />

      <ServiceModal 
        visible={modalVisible}
        service={selectedService}
        onClose={closeModal}
      />
      
      <AddServiceButton onPress={openAddModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
});

export default ServiceManager;