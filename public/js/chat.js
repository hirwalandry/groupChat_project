socket = io()

//element
$message = document.querySelector('#messages')
$messageForm = document.querySelector('#message-form')
$sendLocation = document.querySelector('#send-location')

//template
message_template = document.querySelector('#message-template').innerHTML
location_template = document.querySelector('#location-template').innerHTML
header_template = document.querySelector('#header-template').innerHTML

//option
const {username} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('old message', (result) => {
    console.log(result)
    
    const html = Mustache.render(message_template, {
        result: console.log(result)
    })
    document.querySelector('message-template').innerHTML = html
})
socket.on('group', ({ users, groupName }) => {
    const html = Mustache.render(header_template, {
        groupName,
        users
    })
    document.querySelector('#header').innerHTML = html

})
socket.on('locationMessage', (url) => {
    console.log(url)
    
    const html = Mustache.render(location_template, {
        username: url.username,
        url: url.text,
        createdAt: moment(url.createdAt).format('H:m a')
    })
    $message.insertAdjacentHTML('beforeend', html)
 })

 socket.on('message', (message) => {
    
    console.log(message)
            const html = Mustache.render(message_template, {
                username: message.username,
                message: message.text,
                createdAt: moment(message.createdAt).format('h:m a')
            })
            $message.insertAdjacentHTML('beforeend', html)
            
    
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('message sent successfully')
    })
})
$sendLocation.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('your browser doesnt support geolocation')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            if (error) {
                return console.log(error)
            }
            console.log('location shared successfully')
        })
    })
})
socket.emit('join', {username}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
