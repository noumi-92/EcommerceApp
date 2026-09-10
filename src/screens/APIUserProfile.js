import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const APIUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks whether the component is still mounted, so we never call
  // setState after unmount (avoids the "state update on unmounted
  // component" warning / memory leak).
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Stable fetch function so it can be reused by useEffect, the
  // "Reload Profile" button, and the "Retry" button.
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users/'+Math.floor(Math.random() * 10 + 1) // Random user ID between 1 and 10
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();

      // Defensive check: make sure the payload actually has the
      // fields we render. If the API shape changes or returns
      // something unexpected, treat it as an error instead of
      // silently rendering blank text.
      if (!data || typeof data.name === 'undefined') {
        throw new Error('Unexpected response format from server');
      }

      console.log('Fetched User:', data);

      if (isMountedRef.current) {
        setUser(data);
      }
    } catch (err) {
      console.log('Fetch error:', err);
      if (isMountedRef.current) {
        setError(err.message);
        // Single error surface: rely on the inline error card below
        // instead of also popping a native Alert, so the user isn't
        // shown the same failure twice. Re-enable this if you want
        // a native alert as well.
        // Alert.alert('Error', err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Run fetchUser once on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Use a standard local variable instead of useState.
  // NOTE: this is safe — the whole component function re-runs on
  // every state change, so `content` is recalculated on each render.
  let content;

  if (loading) {
    content = (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.infoText}>Loading user data...</Text>
      </View>
    );
  } else if (error) {
    content = (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={fetchUser}
          accessibilityRole="button"
          accessibilityLabel="Retry loading user profile"
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (user) {
    content = (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.userName}>{user.name ?? 'Unknown name'}</Text>
          <Text style={styles.userEmail}>{user.email ?? 'No email'}</Text>
          <Text style={styles.userPhone}>{user.phone ?? 'No phone'}</Text>
        </View>
      </View>
    );
  } else {
    content = <Text style={styles.infoText}>No user data available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      <TouchableOpacity
        style={styles.loadUserBtn}
        onPress={fetchUser}
        accessibilityRole="button"
        accessibilityLabel="Reload profile"
      >
        <Text style={styles.loadUserBtnText}>Reload Profile</Text>
      </TouchableOpacity>

      {/* Render the calculated content block */}
      {content}
    </View>
  );
};

export default APIUserProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  centerContainer: { marginTop: 40, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1c1c1e' },
  infoText: { marginTop: 12, color: '#666', fontSize: 15 },
  errorText: { color: '#FF3B30', fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  cardContent: {},
  userName: { fontSize: 18, fontWeight: 'bold', color: '#3a3a3c' },
  userEmail: { fontSize: 14, color: '#8e8e93', marginTop: 4 },
  userPhone: { fontSize: 15, fontWeight: '600', color: '#34C759', marginTop: 8 },
  loadUserBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadUserBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  retryBtn: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  retryBtnText: { color: '#fff', fontWeight: 'bold' },
});
