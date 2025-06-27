import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Simple connectivity check
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/test', { 
          method: 'HEAD',
          timeout: 5000 
        });
        const online = response.ok;
        
        if (online !== isOnline) {
          setIsOnline(online);
          setShowStatus(true);
          
          // Hide status after 3 seconds if back online
          if (online) {
            setTimeout(() => setShowStatus(false), 3000);
          }
        }
      } catch {
        if (isOnline) {
          setIsOnline(false);
          setShowStatus(true);
        }
      }
    };

    // Check immediately
    checkConnection();
    
    // Check every 10 seconds
    const interval = setInterval(checkConnection, 10000);
    
    return () => clearInterval(interval);
  }, [isOnline]);

  if (!showStatus) return null;

  return (
    <View style={[styles.container, isOnline ? styles.online : styles.offline]}>
      {isOnline ? (
        <Wifi size={16} color="#10b981" />
      ) : (
        <WifiOff size={16} color="#ef4444" />
      )}
      <Text style={[styles.text, isOnline ? styles.onlineText : styles.offlineText]}>
        {isOnline ? 'Back online' : 'No internet connection'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  online: {
    backgroundColor: '#d1fae5',
  },
  offline: {
    backgroundColor: '#fee2e2',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  onlineText: {
    color: '#065f46',
  },
  offlineText: {
    color: '#991b1b',
  },
});