import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';

const UsersDirectory = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Users on Mount
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users directory');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users dynamically as search query changes
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  // Clear search field and restore full list
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredUsers(users);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchUsers}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Directory</Text>

      {/* Search Bar Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#8e8e93"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearSearch}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count Bar */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>
          Showing <Text style={styles.boldText}>{filteredUsers.length}</Text> of{' '}
          {users.length} users
        </Text>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setSelectedUser(item)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        )}
      />

      {/* User Details Bottom Sheet */}
      <Modal
        visible={selectedUser !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedUser(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedUser(null)}
        >
          {/* Prevent closing when tapping inside the bottom sheet */}
          <TouchableOpacity
            style={styles.bottomSheet}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle Accent */}
            <View style={styles.sheetHandle} />

            {selectedUser && (
              <>
                <Text style={styles.detailHeader}>{selectedUser.name}</Text>
                <Text style={styles.detailSubHeader}>@{selectedUser.username}</Text>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedUser.phone}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Website</Text>
                  <Text style={styles.detailValue}>{selectedUser.website}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Company</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.company?.name || 'N/A'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser.address
                      ? `${selectedUser.address.street}, ${selectedUser.address.suite}, ${selectedUser.address.city}`
                      : 'N/A'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedUser(null)}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 12 },
  errorText: { color: '#FF3B30', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  retryBtn: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: '600' },

  /* Search Controls */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1c1c1e',
  },
  clearBtn: {
    marginLeft: 8,
    backgroundColor: '#e5e5ea',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearBtnText: { color: '#1c1c1e', fontWeight: '600', fontSize: 13 },

  /* Meta Info */
  metaContainer: { marginBottom: 12 },
  metaText: { fontSize: 13, color: '#8e8e93' },
  boldText: { fontWeight: 'bold', color: '#1c1c1e' },

  /* User Item Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  cardInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  userEmail: { fontSize: 14, color: '#8e8e93', marginTop: 2 },
  arrowIcon: { fontSize: 22, color: '#c7c7cc', marginLeft: 8 },

  /* Empty State */
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#8e8e93', fontSize: 15 },

  /* Bottom Sheet Overlay & Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d1d6',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailHeader: { fontSize: 20, fontWeight: 'bold', color: '#1c1c1e' },
  detailSubHeader: { fontSize: 14, color: '#8e8e93', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#e5e5ea', marginVertical: 12 },
  detailRow: { marginBottom: 10 },
  detailLabel: { fontSize: 11, color: '#8e8e93', textTransform: 'uppercase', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#1c1c1e', fontWeight: '500', marginTop: 1 },
  closeBtn: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default UsersDirectory;