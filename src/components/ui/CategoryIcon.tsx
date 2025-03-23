
import React from 'react';
import { iconSet } from '@/lib/mockData';

interface CategoryIconProps {
  iconName: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName }) => {
  const IconComponent = iconSet[iconName as keyof typeof iconSet];
  
  if (IconComponent) {
    return <IconComponent className="h-5 w-5" />;
  }
  
  return null;
};

export default CategoryIcon;
