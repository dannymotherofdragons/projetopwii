const userModel = require("../models/user.model.js");
const Users = userModel.Users;

const houseModel = require("../models/houses.model.js");
const Houses = houseModel.Houses;

const rateModel = require("../models/rating.model.js");
const Ratings = rateModel.Ratings;

const hostModel = require("../models/hostApprove.model.js");
const hostApproves = hostModel.hostApproves;

const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../utilities/config.js");


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
        /*
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
        }*/

        user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            userType: req.body.userType,
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

exports.logIn = async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({ success: false, msg: "Falta de email ou password" })
        }

        let user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, msg: "Não existe esse utilizador" })
        };

        const check = bcrypt.compareSync(req.body.password, user.password);
        if (!check) {
            return res.status(401).json({ success: false, msg: "Password errada" });
        }

        const token = jwt.sign({ id: user.id, userType: user.userType },
            config.SECRET, {
            expiresIn: '24h'
        });
        return res.status(200).json({ success: true, accessToken: token });
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) })
        } else {
            res.status(500).json({ success: false, msg: err.message || "Erro ao dar login" })
        }
    }
}

exports.findAll = async (req, res) => {
    try {
        if (req.loggedUserRole !== "admin")
            return res.status(403).json({
                success: false, msg: "This request requires ADMIN role!"
            });

        const user = await Users.findAll()
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.status(400).json({
                message: "Couldn't find any user"
            })
        }
    } catch (err) {
        res.status(404).json({
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


exports.changeBlock = async (req, res) => {

    if (req.loggedUserRole !== "admin") {
        res.status(403).json({ success: false, msg: "This request requires ADMIN role!" })
    }

    const user = await Users.findByPk(req.body.otherUserID)
    user.update({
        is_blocked: req.body.isBlocked
    }, {
        where: {
            id: req.body.otherUserID
        }
    }).then(data => {
        res.status(200).json({
            message: `O estado do user com id "${req.body.otherUserID}" é agora ${req.body.isBlocked}.`
        })
    })
    /*
const adminUser = await Users.findByPk(req.body.adminID);
if (adminUser.userType === 0) {
    const user = await Users.findByPk(req.body.otherUserID)
    user.update({
        is_blocked: req.body.isBlocked
    }, {
        where: {
            id: req.body.otherUserID
        }
    }).then(data => {
        res.status(200).json({
            message: `O estado do user com id "${req.body.otherUserID}" é agora ${req.body.isBlocked}.`
        })
    })
}
else {
    res.status(400).json({
        message: `User não tem permissão para fazer isto.`
    })
}*/
}

exports.createEvent = async (req, res) => {
    if (req.loggedUserRole !== "host"){
        res.status(403).json({ success: false, msg: "This request requires HOST role"});
    }

    if(req.loggedUserRole.is_blocked === false)
    {
        //Criar evento

        evento = await Event.create({
            location: req.body.location,
            date: req.body.date,
            eventType: req.body.eventType,
            isApproved: false
        });
        return res.status(200).json({
            message: "Casa criada com sucesso"
        });
    }
}

exports.approveEvent = async (req, res) => {
    if (req.loggedUserRole !== "admin") {
        return res.status(403).json({ success: false, msg: "This request requires ADMIN role" })
    }

    const evento = await Event.findByPk(req.body.eventToApprove)

    if (req.body.approve === false) {
        evento.destroy();
        res.status(200).json({
            message: `Este evento não foi aprovada`
        })
    } else {
        evento.update({
            isApproved: req.body.approve
        }, {
            where: {
                id: req.body.eventToApprove
            }
        }).then(data => {
            res.status(200).json({
                message: `O evento com id "${req.body.eventToApprove}" foi aprovado.`
            })
        })
    }
}

exports.createHouse = async (req, res) => {
    if (req.loggedUserRole !== "host") {
        res.status(403).json({ success: false, msg: "This request requires HOST role!" })
    }
    const posterUser = await Users.findByPk(req.loggedUserId);
    if (posterUser.is_blocked === false) {
        //Criar casa

        var roomTypes;
        switch (req.body.roomType) {
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
            id_users: req.loggedUserId,
            location: req.body.location,
            availabilty: true,
            description: req.body.description,
            price_tag: req.body.priceTag,
            rooms: req.body.rooms,
            room_type: roomTypes,
            isApproved: false
        });
        return res.status(200).json({
            message: "Casa criada com sucesso"
        });

        /*if (posterUser.userType === 2) {
            //Criar casa

            var roomTypes;
            switch (req.body.roomType) {
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
        }*/
    } else {
        res.status(400).json({
            message: `User está bloqueado`
        })
    }
}

exports.changeHouseAvailability = async (req, res) => {
    if (req.loggedUserRole !== "host") {
        return res.status(403).json({ success: false, msg: "This request requires HOST role" })
    }

    const house = await Houses.findOne({
        where: {
            id: req.body.house,
            id_users: req.loggedUserId
        }
    })

    if (house != null) {
        house.update({
            availabilty: req.body.available
        }, {
            where: {
                id: req.body.house
            }
        }).then(data => {
            res.status(200).json({
                message: `O estado da casa com id "${req.body.house}" é agora ${req.body.available}.`
            })
        })
    }
}

exports.applyToHouse = async (req, res) => {
    if (req.loggedUserRole !== "regular") {
        return res.status(403).json({ success: false, msg: "This request requires REGULAR role" })
    }

    const house = await Houses.findOne({
        where: {
            id: req.body.house
        }
    })

    if (house.isApproved != true) {
        return res.status(403).json({ msg: "Esta casa ainda não foi aprovada pelos moderadores" })
    }

    userApprove = await hostApproves.create({
        id_users: req.loggedUserId,
        id_houses: req.body.house,
        approve: false
    });
    return res.status(200).json({
        message: "aplicação criada com sucesso"
    });
}

exports.approveApplication = async (req, res) => {
    if (req.loggedUserRole != "host") {
        return res.status(403).json({ success: false, msg: "THis request requires HOST role" })
    }
    const userApprove = await hostApproves.findOne({
        where: {
            id_users: req.body.userID,
            id_houses: req.body.house
        }
    })

    const house = await Houses.findOne({
        where: {
            id: req.body.house
        }
    })
    
    if (req.body.approve === true) {
        userApprove.update({
            approve: req.body.approve
        }, {
            where: {
                id: userApprove.id
            }
        }).then(data => {
            console.log()
            house.update({
                availabilty: false
            }, {
                where: {
                    id: req.body.house
                }
            })
            res.status(200).json({
                message: `O user com id "${req.body.userID}" foi aprovado.`
            })
        })
    } else {
        userApprove.destroy();
        return res.status(200).json({ message: "Aplicação não aprovada"});
    }
}

exports.findApplications = async (req, res) => {
    if (req.loggedUserRole !== "host") {
        return res.status(403).json({ success: false, msg: "This request requires HOST role" })
    }

    const house = await Houses.findOne({
        where: {
            id: req.body.house
        }
    })

    if (house.isApproved != true) {
        return res.status(403).json({ msg: "Esta casa ainda não foi aprovada pelos moderadores" })
    }

    const applications = await hostApproves.findAll({
        where: {
            id_houses: house.id
        }
    })

    if (applications) {
        res.status(200).json(applications)
    }
    else {
        res.status(400).json({
            message: "Não foram encontradas aplicações"
        })
    }
}

exports.findApprovedHouses = async (req, res) => {
    try {
        const houses = await Houses.findAll({
            where: {
                isApproved: true
            }
        })
        res.status(200).json(houses);
    } catch (err) {
        req.status(400).json({
            message: err.message
        })
    }
}

exports.findHousesToApprove = async (req, res) => {
    try {

        if (req.loggedUserRole !== "admin") {
            res.status(403).json({ success: false, msg: "This request requires ADMIN role!" })
        }
        const houses = await Houses.findAll({
            where: {
                isApproved: false
            }
        })
        res.status(200).json(houses);
    } catch (err) {
        req.status(400).json({
            message: err.message
        })
    }
}

exports.approveHouse = async (req, res) => {
    if (req.loggedUserRole !== "admin") {
        return res.status(403).json({ success: false, msg: "This request requires ADMIN role" })
    }

    const house = await Houses.findByPk(req.body.houseToApprove)

    if (req.body.approve === false) {
        house.destroy();
        res.status(200).json({
            message: `Esta casa não foi aprovada`
        })
    } else {
        house.update({
            isApproved: req.body.approve
        }, {
            where: {
                id: req.body.houseToApprove
            }
        }).then(data => {
            res.status(200).json({
                message: `A casa com id "${req.body.houseToApprove}" foi aprovada.`
            })
        })
    }


    /*const adminUser = await Users.findByPk(req.body.adminID);
    if (adminUser.userType == 0) {
        //Approve/Unapprove house
        const house = await Houses.findByPk(req.body.houseToApprove)

        if (req.body.approve === false) {
            house.destroy();
            res.status(200).json({
                message: `Esta casa não foi aprovada`
            })
        } else {
            house.update({
                isApproved: req.body.approve
            }, {
                where: {
                    id: req.body.houseToApprove
                }
            }).then(data => {
                res.status(200).json({
                    message: `A casa com id "${req.body.houseToApprove}" foi aprovada.`
                })
            })
        }
    } else {
        res.status(400).json({
            message: `Este user não tem permissão`
        })
    }*/
}

exports.getHouseRatings = async (req, res) => {
    const house = await Houses.findByPk(req.body.houseID)

    if (house.isApproved === true) {
        const ratings = await Ratings.findAll({
            where: {
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
    else {
        res.status(400).json({
            message: `Esta casa não foi aprovada ainda`
        })
    }
}

exports.rateHouse = async (req, res) => {
    if (req.loggedUserRole !== "regular") {
        return res.status(403).json({ success: false, msg: "This request requires REGULAR role" })
    }
    const user = await Users.findByPk(req.loggedUserId);

    if (user.is_blocked === true) {
        return res.status(400).json({
            message: `Este user está bloqueado`
        })
    }
    const house = await Houses.findByPk(req.body.houseID)

    if (house.isApproved === true) {

        const ratings = await Ratings.findAll({
            where: {
                id_houses: req.body.houseID,
                id_users: req.loggedUserId
            }
        })

        console.log(ratings);
        if (ratings.length > 0) {
            return res.status(400).json({
                message: `O user só pode dar uma classificação`
            })
        }
        if (req.body.rating > 5) {
            req.body.rating = 5
        }
        //Dar Rating
        rating = await Ratings.create({
            id_users: req.loggedUserId,
            id_houses: req.body.houseID,
            rating: req.body.rating,
            comment: req.body.comment
        });
        return res.status(200).json({
            message: "Classificação foi dada"
        });
    } else {
        res.status(400).json({
            message: `Esta casa não foi aprovada`
        })
    }
    /*
    if (user.userType === 1) {
        //pode dar rate
        const house = await Houses.findByPk(req.body.houseID)

        if (house.isApproved === true) {

            const ratings = await Ratings.findAll({
                where: {
                    id_houses: req.body.houseID,
                    id_users: req.body.userID
                }
            })

            console.log(ratings);
            if (ratings.length > 0) {
                return res.status(400).json({
                    message: `O user só pode dar um classificação`
                })
            }
            if (req.body.rating > 5) {
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
        } else {
            res.status(400).json({
                message: `Esta casa não foi aprovada`
            })
        }
    }
    else {
        res.status(400).json({
            message: `Este user não tem permissão para dar ratings`
        })
    } */
}