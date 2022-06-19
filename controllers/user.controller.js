const userModel = require("../models/user.model.js");
const Users = userModel.Users;

const houseModel = require("../models/houses.model.js");
const Houses = houseModel.Houses;

const rateModel = require("../models/rating.model.js");
const Ratings = rateModel.Ratings;

const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        let user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            return res.status(400).json({
                message: "Failed! Email is already in use!"
            });
        }
        var userType;
        switch(req.body.userType){
            case "admin":
                userType = 0
                break;
            case "user":
                userType = 1
                break;
            case "host":
                userType = 2
                break;
        }

        user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),            
            userType: userType,
            is_blocked: false
        });
        return res.status(200).json({
            message: "User was registered successfully!"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    };
};

exports.findAll = async (req, res) => {
    try {
        const user = await Users.findAll()
        if(user){
            res.status(200).json(user)
        }
        else{
            res.status(400).json({
                message: "Couldn't find any user"
            })
        }
    } catch (err){
        req.status(400).json({
            message: err.message
        })
    }
}

exports.findOne = async (req, res) => {
    try {
        const user = await Users.findByPk(req.body.id);
        if (user === null)
            res.status(404).json({
                message: `Não foi possível encontrar o user com ID "${req.body.userID}".`
            });
        else res.status(200).json(user);
        } 
    catch (err) {
        res.status(500).json({
            message:
            err.message || `Erro ao encontrar o user com ID "${req.body.userID}".`
        });
    }
};


exports.changeBlock = async(req, res)=>{
    const adminUser = await Users.findByPk(req.body.adminID);
        if (adminUser.userType === 0)
        {
            const user = await Users.findByPk(req.body.otherUserID)
            user.update({
                is_blocked: req.body.isBlocked
            }, {
                where: {
                    id: req.body.otherUserID
                }
            }).then (data => {
                res.status(200).json({
                    message: `O estado do user com id "${req.body.otherUserID}" é agora ${req.body.isBlocked}.`
                })
            })
        }
        else {
            res.status(400).json({
                message: `User não tem permissão para fazer isto.`
            })
        }
}


exports.createHouse = async(req, res) =>{
    const posterUser = await Users.findByPk(req.body.creatorID);
    if(posterUser.is_blocked === false)
    {
        if(posterUser.userType === 2){
            //Criar casa
    
            var roomTypes;
            switch(req.body.roomType){
                case 0:
                    roomTypes = "Single Bed";
                    break;
                case 1:
                    roomTypes = "Double Bed";
                    break;
                case 2:
                    roomTypes = "Couple Bed";
                    break;
            }
    
            house = await Houses.create({
                host_id: req.body.creatorID,
                location: req.body.location,
                description: req.body.description,
                price_tag: req.body.priceTag,
                rooms: req.body.rooms,
                roomType: roomTypes,
                isApproved: false
            });
            return res.status(200).json({
                message: "Casa criada com sucesso"
            });
        } else {
            res.status(400).json({
                message: `User não tem permissão para criar uma casa`
            })
        }        
    } else {
        res.status(400).json({
            message: `User está bloqueado`
        })
    }
}
exports.findApprovedHouses = async(req,res) =>{
    try {
        const houses = await Houses.findAll({
            where:{
                isApproved: true
            }
        })
        res.status(200).json(houses);
    } catch (err){
        req.status(400).json({
            message: err.message
        })
    }
}

exports.findHousesToApprove = async(req,res) =>{
    try {
        const houses = await Houses.findAll({
            where:{
                isApproved: false
            }
        })
        res.status(200).json(houses);
    } catch (err){
        req.status(400).json({
            message: err.message
        })
    }
}

exports.approveHouse = async(req, res) =>{
    const adminUser = await Users.findByPk(req.body.adminID);
    if (adminUser.userType == 0)
    {
        //Approve/Unapprove house
        const house = await Houses.findByPk(req.body.houseToApprove)

        if(req.body.approve === false)
        {
            house.destroy();
            res.status(200).json({
                message: `Esta casa não foi aprovada`
            })
        } else{
            house.update({
                isApproved: req.body.approve
            }, {
                where: {
                    id: req.body.houseToApprove
                }
            }).then (data => {
                res.status(200).json({
                    message: `A casa com id "${req.body.houseToApprove}" foi aprovada.`
                })
            })
        }
    } else {
        res.status(400).json({
            message: `Este user não tem permissão`
        })
    }
}

exports.getHouseRatings = async(req, res) => {
    const house = await Houses.findByPk(req.body.houseID)

    if(house.isApproved === true)
    {
        const ratings = await Ratings.findAll({
            where:{
                id_houses: req.body.houseID
            }
        })

        res.status(200).json(ratings)
        /*
        var x = 0;
        for(i = 0; i <= ratings.length; i++)
        {
            x += ratings[i].rating;
        }

        var finalRate;

        finalRate = x/ratings.length;
        

        res.status(200).json({
            message: `A casa com o ID ${req.body.houseID} tem uma rating de ${finalRate}`
        })
        */
    }
    else{
        res.status(400).json({
            message: `Esta casa não foi aprovada ainda`
        })
    }
}

exports.rateHouse = async(req, res) => {
    const user = await Users.findByPk(req.body.userID);

    if(user.is_blocked === true){
        return res.status(400).json({
            message: `Este user está bloqueado`
        })
    }
    if(user.userType === 1)
    {
        //pode dar rate
        const house = await Houses.findByPk(req.body.houseID)

        if(house.isApproved === true)
        {

            const ratings = await Ratings.findAll({
                where:{
                    id_houses: req.body.houseID,
                    id_users: req.body.userID
                }
            })

            console.log(ratings);
            if(ratings.length > 0){
                return res.status(400).json({
                    message: `O user só pode dar um classificação`
                })
            }
            if(req.body.rating > 5){
                req.body.rating = 5
            }
            //Dar Rating
            rating = await Ratings.create({
                id_users: req.body.userID,
                id_houses: req.body.houseID,
                rating: req.body.rating,
                comment: req.body.comment
            });
            return res.status(200).json({
                message: "Classificação foi dada"
            });
        } else{
            res.status(400).json({
                message: `Esta casa não foi aprovada`
            })
        }
    }
    else{
        res.status(400).json({
            message: `Este user não tem permissão para dar ratings`
        })
    }
}