# I - Setup Vite

```bash
yarn create vite
```

Hoặc có thể tạo project bằng Create-react-app

- Choose Project Name
- Choose Framework Front-End
- Choose trình Compiled Typescript => Javascript
- Yarn => Khởi tạo yarn
- Yarn Dev => Run project

## I.1 - Config port in Vite

- Mặc định Vite sẽ chạy trên Url: 127.0.0.1...
- Ta có thể Config Port của Project lại

```ts - [vite.config.ts]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

## I.2 - Config Enble Source map for CSS

Cài package `@types/node` để sử dụng node js trong file ts không bị lỗi

```bash
yarn add -D @types/node
```

file `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },

  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
```

# II - Install Eslint + Prettier + Tailwind

> Chúng ta sẽ cài hơi nhiều package 1 tí vì chúng ta setup từ đầu, còn Create React App setup sẵn 1 số thứ về ESLint rồi.

Dưới đây là những depedency mà chúng ta cần cài

- ESLint: linter (bộ kiểm tra lỗi) chính

- Prettier: code formatter chính

- @typescript-eslint/eslint-plugin: ESLint plugin cung cấp các rule cho Typescript

- @typescript-eslint/parser: Parser cho phép ESLint kiểm tra lỗi Typescript.

- eslint-config-prettier: Bộ config ESLint để vô hiệu hóa các rule của ESLint mà xung đột với Prettier.

- eslint-plugin-import: Để ESLint hiểu về cú pháp `import...` trong source code.

- eslint-plugin-jsx-a11y: Kiểm tra các vấn đề liên quan đến accessiblity (Tính thân thiện website, ví dụ cho thiết bị máy đọc sách).

- eslint-plugin-react: Các rule ESLint cho React

- eslint-plugin-prettier: Dùng thêm 1 số rule Prettier cho ESLint

- prettier-plugin-tailwindcss: Sắp xếp class tailwindcss

- eslint-plugin-react-hooks: ESLint cho React hook

Chạy câu lệnh dưới đây

```bash
yarn add eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-prettier prettier-plugin-tailwindcss eslint-plugin-react-hooks -D
```

Cấu hình ESLint

Tạo file `.eslintrc.cjs` tại thư mục root

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  extends: [
    // Chúng ta sẽ dùng các rule mặc định từ các plugin mà chúng ta đã cài.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // Disable các rule mà eslint xung đột với prettier.
    // Để cái này ở dưới để nó override các rule phía trên!.
    'eslint-config-prettier',
    'prettier'
  ],
  plugins: ['prettier'],
  settings: {
    react: {
      // Nói eslint-plugin-react tự động biết version của React.
      version: 'detect'
    },
    // Nói ESLint cách xử lý các import
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname, '')],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  env: {
    node: true
  },
  rules: {
    // Tắt rule yêu cầu import React trong file jsx
    'react/react-in-jsx-scope': 'off',
    // Cảnh báo khi thẻ <a target='_blank'> mà không có rel="noreferrer"
    'react/jsx-no-target-blank': 'warn',
    // Tăng cường một số rule prettier (copy từ file .prettierrc qua)
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  }
}
```

Tạo file `.eslintignore` (file này nêu tên các file mà eslint cần bỏ qua, không kiểm tra)

```json
node_modules/
dist/
```

Tạo file `.prettierrc`

```json
{
  "arrowParens": "always",
  "semi": false,
  "trailingComma": "none",
  "tabWidth": 2,
  "endOfLine": "auto",
  "useTabs": false,
  "singleQuote": true,
  "printWidth": 120,
  "jsxSingleQuote": true
}
```

Tạo file `.prettierignore` (file này nêu tên các file mà prettier cần bỏ qua, không kiểm tra)

```json
node_modules/
dist/
```

Thêm script mới vào `package.json`

```json
  "scripts": {
    ...
    "lint": "eslint --ext ts,tsx src/",
    "lint:fix": "eslint --fix --ext ts,tsx src/",
    "prettier": "prettier --check \"src/**/(*.tsx|*.ts|*.css|*.scss)\"",
    "prettier:fix": "prettier --write \"src/**/(*.tsx|*.ts|*.css|*.scss)\""
  },
```

