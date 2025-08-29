import React from 'react';
import { Tag, Space, Button, Tooltip } from 'antd';
import { ReloadOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useActivePeriodPolling } from '../hooks/useActivePeriodPolling';

interface ActivePeriodIndicatorProps {
    showRefreshButton?: boolean;
    size?: 'small' | 'default' | 'large';
}

export const ActivePeriodIndicator: React.FC<ActivePeriodIndicatorProps> = ({
    showRefreshButton = true
}) => {
    const { activePeriod, loading, refreshPeriod, isPollingEnabled } = useActivePeriodPolling();

    const getPeriodColor = (shortName?: string) => {
        if (!shortName) return 'default';
        
        if (shortName.includes('CC')) return 'blue';
        if (shortName.includes('SN')) return 'green';
        return 'default';
    };



    return (
        <Space>
            <Tag 
                color={getPeriodColor(activePeriod?.shortName)}
                icon={<ClockCircleOutlined />}
                className="flex items-center"
            >
                <span className="font-medium">
                    Période : {activePeriod?.name || 'Non définie'}
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