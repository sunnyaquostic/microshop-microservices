
const cart = 500 // to come from session
const email = "sunnyaquostic@gmail.com" // to come from session
const username = "sunday" // to come  from session
const userId = '1234' // to come from session

const baseURL = 'http://localhost:5001'
const data  = {
    cart,
    email,
    username,
    userId
}

const createOrder = async () => {
    await fetch(`${baseURL}/payment-service`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    })
    .then(result => result.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error occured', err))
}

createOrder()
// export default createOrder;