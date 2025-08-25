import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchActivePeriod } from '../features/grades/actions';
import { useNotification } from '../contexts/notification/context';

interface UseActivePeriodPollingProps {
    enabled?: boolean;
    interval?: number; // en millisecondes
}

export const useActivePeriodPolling = ({ 
    enabled = true, 
    interval = 10000 // 10 secondes par défaut
}: UseActivePeriodPollingProps = {}) => {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const { activePeriod, loading } = useAppSelector(state => state.grades || {});
    const intervalRef = useRef(null);
    const previousPeriodRef = useRef<string | null>(null);

    // Fonction pour récupérer la période active
    const fetchPeriod = async () => {
        if (loading) return; // Éviter les requêtes multiples
        
        try {
            const result = await dispatch(fetchActivePeriod());
            
            if (fetchActivePeriod.fulfilled.match(result)) {
                const newPeriod = result.payload?.shortName;
                
                // Notifier si la période a changé
                if (previousPeriodRef.current && 
                    previousPeriodRef.current !== newPeriod && 
                    newPeriod) {
                    notify({
                        type: 'info',
                        message: 'Période changée',
                        description: `La période active est maintenant : ${newPeriod}`,
                    });
                }
                
                previousPeriodRef.current = newPeriod;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la période active:', error);
        }
    };

    useEffect(() => {
        if (!enabled) return;

        // Récupération initiale
        fetchPeriod();

        // Démarrer le polling
        intervalRef.current = setInterval(fetchPeriod, interval);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, interval, dispatch]);

    // Fonction pour forcer une mise à jour
    const refreshPeriod = () => {
        fetchPeriod();
    };

    // Mapper la période vers les colonnes éditables
    const getEditableColumns = (periodShortName?: string): string[] => {
        if (!periodShortName) return ["cc1"]; // Fallback vers CC1 si aucune période active
        
        const mapping: Record<string, string[]> = {
            "CC_1": ["cc1"],
            "SN_1": ["sn1"],
            "CC_2": ["cc2"],
            "SN_2": ["sn2"]
        };
        
        return mapping[periodShortName] || ["cc1"]; // Fallback vers CC1 si période inconnue
    };

    return {
        activePeriod,
        loading,
        refreshPeriod,
        editableColumns: getEditableColumns(activePeriod?.shortName),
        isPollingEnabled: enabled && !!intervalRef.current
    };
};