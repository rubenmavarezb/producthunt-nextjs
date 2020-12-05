import React from 'react'
import Layout from '../components/layouts/Layout';
import Spinner from '../components/ui/Spinner';
import ProductDetail from '../components/layouts/ProductDetail';
import useProducts from '../hooks/useProducts';


export default function Trending() {

  const { products, mounted} = useProducts('votes');

  return (
    <div>
        <Layout>
          {products.length === 0 && <Spinner/>}
          {(products.length !== 0 && mounted) && (
            <div className="listado-productos">
              <div className="contenedor">
                <ul className="bg-white">
                  {products.map(product => (
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

