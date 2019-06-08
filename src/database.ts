import { remote } from 'electron'
import * as path from 'path'
import * as knex from 'knex'
import 'sqlite3'

const { app } = remote

// create database
const database = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(app.getPath('userData'), 'clipmaster-clippings')
    },
    useNullAsDefault: true
})

// check table exists, if not create one
database.schema.hasTable('clippings').then((exists): knex.SchemaBuilder | undefined => {
    if (!exists) {
        // !!! must return the SchemaBuiler
        return database.schema.createTable('clippings', t => {
            t.increments('id').primary()
            t.text('content')
        })
    }
    return
})

export default database