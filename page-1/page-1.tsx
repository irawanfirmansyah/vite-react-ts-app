import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Yup from 'yup'
import { createRefContext } from './store-page-1'

type AppStore = {
  email: string
  password: string
  theme: 'dark' | 'light'
}

const { Provider, useRefContext } = createRefContext<AppStore>({
  email: '',
  password: '',
  theme: 'light',
})

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required()
    .test('is_valid_email', function (value) {
      return value ? EMAIL_REGEX.test(value) : true
    }),
  password: Yup.string().required(),
})

export const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <Provider>
    <Page1 />
  </Provider>
)

function Page1() {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>hello world</h1>
      <Form />
      <Children1 />
      <Children2 />
    </div>
  )
}

function Children1() {
  const [theme, setStore] = useRefContext((store) => store.theme)

  const toggleTheme = React.useCallback(
    () => setStore({ theme: theme === 'light' ? 'dark' : 'light' }),
    [theme]
  )

  return (
    <div style={{ backgroundColor: 'wheat' }}>
      <h2>Hi, I'm children number 1!</h2>
      <p>Using store from child number 1. Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle from children 1</button>
    </div>
  )
}

function Children2() {
  return <h3>Hi, I'm children number2!</h3>
}

function Form() {
  const [email, setStore] = useRefContext((store) => store.email)
  const [password] = useRefContext((store) => store.password)

  const onSubmitForm = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
  }
  return (
    <form
      id="login_form"
      onSubmit={onSubmitForm}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        rowGap: '16px',
        backgroundColor: 'skyblue',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="input_email">Email</label>
        <input
          id="input_email"
          type="email"
          value={email}
          onChange={(evt) => setStore({ email: evt.target.value })}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="input_password">Password</label>
        <input
          id="input_password"
          type="password"
          value={password}
          onChange={(evt) => setStore({ password: evt.target.value })}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
