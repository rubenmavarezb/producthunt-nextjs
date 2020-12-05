import React, { useState, useEffect } from 'react';

const useValidation = (initialState, validate, fn) => {

    const [values, setValues] = useState(initialState);
    const [error, setError] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if(submitForm){
            const noError = Object.keys(error).length === 0;

            if(noError){
                fn(); //Function that executes in the component
            }

            setSubmitForm(false);
        }
    }, [error])

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        const validationError = validate(values);
        setError(validationError);
        setSubmitForm(true);
    }

    const handleBlur = () => {
        const validationError = validate(values);
        setError(validationError);
    }

    return {
        values,
        error,
        handleSubmit,
        handleChange,
        handleBlur
    }
}
 
export default useValidation;