import React,{ useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layouts/Layout';
import Error404 from '../../components/layouts/404';
import Spinner from '../../components/ui/Spinner';
import { FormField, InputSubmit} from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const ProductContainer = styled.div `
    @media (min-width:768px) {
        display:grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const ProductCreator = styled.p `
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align: center;
`;

const Product = () => {
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});
    const [getDB, setGetDB] = useState(true);

    const router = useRouter();
    const { query: { id } } = router;

    const { firebase, user } = useContext(FirebaseContext);

    const { comments, created, description, company, name, url, imageUrl, votes, creator, voted} = product;

    const voteProduct = () => {
        if(!user){
            return router.push('/login')
        }
        const totalVotes = votes + 1;

        if(voted.includes(user.uid)) return;

        const hasVoted = [...voted, user.uid]

        firebase.db.collection('products').doc(id).update({ votes: totalVotes, voted: hasVoted });

        setProduct({
            ...product,
            votes: totalVotes
        })

        setGetDB(true);
    }

    const handleChange = e => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        })
    }

    const isCreator = id => {
        if(creator.id === id){
            return true;
        }
    }

    const addComment = e => {
        e.preventDefault();
        if(!user){
            return router.push('/login')
        }

        comment.userId = user.uid;
        comment.username = user.displayName;
        comment.published = Date.now();

        const newComment = [comment, ...comments];

        firebase.db.collection('products').doc(id).update({ comments: newComment })

        setProduct({
            ...product,
            comments: newComment
        })

        setGetDB(true);
    }

    const canDelete = () => {
        if(!user) return false;

        if(creator.id === user.uid){
            return true;
        }
    }

    const deleteProduct = async () => {

        if(!user){
            return router.push('/login')
        }
        if(creator.id !== user.uid){
            return router.push('/');
        }

        try {
            await firebase.db.collection('products').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(id && getDB){
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id);
                const prod = await productQuery.get();
                if(prod.exists){
                    setProduct(prod.data());
                    setGetDB(false);
                } else {
                    setError(true);
                    setGetDB(false);
                }
            }
            getProduct()
        }
    }, [id, product])


    return ( 
        <Layout>
            <>
                {error && <Error404/>}
                {(Object.keys(product).length === 0 && !error) && <Spinner/>}
                {Object.keys(product).length !== 0 && (
                <div className="contenedor">
                    <h1
                        css={css `
                            text-align: center;
                            margin-top: 1rem;
                        `}
                    >{name}</h1>

                    <ProductContainer>
                        <div>
                            <p>Published: { formatDistanceToNow(new Date(created)) } ago</p>
                            <p>By {creator?.name} from: {company}</p>
                            <img src={imageUrl} alt={name}/>

                            <p>{description}</p>

                            {user && (
                                <>
                                    <h2>Add a comment: </h2>

                                    <form
                                        onSubmit={addComment}
                                    >
                                        <FormField>
                                            <input 
                                                type="text" 
                                                name="message"
                                                onChange={handleChange}
                                            />
                                        </FormField>
                                        <InputSubmit
                                            type="submit"
                                            value="Add comment"
                                        />
                                    </form> 
                                </>
                            )}

                            <h2
                                css={css `
                                    margin: 2rem 0;
                                `}
                            >Comments: </h2>

                            {comments.length === 0 ? "No comments yet" : (
                                <ul>
                                {comments.map((comm, i) => (
                                    <li
                                        key={`${comm.userId}-${i}`}
                                        css={css `
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}
                                    >
                                        <p>{comm.message}</p>
                                        <p>
                                            From:{' '}
                                            <span
                                                css={css `
                                                    font-weight:bold;
                                                `}
                                            >
                                                {comm.username}
                                            </span>                                        
                                        </p>
                                        <p
                                            css={css `
                                                font-style:italic;
                                            `}
                                        >{ formatDistanceToNow(new Date(comm?.published)) } ago</p>
                                        { isCreator(comm.userId) && <ProductCreator>Creator</ProductCreator>}
                                    </li>
                                ))}
                                </ul>
                            )}
                            

                        </div>
                        <aside>
                            <Button
                                target="_blank"
                                bgColor= "true"
                                href={url}
                            >Visit URL</Button>
                            <div
                                css={css `
                                    margin-top: 5rem;
                                `}
                            >
                                <p
                                    css={css `
                                        text-align: center;
                                    `}
                                >{votes} Votes</p>

                                {user && (
                                    <Button
                                        onClick={voteProduct}
                                    >
                                        Vote
                                    </Button>
                                )}

                            </div>
                        </aside>
                    </ProductContainer>

                    {canDelete() && 
                        <Button
                            onClick={deleteProduct}
                        >Delete product</Button>
                    }
                </div>
                )}
            </>
        </Layout>
     );
}
 
export default Product;