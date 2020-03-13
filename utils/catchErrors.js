function catchErrors(error, displayError) {
    let errorMsg
    if(error.response){
        // the request was made and response status is not in the range of 2XX
        errorMsg = error.response.data;
        
        // for Cloudinary specific error
        if(error.response.data.error){
            errorMsg = error.response.data.error.message;
        }
        console.error("Error Response",errorMsg)
    } else if(error.request) {
        // the request was made and no response was received
        errorMsg = error.request
        console.error("Error Request",errorMsg)
    } else {
        // something else happened in making the request which triggered the error  
        errorMsg = error.message
        console.error("Error Message",errorMsg)
    }
    displayError(errorMsg);
}

export default catchErrors;