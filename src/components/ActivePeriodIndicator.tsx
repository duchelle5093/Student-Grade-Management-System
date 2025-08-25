import React from 'react';
import { Tag, Space, Button, Tooltip } from 'antd';
import { ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useActivePeriodPolling } from '../hooks/useActivePeriodPolling';

interface ActivePeriodIndicatorProps {
    showRefreshButton?: boolean;
    size?: 'small' | 'default' | 'large';
}

export const ActivePeriodIndicator: React.FC<ActivePeriodIndicatorProps> = ({
    showRefreshButton = true,
    size = 'default'
}) => {
    const { activePeriod, loading, refreshPeriod, isPollingEnabled } = useActivePeriodPolling();

    const getPeriodColor = (shortName?: string) => {
        if (!shortName) return 'default';
        
        if (shortName.includes('CC')) return 'blue';
        if (shortName.includes('SN')) return 'green';
        return 'default';
    };

    const formatPeriodName = (shortName?: string) => {
        if (!shortName) return 'CC_1 (par défaut)';
        
        const mapping: Record<string, string> = {
            "CC_1": "Contrôle Continu #1",
            "SN_1": "Session Normale #1",
            "CC_2": "Contrôle Continu #2",
            "SN_2": "Session Normale #2"
        };
        
        return mapping[shortName] || shortName;
    };

    return (
        <Space>
            <Tag 
                color={getPeriodColor(activePeriod?.shortName)}
                icon={<ClockCircleOutlined />}
                className="flex items-center"
            >
                <span className="font-medium">
                    Période active : {formatPeriodName(activePeriod?.shortName)}
                </span>
            </Tag>
            
            {showRefreshButton && (
                <Tooltip title="Actualiser la période">
                    <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        loading={loading}
                        onClick={refreshPeriod}
                        className="flex items-center"
                    />
                </Tooltip>
            )}
            
            {isPollingEnabled && (
                <Tooltip title="Mise à jour automatique activée">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </Tooltip>
            )}
        </Space>
    );
};