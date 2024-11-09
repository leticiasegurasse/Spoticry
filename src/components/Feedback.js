import React from 'react';

function Feedback({ message, type }) {
    const styles = {
        success: { color: 'green' },
        error: { color: 'red' },
        loading: { color: 'blue' }
    };

    return <p style={styles[type]}>{message}</p>;
}

export default Feedback;