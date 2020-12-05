import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layouts/Layout'
import { Form, FormField, InputSubmit, Error } from '../components/ui/Form';
import useValidation from '../hooks/useValidation';
import validateLogin from '../validation/validateLogin';
import firebase from '../firebase';

const INITIAL_STATE = {
  email: '',
  password: ''
}

export default function Login() {

  const [fbError, setFbError] = useState(false);

  const { values, 
          error, 
          handleSubmit, 
          handleChange,
          handleBlur } = useValidation(INITIAL_STATE, validateLogin, logIn);

  const { email, password} = values;
  

  async function logIn(){
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('there was an error', error);
      setFbError( error.message );
    }
  }

  return (
    <div>
        <Layout>
          <>
            <h1
              css={css `
                text-align: center;
                margin-top: 5rem;
              `}
            >Login</h1>
            <Form
              onSubmit={handleSubmit}
            >
              <FormField>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  placeholder="Your email..."
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>

              {error.email && <Error>{error.email}</Error>}

              <FormField>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Your password..."
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>

              {error.password && <Error>{error.password}</Error>}

              {fbError && <Error>{fbError}</Error>}

              <InputSubmit
                type="submit"
                value="login"
              />
            </Form>           
          </>
        </Layout>
    </div>
  )
}