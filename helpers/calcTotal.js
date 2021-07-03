function calcTotal (cart) {

    let total = 0;
    for(let i of cart){
        total += i.price*i.cant
    }

    return total
    
}

module.exports = {
    calcTotal
}