import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { listGradeClaims } from '../features/grades/actions';
import { GradeClaimResDto } from '../api/reponse-dto/gradeClaim.res.dto';

export const useClaims = () => {
    const dispatch = useAppDispatch();
    const { claims, claimsLoading, error } = useAppSelector(state => state.grades);

    useEffect(() => {
        dispatch(listGradeClaims());
    }, [dispatch]);

    const refreshClaims = () => {
        dispatch(listGradeClaims());
    };

    // Transformer les données API en format compatible avec l'interface
    const getClaimsForStudent = (studentId: number, period: 'cc1' | 'sn1' | 'cc2' | 'sn2') => {
        const periodMap = {
            cc1: 'CC_1',
            sn1: 'SN_1', 
            cc2: 'CC_2',
            sn2: 'SN_2'
        };

        return claims.filter(claim => 
            claim.studentId === studentId && 
            claim.period === periodMap[period] &&
            claim.status === 'PENDING'
        );
    };

    const getPendingClaimsCount = () => {
        return claims.filter(claim => claim.status === 'PENDING').length;
    };

    return {
        claims,
        claimsLoading,
        error,
        refreshClaims,
        getClaimsForStudent,
        getPendingClaimsCount
    } as const;
};