import styled from '@emotion/styled';

export const Form = styled.form `
    max-width: 600px;
    width: 95%;
    margin: 5rem auto 0 auto;

    fieldset {
        margin: 2rem 0;
        border: 1px solid #e1e1e1;
        font-size: 2rem;
        padding: 2rem;
    }
`;

export const FormField = styled.div `
    margin-bottom:2rem;
    display:flex;
    align-items:center;

    label {
        flex: 0 0 150px;
        font-size: 1.8rem;
    }
    label.label_image {
        width: 100%;
        border: 1px solid var(--orange);
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        text-align: center;
        transition: all .5s;

        input[type="file"]{
            display:none;
        }

        &:hover{
            background-color: var(--orange);
            color: #fff;
        }
    }


    input,
    textarea {
        flex: 1;
        padding: 1rem;
    }

    textarea {
        height:400px;
    }

`;

export const InputSubmit = styled.input `
    background-color: var(--orange);
    width: 100%;
    padding: 1.5rem;
    text-align: center;
    color: #fff;
    font-size:1.8rem;
    text-transform: uppercase;
    border: none;
    font-family:'PT Sans', sans-serif;
    font-weight: 700;
    margin-bottom: 2rem;

    &:hover{
        cursor: pointer;
    }
`;

export const Error = styled.p `
    background-color: red;
    padding: 1rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color: #FFF;
    text-align: center;
    text-transform: uppercase;
    margin: 2rem 0;
`;