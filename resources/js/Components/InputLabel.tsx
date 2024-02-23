import { LabelHTMLAttributes } from 'react'

export default function InputLabel({ value, className = '', children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
  return (
  // <label {...props} className={'block font-medium text-sm text-gray-700 dark:text-gray-300 ' + className}>
    <label {...props} className={'absolute left-0 ml-1 px-1 -translate-y-3 bg-white text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500  ' + className}>
      {value ? value : children}
    </label>
  )
}
