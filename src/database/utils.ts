import * as crypto from 'crypto';

export function hash (data: any){
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

export function randomId () {
    return crypto.randomBytes(24).toString('hex')
}