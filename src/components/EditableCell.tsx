import React from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  type?: 'text' | 'date' | 'number';
}

export const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  onChange, 
  color, 
  textAlign = 'center', 
  type = 'text'
}) => {
  const isZero = value === "0" || value === "";
  const displayColor = color && color !== "#000" ? color : undefined;
  
  let inputClasses = "editable-input";
  if (isZero && !displayColor) inputClasses += " text-dim";
  if (displayColor) inputClasses += " brand-text";

  return (
    <td>
      <input 
        type={type} 
        value={typeof value === 'string' ? value.toUpperCase() : value} 
        onChange={e => onChange(e.target.value.toUpperCase())} 
        className={inputClasses}
        style={{ 
          textAlign,
          color: displayColor
        }} 
      />
    </td>
  );
};