## 1 - Cài editorconfig

Tạo file `.editorconfig` ở thư mục root

```EditorConfig
[*]
indent_size = 2
indent_style = space
```

## 2 - Cấu hình tsconfig.json

Set `"target": "ES2015"` và `"baseUrl": "src"` trong `compilerOptions`

## 3 - Install Tailwind

Cài các package dưới đây: Tham khảo [https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Cấu hình file config

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    // Phần này là cấu hình class container của tailwind lại theo các css property như bên dưới
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    })
    // require('@tailwindcss/line-clamp')
  ]
}
```

Thêm vào file `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# III - Config Router

Install React Router Dom

```bash
yarn add react-router-dom
```

## 1 - Tạo các components phục vụ cho việc Login/Logout/Resgister

- Tạo các components Login/Logout/Resgister và ResgisterLayout (components này sẽ bao bọc Login/Logout/Resgister ở bên trong)

## 2 - Tạo Custom Hook để Router

- Ta dùng Hook useRoutes để tạo các path kèm theo elements

```ts (router.tsx)
import { useRoutes } from 'react-router-dom'
import ProductLists from '../Pages/ProductList'
import Login from '../Pages/Login'
import Resgister from 'src/Pages/Resgister'
import ResgisterLayout from 'src/Layouts/ResgisterLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <ProductLists />
    },
    {
      path: '/login',
      element: (
        <ResgisterLayout>
          <Login />
        </ResgisterLayout>
      )
    },
    {
      path: '/resgister',
      element: (
        <ResgisterLayout>
          <Resgister />
        </ResgisterLayout>
      )
    }
  ])

  return routeElements
}
```

- Tại file App.tsx, import custom Hook (useRouteElements) mà ta đã tạo vào

```ts (App.tsx)
import useRouteElements from './Routers/router'

function App() {
  const routeElements = useRouteElements()

  return <div>{routeElements}</div>
}

export default App
```

# IV - Code UI Resgister + Login

**Component**

- Hearder + Footer (dùng chung cho Login và Register)
- Resgister
- Login

# V - Form Management with React Hook Form + Yup

- Tạo các rule để check Email, Passwrd, Confirm_password
- Cấu hình 1 file ruleForm.ts để tái sử dụng cho việc check form

```ts (register.tsx)
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { getRules } from 'src/Utils/ruleForm'

interface FormData {
  email: string
  password: string
  confirm_password: string
}

export default function Register() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>()

  const rules = getRules(getValues)

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data)
    },
    (data) => {
      const password = getValues('password')
      console.log(password)
      console.log(errors.email?.message)
      console.log(errors.password?.message)
      console.log(errors.confirm_password?.message)
    }
  )

  return (
          ...
              <input
                type='email'
                className='mt-8'
                placeholder='Email' {...register('email', rules.email)}
              />

              <input
                type='password'
                className='mt-2'
                placeholder='Password'
                autoComplete='on'
                {...register('password', rules.password)}
              />

              <input
                type='password'
                className='mt-2'
                placeholder='Confirm Password'
                autoComplete='on'
                {...register('confirm_password', { ...rules.confirm_password })}
              />
          ...
  )
}
```

- onSubmit function onSubmit tại tag form
- onValidate tại tag form để input (type email) không check validate email

```ts (Utils/ruleForm.ts)
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

//* Rule to check form register
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  //* email rule
  email: {
    required: {
      value: true,
      message: 'Email la bat buoc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email ko dung dinh dang'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 5 - 160 ky tu'
    },
    minLength: {
      value: 5,
      message: 'Do dai tu 5 - 160 ky tu'
    }
  },

  //* password rule
  password: {
    required: {
      value: true,
      message: 'Password la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6 - 160 ky tu'
    }
  },

  //* confirm password rule
  confirm_password: {
    required: {
      value: true,
      message: 'Nhap lai password'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Nhap lai mat khau' : undefined
  }
})
```
