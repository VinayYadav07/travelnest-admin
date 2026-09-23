const Notification = ({ notification }) => {
  // If there is no notification, show nothing
  if (!notification) {
    return null;
  }

  return (
    <div className="toast-wrap">
      <div className={`toast toast-${notification.type}`}>
        {notification.message}
      </div>
    </div>
  );
};

export default Notification;
