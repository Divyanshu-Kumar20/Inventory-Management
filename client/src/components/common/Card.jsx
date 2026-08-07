import React from 'react';

export const Card = ({ title, action, children, className = '', style = {}, onClick, ...props }) => {
  return (
    <div className={`card ${className}`} style={style} onClick={onClick} {...props}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};
