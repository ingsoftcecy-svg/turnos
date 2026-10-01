import React from 'react';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  type?: 'text' | 'date' | 'number';
  paddingLeft?: string;
  borderRight?: string;
}

/**
 * A reusable table cell with an editable input field.
 */
export const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  onChange, 
  color, 
  textAlign = 'center', 
  type = 'text',
  paddingLeft,
  borderRight
}) => {
  const cellStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRight: borderRight || '1px solid #ddd'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    textAlign,
    color: color || 'inherit',
    backgroundColor: 'transparent',
    paddingLeft,
    padding: type === 'date' ? '8px 0' : undefined
  };

  return (
    <td style={cellStyle}>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        style={inputStyle} 
      />
    </td>
  );
};
