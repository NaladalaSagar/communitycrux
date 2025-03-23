
import React from 'react';
import { iconSet } from '@/lib/mockData';

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

const CategoryIcon = ({ iconName, className = "h-5 w-5" }: CategoryIconProps) => {
  const Icon = iconSet[iconName as keyof typeof iconSet];
  
  if (!Icon) {
    return null;
  }
  
  return <Icon className={className} />;
};

export default CategoryIcon;
