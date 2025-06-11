
import React from 'react';
import DamageAssessmentTab from './DamageAssessmentTab';
import { ReturnDamageItem } from '../FleetReturnForm.types';

interface ReturnDamageAssessmentTabProps {
  damages: ReturnDamageItem[];
  onDamageUpdate: (damages: ReturnDamageItem[]) => void;
  isViewMode?: boolean;
}

const ReturnDamageAssessmentTab: React.FC<ReturnDamageAssessmentTabProps> = ({
  damages,
  onDamageUpdate,
  isViewMode = false
}) => {
  return (
    <DamageAssessmentTab
      damages={damages}
      onDamageUpdate={onDamageUpdate}
      isViewMode={isViewMode}
    />
  );
};

export default ReturnDamageAssessmentTab;
