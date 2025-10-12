import { Injectable, NotFoundException } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';

@Injectable()
export class DatabaseService {
    private db: JsonDB
    constructor(){
        const dbConfig = new Config('my-db', true, false, '/')
        this.db = new JsonDB(dbConfig)
    }

    async push(path: string, value: any): Promise<void>{
        try{
            await this.db.push(path, value)
        }catch(err){
            throw new NotFoundException(err.message, err.name)
        }
    }

    async get(path: string): Promise<any>{
        try{
            return await this.db.getData(path)
        }catch(err){
            throw new NotFoundException(err.message, err.name)
        }
    }

    async delete(path: string): Promise<void>{
        try{
            await this.db.delete(path)
        }catch(err){
            throw new NotFoundException(err.message, err.name)
        }
        
    }
}
