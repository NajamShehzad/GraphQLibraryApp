const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
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
        _id: {
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
                return Author.findOne({ _id: parent.authorId });
            }
        }
    })
});
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorId: parent._id });
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: {
                _id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Book.findOne({ _id: args._id }); x
            }
        },
        author: {
            type: AuthorType,
            args: {
                _id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Author.findById(args._id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve() {
                return Author.find({})
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, args) {
                try {
                    let newAuthor = new Author({ name: args.name, age: args.age });
                    let authorData = await newAuthor.save();
                    console.log(authorData);
                    return authorData;
                } catch (err) {

                }
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            async resolve(parent, args) {
                try {
                    let newBook = new Book({ name: args.name, authorId: args.authorId, genre: args.genre });
                    return newBook.save();

                } catch (err) {

                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})