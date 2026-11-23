import {DatabaseSync} from 'node:sqlite';
export function d1(db){return {prepare(sql){return {args:[],bind(...args){this.args=args;return this},async run(){const result=db.prepare(sql).run(...this.args);return {success:true,meta:{changes:Number(result.changes)}}},async all(){return {success:true,results:db.prepare(sql).all(...this.args)}}}},async batch(statements){db.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.all());db.exec('COMMIT');return results}catch(error){db.exec('ROLLBACK');throw error}}}}
export {DatabaseSync};
