import React from 'react';

function Feedback({ message, type }) {
    const baseStyle = { marginTop: '20px' };
    const styles = {
        success: { ...baseStyle, color: 'green' },
        error: { ...baseStyle, color: 'red' },
        loading: { ...baseStyle, color: 'grey' }
    };

    return <p style={styles[type]}>{message}</p>;
}

export default Feedback;