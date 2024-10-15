import * as S from "./style"

const InputForm = (props) => {
  const { placeholder = "Nhập Text", ...rests } = props
  const handleOnchangeInput = (e) => {
    props.onChange(e.target.value)
  }
  return (
    <S.WrapperInput
      placeholder={placeholder}
      value={props.value}
      {...rests}
      onChange={handleOnchangeInput}
    />
  )
}

export default InputForm
