export default function validateNewAccount(values){

    let errors = {};

    if(!values.name){
        errors.name = 'Name is required';
    }

    if(!values.company){
        errors.company = "Company's name is required"
    }

    if(!values.url){
        errors.url = "URL is required"
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)){
        errors.url = "Wrong URL"
    }
    if(!values.description){
        errors.description = "Add a description of your product"
    }

    return errors;
}