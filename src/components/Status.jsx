// Status details for each booking status
const STATUS_DETAILS = {
  pending: {
    className: "pill-pending",
    label: "Pending",
  },
  approved: {
    className: "pill-approved",
    label: "Approved",
  },
  rejected: {
    className: "pill-rejected",
    label: "Rejected",
  },
};

// Status component
const Status = ({ status }) => {
  // Get details for the current status
  const statusDetails = STATUS_DETAILS[status] || STATUS_DETAILS.pending;

  return (
    <span className={`pill ${statusDetails.className}`}>
      {statusDetails.label}
    </span>
  );
};

export default Status;
