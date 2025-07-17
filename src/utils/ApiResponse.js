class ApiResponse
{
    constructor(statusCode,message="Successful",data,)
    {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

export {ApiResponse}