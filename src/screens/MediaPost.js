import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

// ==========================================
// 1. API SERVICE CLASS
// ==========================================
class CommentApiService {
  constructor(baseUrl = 'https://dummyjson.com/comments') {
    this.baseUrl = baseUrl;
  }

  // HTTP POST Request
  async addComment(body, postId = 5, userId = 7) {
    const response = await axios.post(
      `${this.baseUrl}/add`,
      {
        body: body.trim(),
        postId,
        userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  // HTTP PATCH Request (Edit Comment)
  async updateComment(id, body) {
    if (typeof id === 'number' && id <= 30) {
      const response = await axios.patch(
        `${this.baseUrl}/${id}`,
        { body: body.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    }
    return { id, body: body.trim() };
  }

  // HTTP DELETE Request
  async deleteComment(id) {
    if (typeof id === 'number' && id <= 30) {
      await axios.delete(`${this.baseUrl}/${id}`);
    }
  }
}

// ==========================================
// 2. CONTROLLER CLASS
// ==========================================
class MediaPostController {
  constructor(apiService) {
    this.apiService = apiService;
  }

  generateUniqueId() {
    return `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  async handleAddComment({ commentText, setComments, setCommentText, setLoading }) {
    if (!commentText.trim()) {
      Alert.alert('Empty Comment', 'Please enter a comment before posting.');
      return;
    }

    setLoading(true);

    try {
      const data = await this.apiService.addComment(commentText);

      const newComment = {
        id: this.generateUniqueId(),
        user: data.user?.username || 'You',
        body: data.body,
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error('POST Error:', error);
      Alert.alert('Network Error', 'Something went wrong while posting.');
    } finally {
      setLoading(false);
    }
  }

  // Save patched comment text
  async handleSaveEdit({
    editingTarget,
    editText,
    setComments,
    setEditingTarget,
    setUpdatingId,
  }) {
    if (!editText.trim()) {
      Alert.alert('Validation Error', 'Comment cannot be empty.');
      return;
    }

    setUpdatingId(editingTarget.id);

    try {
      const updatedData = await this.apiService.updateComment(
        editingTarget.id,
        editText
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === editingTarget.id
            ? { ...comment, body: updatedData.body }
            : comment
        )
      );

      setEditingTarget(null);
    } catch (error) {
      console.error('PATCH Error:', error);
      Alert.alert('Network Error', 'Failed to update comment.');
    } finally {
      setUpdatingId(null);
    }
  }

  // Execute Delete Task
  async executeDelete(targetId, setComments, setDeletingId) {
    setDeletingId(targetId);

    try {
      await this.apiService.deleteComment(targetId);
    } catch (error) {
      console.warn('DELETE API Skipped or Failed:', error);
    } finally {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== targetId)
      );
      setDeletingId(null);
    }
  }

  confirmDelete(targetId, setComments, setDeletingId) {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => this.executeDelete(targetId, setComments, setDeletingId),
        },
      ]
    );
  }
}

const commentApiService = new CommentApiService();
const controller = new MediaPostController(commentApiService);

// ==========================================
// 3. UI VIEW COMPONENT
// ==========================================
const MediaPost = () => {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Inline edit state tracking
  const [editingTarget, setEditingTarget] = useState(null); // stores comment object or null
  const [editText, setEditText] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const [comments, setComments] = useState([
    { id: 1, user: 'Nouman', body: 'Amazing picture! 🔥' },
  ]);

  const onAddCommentPress = () => {
    controller.handleAddComment({
      commentText,
      setComments,
      setCommentText,
      setLoading,
    });
  };

  const onDeleteCommentPress = (id) => {
    controller.confirmDelete(id, setComments, setDeletingId);
  };

  const startEditMode = (comment) => {
    setEditingTarget(comment);
    setEditText(comment.body);
  };

  const onSaveEditPress = () => {
    controller.handleSaveEdit({
      editingTarget,
      editText,
      setComments,
      setEditingTarget,
      setUpdatingId,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <View>
          <Text style={styles.username}>john_travels</Text>
          <Text style={styles.location}>Northern Areas</Text>
        </View>
      </View>

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
        }}
        style={styles.postImage}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.likesText}>1,245 likes</Text>
        <Text style={styles.sectionTitle}>Comments</Text>

        {comments.map((item) => {
          const isEditingThis = editingTarget?.id === item.id;

          return (
            <View key={item.id} style={styles.commentRow}>
              {isEditingThis ? (
                // Inline Edit Input Form
                <View style={styles.inlineEditContainer}>
                  <TextInput
                    style={styles.inlineInput}
                    value={editText}
                    onChangeText={setEditText}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onSaveEditPress}
                    disabled={updatingId === item.id}
                  >
                    {updatingId === item.id ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditingTarget(null)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Standard Comment View
                <>
                  <Text style={styles.commentText}>
                    <Text style={styles.usernameBold}>{item.user} </Text>
                    {item.body}
                  </Text>

                  <View style={styles.actionGroup}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => startEditMode(item)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDeleteCommentPress(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#8e8e93"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            style={styles.postButton}
            onPress={onAddCommentPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 40,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  location: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  postImage: {
    height: 260,
    resizeMode: 'cover',
    marginHorizontal: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  likesText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  commentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  commentText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
  },
  usernameBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineEditContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#007aff',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    marginRight: 6,
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#34c759',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#8e8e93',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffffff',
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 22,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 55,
    marginRight: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MediaPost;