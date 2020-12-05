import React, { useState, useEffect } from 'react'
import Layout from '../components/layouts/Layout';
import Spinner from '../components/ui/Spinner';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import ProductDetail from '../components/layouts/ProductDetail';
import useProducts from '../hooks/useProducts';


const OrderDiv = styled.div `
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size:1.8rem;

  label{
    margin-right: 1rem;
  }
  select{
    width: 15rem;
    padding: .5rem 2rem;
    border: 1px solid var(--orange);
    background-color: #FFF
  }

  button{
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .5rem 2rem;
    background-color: var(--orange);
    color: #FFF;
  }
`;

export default function Search() {
  console.log('activo')
  const [result, setResult] = useState([]);
  const [order, setOrder] = useState('created');

  const router = useRouter();
  const { query: { q }} = router;

  
  const goBack = () => {
    return router.push('/')
  }

  const handleOptions = e => {
    setOrder(e.target.value)
  }

  const { products, mounted } = useProducts(order);

  useEffect(() => {
    const search = q?.toLowerCase();

    const filterDB = products.filter(product => product.name.toLowerCase().includes(search));

    setResult(filterDB);
  }, [q, products, order])

  return (
    <div>
        <Layout>
          {result.length === 0 && <Spinner/>}
          {(result.length !== 0 && mounted) && (
            <div className="listado-productos">
              <div className="contenedor">
                <OrderDiv>
                  <form>
                    <label htmlFor="ordeBy">Order by:</label>
                      <select 
                        name="orderBy"
                        onInput={handleOptions}
                      >
                        <option value="created">Created</option>
                        <option value="votes">Votes</option>
                      </select>
                  </form>
                    <button
                    onClick={ goBack }
                  >Go back</button>
                </OrderDiv>
                <ul className="bg-white">
                  {result.map(product => (
                    <ProductDetail
                      key={product.id}
                      product={product}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )}

        </Layout>
    </div>
  )
}
