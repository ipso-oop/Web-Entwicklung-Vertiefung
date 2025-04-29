import React from 'react';

function MessageCounter({ count }) {
  return (
    <div className="message-counter">
      <span className="badge bg-primary">
        Messages Sent: {count}
      </span>
    </div>
  );
}

export default MessageCounter; 