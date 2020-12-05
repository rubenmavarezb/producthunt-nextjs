import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layouts/Layout'
import { Form, FormField, InputSubmit, Error } from '../components/ui/Form';
import useValidation from '../hooks/useValidation';
import validateNewAccount from '../validation/validateNewAccount';
import firebase from '../firebase';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: ''
}

export default function NewAccount() {

  const [fbError, setFbError] = useState(false);

  const { values, 
          error, 
          handleSubmit, 
          handleChange,
          handleBlur } = useValidation(INITIAL_STATE, validateNewAccount, createAccount);

  const { name, email, password} = values;
  

  async function createAccount() {

    try {

      await firebase.register(name, email, password);
      Router.push('/');

    } catch (error) {

      console.error('there was an error', error);
      setFbError( error.message )

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
            >New account</h1>
            <Form
              onSubmit={handleSubmit}
            >
              <FormField>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name..."
                  name="name"
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormField>

              {error.name && <Error>{error.name}</Error>}

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
                value="Create account"
              />
            </Form>           
          </>
        </Layout>
    </div>
  )
}
