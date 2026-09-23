const StatsCard = ({ icon, color, value, label }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        <i className={`fa-solid ${icon}`} />
      </div>

      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;
