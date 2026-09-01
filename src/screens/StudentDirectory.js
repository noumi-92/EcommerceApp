import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  StatusBar,
} from 'react-native';

// Sample data for students
const studentsData = [
  { id: '1', name: 'Ali', course: 'React Native', semester: '1' },
  { id: '2', name: 'Sara', course: 'JavaScript', semester: '2' },
  { id: '3', name: 'Ahmed', course: 'Mobile UI', semester: '3' },
  { id: '4', name: 'Aisha', course: 'React Native', semester: '4' },
  { id: '5', name: 'Hassan', course: 'JavaScript', semester: '2' },
  { id: '6', name: 'Fatima', course: 'Mobile UI', semester: '1' },
  { id: '7', name: 'Omar', course: 'React Native', semester: '3' },
  { id: '8', name: 'Zainab', course: 'JavaScript', semester: '4' },
  { id: '9', name: 'Yusuf', course: 'Mobile UI', semester: '1' },
  { id: '10', name: 'Layla', course: 'React Native', semester: '2' },
  { id: '11', name: 'Bilal', course: 'JavaScript', semester: '3' },
  { id: '12', name: 'Mariam', course: 'Mobile UI', semester: '4' },
  { id: '13', name: 'Khalid', course: 'React Native', semester: '1' },
  { id: '14', name: 'Nadia', course: 'JavaScript', semester: '2' },
  { id: '15', name: 'Tariq', course: 'Mobile UI', semester: '3' },
  { id: '16', name: 'Sana', course: 'React Native', semester: '4' },
  { id: '17', name: 'Rashid', course: 'JavaScript', semester: '1' },
  { id: '18', name: 'Huda', course: 'Mobile UI', semester: '2' },
  { id: '19', name: 'Faisal', course: 'React Native', semester: '3' },
  { id: '20', name: 'Amina', course: 'JavaScript', semester: '4' },
];

//............................................CustomHeader Component..................................................
// component which will be used to display the header with title and filter button
// it will receive title, onFilterPress and selectedSemester as props
// title: the title of the header
// onFilterPress: the function to be called when the filter button is pressed
// selectedSemester: the currently selected semester for filtering
const CustomHeader = ({ title, onFilterPress, selectedSemester }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
    <Button
      title={
        selectedSemester ? `Semester: ${selectedSemester}` : 'All Students'
      }
      onPress={onFilterPress}
    />
  </View>
);
//............................................CustomHeader Component..................................................

//............................................StudentCard Component..................................................
// component which will be used to display each student card
// it will receive name, course and semester as props
// name: the name of the student
// course: the course of the student
// semester: the semester of the student
const StudentCard = ({ name, course, semester }) => (
  <View style={styles.studentCard}>
    <Text style={styles.name}>Name: {name}</Text>
    <Text style={styles.course}>Course: {course}</Text>
    <Text style={styles.semester}>Semester: {semester}</Text>
  </View>
);
//............................................StudentCard Component..................................................

//............................................App Component..................................................
const StudentDirectory = () => {
  // State to hold the list of students and the selected semester for filtering
  const [students] = useState(studentsData);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // Filter students based on the selected semester
  const filteredStudents = selectedSemester
    ? students.filter(student => student.semester === selectedSemester)
    : students;

  // Function to handle the filter button press
  // It toggles through the semesters 1 to 4 and resets to null after 4
  // This allows the user to cycle through the semesters and view students accordingly
  // If no semester is selected, it starts with semester 1
  const handleFilterToggle = () => {
    if (selectedSemester === null) setSelectedSemester('1');
    else if (selectedSemester === '1') setSelectedSemester('2');
    else if (selectedSemester === '2') setSelectedSemester('3');
    else if (selectedSemester === '3') setSelectedSemester('4');
    else setSelectedSemester(null);
  };

  // Render the main view with the custom header and the list of students
  // The CustomHeader component is used to display the title and filter button
  // The FlatList component is used to efficiently render the list of students
  // Each student is displayed using the StudentCard component,
  // which shows the student's name, course, and semester
  return (
    <View style={styles.container}>
      <CustomHeader
        title="Student Directory"
        onFilterPress={handleFilterToggle}
        selectedSemester={selectedSemester}
      />
      {/* Render the list of students using FlatList for better performance with large lists */}
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          // Render each student card with the student's details
          // The StudentCard component is used to display the name, course, and semester of each student
          <StudentCard
            name={item.name}
            course={item.course}
            semester={item.semester}
          />
        )}
      />
      {/* button to show summary of students semester wise */}
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Button
          title="Show Summary"
          onPress={() =>
            alert(
              `Total Students in Semester ${selectedSemester || 'All'}: ${filteredStudents.length}`,
            )
          }
        />
      </View>
    </View>
  );
};
//............................................StudentDirectory Component..................................................

//............................................Styles..................................................
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#b4caf5',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 6,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  course: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 2,
  },
  semester: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
//............................................Styles..................................................

export default StudentDirectory;
