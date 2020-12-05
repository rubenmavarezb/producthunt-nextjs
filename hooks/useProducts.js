import { useState, useEffect, useContext} from 'react';
import { FirebaseContext } from '../firebase';

const useProducts = orderBy => {
    const [products, setProducts] = useState([]);
    const [mounted, setMounted] = useState(true);
  
    const { firebase } = useContext(FirebaseContext);
  
    useEffect(() => {
      setMounted(true)
      const getProducts = () => {
        firebase.db.collection('products').orderBy(orderBy, 'desc').onSnapshot(handleSnapshot)
      }
      getProducts();
      return () => setMounted(false)
    }, [])
  
    function handleSnapshot(snapshot){
      const products = snapshot.docs.map(doc => {
        return {
          id:doc.id,
          ...doc.data()
        }
      })
      setProducts(products)
    }

    return {
        products,
        mounted
    }
}

export default useProducts;