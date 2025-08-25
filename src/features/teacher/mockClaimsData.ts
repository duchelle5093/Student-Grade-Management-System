// Données mockées pour les revendications
export const mockClaimsData = {
  // Étudiants avec revendications
  studentsWithClaims: [
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      studentId: "ST001",
      grades: [
        {
          subjectCode: "MATH101",
          subjectName: "Mathématiques",
          cc: 12,
          sn: 45,
          claims: [
            {
              id: "claim_1",
              period: "CC",
              status: "PENDING",
              requestedScore: 18,
              cause: "Erreur de calcul",
              description: "Je pense qu'il y a une erreur dans la correction de l'exercice 3",
              createdAt: "2024-01-15T10:30:00Z"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      firstName: "Marie",
      lastName: "Martin",
      studentId: "ST002",
      grades: [
        {
          subjectCode: "MATH101",
          subjectName: "Mathématiques",
          cc: 8,
          sn: 38,
          claims: [
            {
              id: "claim_2",
              period: "SN",
              status: "PENDING",
              requestedScore: 50,
              cause: "Question mal comprise",
              description: "La question 2 était ambiguë, j'ai répondu correctement selon ma compréhension",
              createdAt: "2024-01-16T14:20:00Z"
            }
          ]
        }
      ]
    }
  ]
};

export interface ClaimData {
  id: string;
  period: "CC" | "SN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedScore: number;
  cause: string;
  description: string;
  createdAt: string;
}

export interface GradeWithClaims {
  subjectCode: string;
  subjectName: string;
  cc: number | null;
  sn: number | null;
  claims?: ClaimData[];
}

export interface StudentWithClaims {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  grades: GradeWithClaims[];
}