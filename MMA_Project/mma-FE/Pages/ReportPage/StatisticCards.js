import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatCard from './StatCard';

const StatisticCards = ({ totalCustomers, totalRevenue, formatCurrency }) => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tổng Quan</Text>
        <Text style={styles.sectionSubtitle}>Số liệu thống kê hôm nay</Text>
      </View>
      
      <StatCard 
        title="Tổng khách hàng"
        value={totalCustomers.toLocaleString()}
        icon="people-circle"
        iconColor="#0066cc"
        cardStyle={styles.customersCard}
        delay={100}
      />
      
      <StatCard 
        title="Tổng doanh thu"
        value={formatCurrency(totalRevenue)}
        icon="wallet"
        iconColor="#28a745"
        cardStyle={styles.revenueCard}
        delay={200}
      />

      <StatCard 
        title="Lợi nhuận ước tính"
        value={formatCurrency(totalRevenue * 0.3)}
        icon="trending-up"
        iconColor="#ff9500"
        cardStyle={styles.profitCard}
        delay={300}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  customersCard: {
    borderLeftColor: '#0066cc',
    borderLeftWidth: 4,
  },
  revenueCard: {
    borderLeftColor: '#28a745',
    borderLeftWidth: 4,
  },
  profitCard: {
    borderLeftColor: '#ff9500',
    borderLeftWidth: 4,
  },
});

export default StatisticCards;