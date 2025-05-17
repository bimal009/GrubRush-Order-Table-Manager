import React from 'react';
import { CardProps } from '@/types';

const DetailsCard = ({ title, value, content, icon, secondaryValue }: CardProps) => {
    return (
        <div className="w-full bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <div className="text-orange-500 bg-orange-50 p-1.5 rounded-md">
                    {icon}
                </div>
            </div>

            {/* Content Section */}
            <div>
                <div className="text-2xl font-bold tracking-tight">
                    {value}
                </div>
                {secondaryValue && (
                    <div className="text-sm text-muted-foreground mt-1.5">
                        <span className="text-orange-500 font-medium">{secondaryValue}</span> {content}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailsCard;