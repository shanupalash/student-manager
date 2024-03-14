document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentmanager');
    const table = document.getElementById('bookedStatus');
    const totalStudent = document.getElementById('totalStudent');
    let studentCount = 0;
    let selectedStudentId = null;

    const curdurl = 'https://crudcrud.com/api/3077463858ea4336acd4e5b0725c940a';

    function fetchStudents(callback) {
        fetch(curdurl + '/students')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                return response.json();
            })
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                callback(error, []);
            });
    }

    function addStudent(name, mobile, address, callback) {
        fetch(curdurl + '/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, mobile, address })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add student');
            }
            return response.json();
        })
        .then(data => {
            callback(null, data);
        })
        .catch(error => {
            console.error('Error adding student:', error);
            callback(error, null);
        });
    }

    function updateStudent(id, name, mobile, address, callback) {
        fetch(curdurl + '/students/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, mobile, address })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update student');
            }
            return response.json();
        })
        .then(data => {
            callback(null, data);
        })
        .catch(error => {
            console.error('Error updating student:', error);
            callback(error, null);
        });
    }

    function deleteStudent(id, callback) {
        fetch(curdurl + '/students/' + id, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete student');
            }
            callback(null, true);
        })
        .catch(error => {
            console.error('Error deleting student:', error);
            callback(error, false);
        });
    }

    function displayStudents() {
        table.innerHTML = ''; // Clear table
        fetchStudents((error, students) => {
            if (error) {
                console.error('Error fetching students:', error);
                studentCount = 0;
                totalStudent.textContent = "Total Student: " + studentCount;
                return;
            }
            studentCount = students.length;
            totalStudent.textContent = "Total Student: " + studentCount;

            students.forEach(student => {
                const row = table.insertRow(-1);
                row.insertCell(0).textContent = student.name;
                row.insertCell(1).textContent = student.mobile;
                row.insertCell(2).textContent = student.address;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editStudent(student._id, student.name, student.mobile, student.address));
                row.insertCell(3).appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteStudentHandler(student._id));
                row.insertCell(4).appendChild(deleteButton);
            });
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const address = document.getElementById('address').value;

        if (selectedStudentId) {
            updateStudent(selectedStudentId, name, mobile, address, (error, data) => {
                if (error) {
                    console.error('Error updating student:', error);
                    return;
                }
                selectedStudentId = null;
                form.reset();
                displayStudents();
            });
        } else {
            // Add new student
            addStudent(name, mobile, address, (error, data) => {
                if (error) {
                    console.error('Error adding student:', error);
                    return;
                }
                form.reset();
                displayStudents();
            });
        }
    });

    function editStudent(id, name, mobile, address) {
        selectedStudentId = id;
        document.getElementById('name').value = name;
        document.getElementById('mobile').value = mobile;
        document.getElementById('address').value = address;
    }

    function deleteStudentHandler(id) {
       
            deleteStudent(id, (error, success) => {
                if (error) {
                    console.error('Error deleting student:', error);
                    return;
                }
                displayStudents();
            });
        
    }

    displayStudents();
});
