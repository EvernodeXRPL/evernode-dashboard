import React from 'react'

const LabelText = ({ children, labelType }) => {
    return (
        <div className={`h-auto py-1 badge badge-${labelType}`} style={{ width: '4.5rem', fontSize: '0.75rem', textAlign: 'center' }}>
            {children}
        </div>
    )
}

export default LabelText