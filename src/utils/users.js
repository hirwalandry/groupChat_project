const users = []

// addUsers
const addUsers = ({ id, username, groupName }) => {
    // clean the data

    username = username.trim().toLowerCase()
    groupName = 'Unique-Group'
    // validate the data
    if (!username) {
        return{
            error : 'username required'
        }
        
    }
    // check existingUser
    const existingUser = users.find((user) => {
        return user.username === username

    })
    // validate user
    if (existingUser) {
        return{
            error: 'username is in use'
        }
    }
    // store user
    const user = {id , username, groupName}
    users.push(user)
    return { user }

}
const getUsers = (id) => {
    return users.find((user) => user.id === id)
}
const getUserInGroup = (groupName) => {
    return users.filter((user) => user.groupName === groupName)
}
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}
// addUsers({
//     id: 22,
//     username: 'landlord',
    
// })
// addUsers({
//     id: 32,
//     username: 'landlry',
    
// })
// addUsers({
//     id: 42,
//     username: 'mumu',
   
// })
// console.log(users)
module.exports = {
    addUsers,
    getUsers,
    getUserInGroup,
    removeUser
}