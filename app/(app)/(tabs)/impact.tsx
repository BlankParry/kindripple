import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { Utensils, Leaf, Award, Building2, Users } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useMetricsStore } from '@/store/metrics-store';
import { useDonationStore } from '@/store/donation-store';
import MetricCard from '@/components/ui/MetricCard';
import Card from '@/components/ui/Card';
import COLORS from '@/constants/colors';

export default function ImpactScreen() {
  const { user } = useAuthStore();
  const { metrics, fetchMetrics, isLoading } = useMetricsStore();
  const { donations, getDonationsByRestaurant } = useDonationStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    await fetchMetrics();
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    if (!user) return COLORS.volunteer.primary;
    
    switch (user.role) {
      case 'restaurant':
        return COLORS.restaurant.primary;
      case 'ngo':
        return COLORS.ngo.primary;
      case 'volunteer':
        return COLORS.volunteer.primary;
      case 'admin':
        return COLORS.admin.primary;
      default:
        return COLORS.volunteer.primary;
    }
  };

  // Calculate personal impact based on user role
  const getPersonalImpact = () => {
    if (!user) return { value: 0, label: 'No Data' };

    switch (user.role) {
      case 'restaurant':
        const restaurantDonations = getDonationsByRestaurant(user.id);
        const totalMeals = restaurantDonations.reduce((sum, donation) => sum + donation.quantity, 0);
        return {
          value: totalMeals,
          label: 'Meals Donated'
        };
      case 'ngo':
        const claimedDonations = donations.filter(d => d.claimedBy === user.id);
        const totalClaimed = claimedDonations.reduce((sum, donation) => sum + donation.quantity, 0);
        return {
          value: totalClaimed,
          label: 'Meals Claimed'
        };
      case 'volunteer':
        const completedDeliveries = (user as any).completedDeliveries || 0;
        return {
          value: completedDeliveries,
          label: 'Deliveries Completed'
        };
      default:
        return { value: 0, label: 'No Data' };
    }
  };

  const personalImpact = getPersonalImpact();

  // Calculate CO2 savings (approximate: 1 meal = 2.5kg CO2 saved)
  const calculateCO2Savings = () => {
    return Math.round(personalImpact.value * 2.5);
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Our Collective Impact</Text>
      <Text style={styles.subtitle}>
        Together, we are making a difference in reducing food waste and feeding communities.
      </Text>
      
      <View style={styles.metricsContainer}>
        <MetricCard
          title="Meals Rescued"
          value={metrics.totalMealsRescued}
          icon={<Utensils size={24} color={getRoleColor()} />}
          color={getRoleColor()}
        />
        
        <MetricCard
          title="CO₂ Emissions Saved"
          value={metrics.co2EmissionsSaved}
          suffix="kg"
          icon={<Leaf size={24} color={COLORS.volunteer.primary} />}
          color={COLORS.volunteer.primary}
        />
        
        <MetricCard
          title="Volunteers Recognized"
          value={metrics.volunteersRecognized}
          icon={<Award size={24} color={COLORS.ngo.primary} />}
          color={COLORS.ngo.primary}
        />
        
        <View style={styles.rowMetrics}>
          <View style={styles.halfMetric}>
            <MetricCard
              title="Restaurants"
              value={metrics.restaurantsParticipating}
              icon={<Building2 size={24} color={COLORS.restaurant.primary} />}
              color={COLORS.restaurant.primary}
            />
          </View>
          
          <View style={styles.halfMetric}>
            <MetricCard
              title="NGOs"
              value={metrics.ngosParticipating}
              icon={<Users size={24} color={COLORS.ngo.primary} />}
              color={COLORS.ngo.primary}
            />
          </View>
        </View>
      </View>
      
      <Card style={styles.impactCard}>
        <Text style={styles.impactTitle}>Your Personal Impact</Text>
        
        <View style={styles.personalImpact}>
          <Text style={[styles.impactMetric, { color: getRoleColor() }]}>
            {personalImpact.value}
          </Text>
          <Text style={styles.impactLabel}>{personalImpact.label}</Text>
        </View>

        {personalImpact.value > 0 && (
          <View style={styles.co2Container}>
            <Text style={styles.co2Text}>
              You have helped save approximately{' '}
              <Text style={[styles.co2Value, { color: COLORS.volunteer.primary }]}>
                {calculateCO2Savings()}kg
              </Text>
              {' '}of CO₂ emissions!
            </Text>
          </View>
        )}
        
        <View style={styles.badgesContainer}>
          <Text style={styles.badgesTitle}>Badges Earned</Text>
          
          <View style={styles.badgesList}>
            {personalImpact.value > 0 && (
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: getRoleColor() }]}>
                  <Award size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.badgeName}>First Contribution</Text>
              </View>
            )}
            
            {personalImpact.value >= 5 && (
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: getRoleColor() }]}>
                  <Award size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.badgeName}>5 Contributions</Text>
              </View>
            )}
            
            {personalImpact.value >= 10 && (
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: getRoleColor() }]}>
                  <Award size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.badgeName}>10 Contributions</Text>
              </View>
            )}

            {personalImpact.value >= 25 && (
              <View style={styles.badge}>
                <View style={[styles.badgeIcon, { backgroundColor: getRoleColor() }]}>
                  <Award size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.badgeName}>Champion</Text>
              </View>
            )}

            {personalImpact.value === 0 && (
              <Text style={styles.noBadgesText}>
                Start contributing to earn your first badge!
              </Text>
            )}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 24,
  },
  metricsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  rowMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  halfMetric: {
    flex: 1,
  },
  impactCard: {
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  personalImpact: {
    alignItems: 'center',
    marginBottom: 16,
  },
  impactMetric: {
    fontSize: 48,
    fontWeight: '700',
  },
  impactLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  co2Container: {
    backgroundColor: COLORS.volunteer.primary + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  co2Text: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  co2Value: {
    fontWeight: '600',
  },
  badgesContainer: {
    marginTop: 8,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  badge: {
    alignItems: 'center',
    width: 80,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  noBadgesText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
});