import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter} from 'next/router';
import Layout from '../components/layouts/Layout';
import Error404 from '../components/layouts/404'
import { Form, FormField, InputSubmit, Error } from '../components/ui/Form';
import useValidation from '../hooks/useValidation';
import validateNewProduct from '../validation/validateNewProduct';
import { FirebaseContext } from '../firebase';


const INITIAL_STATE = {
  name: '',
  company: '',
  url: '',
  description: '',
}

export default function NewProduct() {

  const [fbError, setFbError] = useState(false);
  const [image, setImage] = useState(null);

  const { values, 
          error, 
          handleSubmit, 
          handleChange,
          handleBlur } = useValidation(INITIAL_STATE, validateNewProduct, createProduct);

  const { name, company, url, description} = values;

  const router = useRouter();

  const { user, firebase } = useContext(FirebaseContext);

  const handleFile = e => {
    if(e.target.files[0]){
      setImage(e.target.files[0])
    }
    
  }
  
  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`products/${image.lastModified}${image.name}`).put(image);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL
  }

  async function createProduct() {
    if(!user){
      return router.push('/login')
    }

 

    const product = {
      name,
      company,
      url,
      imageUrl: await handleUpload(),
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName
      },
      voted:[]
    }

    await firebase.db.collection("products").add(product);

    return router.push('/')
    
  }

  return (
    <div>
        <Layout>
          {!user ? <Error404/> : (
            <>
              <h1
                css={css `
                  text-align: center;
                  margin-top: 5rem;
                `}
              >New product</h1>
              <Form
                onSubmit={handleSubmit}
                noValidate
              >
              <fieldset>
                <legend>General information</legend>      
              
                <FormField>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your product's name..."
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                {error.name && <Error>{error.name}</Error>}

                <FormField>
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    placeholder="Your company..."
                    name="company"
                    value={company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                {error.company && <Error>{error.company}</Error>}

                <FormField>
                  <label htmlFor="image">Product's image</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    name="image"
                    onInput={(e) => handleFile(e)}
                  />
                </FormField>

                <FormField>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    placeholder="URL of your product..."
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                {error.url && <Error>{error.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>About the product</legend>

                <FormField>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>

                {error.description && <Error>{error.description}</Error>}
              </fieldset>


                {fbError && <Error>{fbError}</Error>}

                <InputSubmit
                  type="submit"
                  value="Create product"
                />
              </Form>           
          </>
          )}

        </Layout>
    </div>
  )
}
