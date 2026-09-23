const FilterButtons = ({ options, value, onChange }) => {
  return (
    <div className="filter-pills">
      {options.map((option) => {
        // Check which option is currently selected
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            className={isActive ? "chip active" : "chip"}
            // Send the selected option to the parent component
            onClick={() => onChange(option)}
          >
            {option[0].toUpperCase()}
            {option.slice(1)}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;
