import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { listGradeClaims } from '../features/grades/actions';


export const useClaims = (currentSubjectId?: number) => {
    const dispatch = useAppDispatch();
    const { claims, claimsLoading, error } = useAppSelector(state => state.grades);
    const { profile } = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(listGradeClaims());
    }, [dispatch]);

    const refreshClaims = async () => {
        await dispatch(listGradeClaims());
    };

    // Transformer les données API en format compatible avec l'interface
    const getClaimsForStudent = (studentId: number, period: 'cc1' | 'sn1' | 'cc2' | 'sn2') => {
        const periodMap = {
            cc1: ['CC_1', 'CC #1'],
            sn1: ['SN_1', 'SN #1'], 
            cc2: ['CC_2', 'CC #2'],
            sn2: ['SN_2', 'SN #2']
        };

        const filteredClaims = claims.filter(claim => {
            const studentMatch = claim.studentId === studentId;
            const periodMatch = periodMap[period].includes(claim.period);
            const statusMatch = claim.status === 'PENDING';
            const subjectMatch = profile?.subjects?.some(subject => 
                subject.code === claim.subjectCode && 
                (!currentSubjectId || subject.id === currentSubjectId)
            );
            
            return studentMatch && periodMatch && statusMatch && subjectMatch;
        });
        
        return filteredClaims;
    };

    const getPendingClaimsCount = () => {
        const pendingClaims = claims.filter(claim => {
            const statusMatch = claim.status === 'PENDING';
            const subjectMatch = profile?.subjects?.some(subject => 
                subject.code === claim.subjectCode &&
                (!currentSubjectId || subject.id === currentSubjectId)
            );
            
            return statusMatch && subjectMatch;
        });
        
        return pendingClaims.length;
    };
    
    const getAllPendingClaimsCount = () => {
        return claims.filter(claim => 
            claim.status === 'PENDING' &&
            profile?.subjects?.some(subject => subject.code === claim.subjectCode)
        ).length;
    };

    return {
        claims,
        claimsLoading,
        error,
        refreshClaims,
        getClaimsForStudent,
        getPendingClaimsCount,
        getAllPendingClaimsCount
    } as const;
};