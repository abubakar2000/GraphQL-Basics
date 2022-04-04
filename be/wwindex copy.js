var { ApolloServer } = require('apollo-server');
var express = require('express')
var _id = 0
var UserProfiles = []
var Listings = []
var Bookings = []

const typeDefs = `
    enum userType {
        admin
        customer
    }

    type UserProfile {
        id: Int
        username: String!
        firstname: String!
        lastname: String!
        password: String!
        email: String!
        type: userType!  
    }

    type Listing {
        listing_id: String
        listing_title: String!
        description: String!
        street: String!
        city: String!
        postal_code: String!
        price: Int!
        email: String!
        username: String!
    }

    type Booking {
        listing_id: String
        booking_id: String!
        booking_date: String!
        booking_start: String!
        booking_end: String!
        username: String!
    }

    type Query {
        countUsers: Int!
        listUsers: [UserProfile!]!
        login_admin(username:String!, password:String!): Boolean!
        login_customer(username:String!, password:String!): Boolean!
        listListings: [Listing!]!
        listBookings: [Booking!]!
        search_listingByName(listing_title: String!): [Listing!]!
        search_listingByCity(city: String!): [Listing!]!
        search_listingByPostalcode(postal_code: String!): [Listing!]!
    }

    type Mutation {
        AddUser(
            username:String!,
            firstname: String!,
            lastname: String!,
            password: String!,
            email: String!,
            type: userType! 
        ): UserProfile,

        CreateListing(
            listing_title: String!
            description: String!
            street: String!
            city: String!
            postal_code: String!
            price: Int!
            email: String!
            username: String!
        ): Listing,

        BookListing(
            booking_date: String!
            booking_start: String!
            booking_end: String!
            username: String!
        ):Booking
    }
`

const resolvers = {
    Query: {
        countUsers: () => UserProfiles.length,
        listUsers: () => UserProfiles,
        login_admin: (parent, args) => {
            return UserProfiles
                .filter(up => up.username === args.username
                    && up.password === args.password
                    && up.type === 'admin').length !== 0 ?
                true : false
        },
        login_customer: (parent, args) => {
            return UserProfiles
                .filter(up => up.username === args.username
                    && up.password === args.password
                    && up.type === 'customer').length !== 0 ?
                true : false
        },
        listListings: () => Listings,
        listBookings: () => Bookings,
        search_listingByName: (parent, args) => Listings.filter(lt => lt.listing_title === args.listing_title),
        search_listingByCity: (parent, args) => Listings.filter(lt => lt.city === args.city),
        search_listingByPostalcode: (parent, args) => Listings.filter(lt => lt.postal_code === args.postal_code),

    },
    Mutation: {
        AddUser(parent, args) {
            var newUser = {
                id: _id++,
                username: args.username,
                firstname: args.firstname,
                type: args.type,
                lastname: args.lastname,
                password: args.password,
                email: args.email,
            }
            UserProfiles.push(newUser)
            return newUser
        },
        CreateListing(parent, args) {
            var newListing = {
                listing_id: _id++,
                listing_title: args.listing_title,
                description: args.description,
                street: args.street,
                city: args.city,
                postal_code: args.postal_code,
                price: args.price,
                email: args.email,
                username: args.username
            }
            Listings.push(newListing)
            return newListing
        },
        BookListing(parent, args) {
            var newBooking = {
                listing_id: _id++,
                booking_id: _id++,
                booking_date: args.booking_date,
                booking_start: args.booking_start,
                booking_end: args.booking_end,
                username: args.username
            }
            Bookings.push(newBooking)
            return newBooking
        },
    }
}


const server = new ApolloServer({
    cors:true,typeDefs, resolvers
})


server.listen()
    .then(({ url }) => console.log("Server running at " + url))

var app = express()
app.listen('4200')

app.get("/", (req,res)=>{
    res.send("Hello")
})

