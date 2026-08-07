import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  rightElement,
  required = false,
  className = '',
  rows,
  options, // for select type
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span
            style={{
              position: 'absolute',
              left: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <Icon size={16} />
          </span>
        )}
        
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="form-select"
            style={{ paddingLeft: Icon ? '2.5rem' : '0.875rem', paddingRight: rightElement ? '2.5rem' : '0.875rem' }}
            {...props}
          >
            {options && options.map((opt, i) => (
              <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows || 3}
            className="form-textarea"
            {...props}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-input"
            style={{
              paddingLeft: Icon ? '2.5rem' : '0.875rem',
              paddingRight: rightElement ? '2.5rem' : '0.875rem'
            }}
            {...props}
          />
        )}

        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: '0.875rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
};
