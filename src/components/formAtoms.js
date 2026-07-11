import { useFormContext } from 'react-hook-form';

export const Select = ({name, inputOptions, options, placeholder, className = ''}) => {
  const {register} = useFormContext();

  return (
    <div className="select">
      <select
        {...register(name, inputOptions)}
        className={className}
      >
        <option value="" disabled selected>{placeholder}</option>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
      </select>
    </div>
  );
};

export const Radio = ({name, inputOptions, options, optCols = 3, className = ''}) => {
  const {register} = useFormContext();

  return (
    <div className="radio">
      <fieldset
        className={`w-full grid grid-cols-3 gap-4`}
        style={{gridTemplateColumns: `repeat(${optCols}, minmax(0, 1fr))`}}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-stretch">
            <input
              {...register(name, inputOptions)}
              type="radio" id={opt.value} name={name} value={opt.value} />
            <label htmlFor={opt.value} className={className}>{opt.label}</label>
          </div>
        ))}
      </fieldset>
    </div>
  );
};

export const Checkbox = ({name, inputOptions, options, optCols = 3, className = ''}) => {
  const {register} = useFormContext();

  return (
    <div className="radio">
      <fieldset
        className={`w-full grid grid-cols-3 gap-4`}
        style={{gridTemplateColumns: `repeat(${optCols}, minmax(0, 1fr))`}}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-stretch">
            <input
              {...register(name, inputOptions)}
              type="checkbox" id={opt.value} name={name} value={opt.value} />
            <label htmlFor={opt.value} className={className}>{opt.label}</label>
          </div>
        ))}
      </fieldset>
    </div>
  );
};
