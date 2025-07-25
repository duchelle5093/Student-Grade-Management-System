import { studentResDto } from "../../api/reponse-dto/user.res.dto";

export const FakeStudents: studentResDto[] = [
    {
        id: 1,
        firstName: 'Student1',
        lastName: 'LastName1',
        email: 'student1@example.com',
        username: 'student1',
        role: 'STUDENT',
        topics:[
            {
                code:'MATH116',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            }
        ]
    },
    {
        id: 2,
        firstName: 'Student2',
        lastName: 'LastName2',
        email: 'student2@example.com',
        username: 'student2',
        role: 'STUDENT',
        topics:[
            {
                code:'MATH116',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            }
        ]
    },
    {
        id: 3,
        firstName: 'Student3',
        lastName: 'LastName3',
        email: 'student3@example.com',
        username: 'student3',
        role: 'STUDENT',
        topics:[
            {
                code:'MATH116',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            },
            {
                code:'Info',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            },
            {
                code:'PHYS',
                grade: 0,
                semester: 's2',
                title: 'Maths appliquees'
            },
            {
                code:'CHIM',
                grade: 0,
                semester: 's2',
                title: 'Maths appliquees'
            }
        ]
    },
    {
        id: 4,
        firstName: 'Student4',
        lastName: 'LastName4',
        email: 'student4@example.com',
        username: 'student4',
        role: 'STUDENT',
        topics:[
            {
                code:'MATH116',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            }
        ]
    },
    {
        id: 5,
        firstName: 'Student5',
        lastName: 'LastName5',
        email: 'student5@example.com',
        username: 'student5',
        role: 'STUDENT',
        topics:[
            {
                code:'MATH116',
                grade: 0,
                semester: 's1',
                title: 'Maths appliquees'
            }
        ]
    }
]