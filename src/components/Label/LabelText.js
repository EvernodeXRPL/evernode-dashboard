import React from 'react'

const LabelText = ({ children, labelType }) => {
    return (
        <div className={`h-auto py-2 badge badge-${labelType}`} style={{ width: '4.8rem', fontSize: '0.75rem' }}>
            {children}
        </div>
    )
}

export default LabelText