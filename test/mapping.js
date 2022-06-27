(async () => {



    const Coffee = require('./coffee');
    const Shop = require('./shop');

//    Coffee.associate = models => {
        Coffee.belongsTo( Shop);
//    }


 //   Shop.associate = models => {
        Shop.hasMany(Coffee);
//    }

    // Shop.create({
    //     title: "Brahmins Coffee"
    // }).then(c => {
    //     Coffee.create({
    //         title: "Filter Coffee",
    //         shopId: c.id
    //     });
    // });

    setTimeout(async () => {
        const coffees = await Coffee.findAll({
            include: Shop
        });
       // console.log('Coffees = ', coffees);
    }, 3000)





})();