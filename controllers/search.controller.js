const houseModel = require('../models/houses.model.js');
const Houses = houseModel.Houses;

const ratingModel = require('../models/rating.model.js');
const Ratings = ratingModel.Ratings;

exports.findHousesByLocation = async (req, res) => {
    const houses = await Houses.findAll({
        where: {
            location: req.body.location
        }
    });

    if(houses)
    {
        return res.status(200).json(houses);
    } else {
        return res.status(404).json({ message: "Não foram encontradas casas com essa localização"});
    }
}

exports.findHousesByPrice = async (req, res) => {
    const houses = await Houses.findAll({
        where: {
            price_tag: req.body.price
        }
    });

    /*
    const dupHouses = houses;
    for(i = 0; i <= dupHouses.length; i++)
    {
        console.log(dupHouses[i].price_tag);
        if(dupHouses[i].price_tag > req.body.price){
            console.log("This is happening");
            dupHouses[i].destroy();
            console.log("Going to next house");
        }
    }*/

    if(houses != null)
    {
        return res.status(200).json(houses);
    } else {
        return res.status(404).json({ message: "Não foram encontradas casas com este preço"});
    }
}

exports.findHousesByAvailability = async (req, res) => {
    const houses = await Houses.findAll({
        where: {
            availabilty: true
        }
    });

    if(houses)
    {
        return res.status(200).json(houses);
    } else {
        return res.status(404).json({ message: "Não foram encontradas casas com essa localização"});
    }
}

exports.findHousesByRating = async (req, res) => {

    const houses = await Houses.findAll()

    for(i = 0; i <= houses.length; i++){
        const houseRating = await Ratings.findAll({
            where: {
                id_houses: houses[i].id
            }
        });

        for(j = 0; j <= houseRating.length; j++){
            
        }
    }

    if(houses != null)
    {
        return res.status(200).json({message: `Esta casa tem um rating "${x}".`});
    } else {
        return res.status(404).json({ message: "Não foram encontradas casas com este rating"});
    }
}