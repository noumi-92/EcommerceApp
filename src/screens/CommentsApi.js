import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native/types_generated/index'

const UpdateCommentScreen = () => {
    const [comments, setComments] = useState([
        { id: 1, body: 'Nice picture!' },
        { id: 2, body: 'Amazing view!' },
        { id: 3, body: 'Beautiful place!' },
    ]);
}

const CommentsApi = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>CommentsApi</Text>

            <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.commentCard}>
                    <Text style={styles.commentText}>{item.body}</Text>
                </View>
            )}
            />

        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    commentCard: {
        backgroundColor: 'lightgray',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    commentText: {
        fontSize: 16,
    }
}

export default CommentsApi