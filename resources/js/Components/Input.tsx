import styles from './Input.module.css'

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  htmlFor: string,
  containerClassName?: string,
  labelClassName?: string,
  label: string
  errorMessages?: string[]
  errorClassname?: string
}

const Input = (props: Props) => {
  const { label, type, htmlFor, labelClassName, containerClassName, errorClassname, errorMessages, className, ...restProps } = props

  return (
    <div className={`${styles.inputContainer}${containerClassName ? ` ${containerClassName}` : ''}`}>
      <input 
        name={htmlFor || props.id || props.name}
        id={htmlFor || props.id || props.name}
        type={type} className={`peer ${styles.inputField}${className ? ` ${className}` : ''}`} {...restProps} />
      <label
        htmlFor={htmlFor}
        className={`${styles.labelBox} 
        peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:text-base 
         text-base
        peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-3 
        peer-focus:px-1${labelClassName ? ` ${labelClassName}` : ''}
        ${props.required ? ` ${styles.required}` : ''}`}
      >
        {label}
      </label>
      {
        errorMessages?.length ? (
          <div>
            {errorMessages.map((message, index) => (
              <p key={index} className={`${styles.error}${errorClassname ? ` ${errorClassname}` : ''}`}>{message}</p>
            ))}
          </div>
        ) : <></>
      }
    </div>
  )
}

export default Input