import  { Request } from 'express';

interface ExtendRequest extends Request{
    user?: any;
}

export default ExtendRequest;