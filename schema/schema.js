const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt
} = graphql;



//Dummy Data 
let books = [
    { name: "Book 1", genre: "Fantasy", id: "1", authorId: "1" },
    { name: "Book 2", genre: "Game", id: "2", authorId: "2" },
    { name: "Book 3", genre: "Action", id: "3", authorId: "1" },
    { name: "Book 4", genre: "Sci-Fri", id: "4", authorId: "3" },
    { name: "Book 5", genre: "Shooting", id: "5", authorId: "2" },
]

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];



const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent);
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return _.find(authors, { id: args.id });
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery
})