import { Request, Response } from "express";
import Address from "../Models/Address";
import User from "../Models/User";
import Doctor from "../Models/Doctor";
import { sequelize } from "../Config/sequelize";
import Clinic from "../Models/Clinic";

const saveDoctorInformation = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            userId,
            phoneNo,
            dob,
            gender,
            bloodGroup,
            pincode,
            building,
            area,
            landmark,
            townCity,
            state,
            education,
            experience,
            specialization,
            medicalField
        } = req.body;

        if (
            !userId ||
            !phoneNo ||
            !dob ||
            !gender ||
            !bloodGroup ||
            !pincode ||
            !building ||
            !area ||
            !townCity ||
            !state ||
            !education ||
            !experience ||
            !specialization ||
            !medicalField
        ) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User does not exist',
            });
        }

        const address = await Address.create({
            pincode,
            building,
            area,
            landmark,
            townCity,
            state
        }, { transaction });

        if (!address || !address.id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: 'Invalid address information',
            });
        }

        const doctor = await Doctor.create({
            userId,
            education,
            experience,
            specialization,
            medicalField
        }, { transaction });

        if (!doctor || !doctor.id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: 'Invalid doctor information',
            });
        }

        await User.update({
            phoneNo,
            dob,
            gender,
            bloodGroup,
            addressId: address.id,
        }, {
            where: { id: userId },
            transaction
        }); 

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'Doctor information saved successfully',
        });
    } catch (error) {
        console.error('Error saving doctor information:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

const savePatientInformation = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try{
        const {userId, phoneNo, dob, gender, bloodGroup, pincode, building, area, landmark, townCity, state} = req.body;
        if (
            !userId ||
            !phoneNo ||
            !dob ||
            !gender ||
            !bloodGroup ||
            !pincode ||
            !building ||
            !area ||
            !townCity ||
            !state
        ) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User does not exist',
            });
        }

        const address = await Address.create({
            pincode,
            building,
            area,
            landmark,
            townCity,
            state
        }, { transaction });

        if (!address || !address.id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: 'Invalid address information',
            });
        }

        await User.update({
            phoneNo,
            dob,
            gender,
            bloodGroup,
            addressId: address.id,
        }, {
            where: { id: userId },
            transaction
        }); 

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'Patient information saved successfully',
        });
    } catch(error){
        console.error('Error saving patient information:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}

const saveClinicInformation = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { userId, name, fee, openingTime, closingTime, pincode, building, area, landmark, townCity, state } = req.body;
        
        if (!userId || !name || !fee || !openingTime || !closingTime || !pincode || !building || !area || !landmark || !townCity || !state) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields in request body',
            });
        }

        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User does not exist',
            });
        }

        const address = await Address.create({
            pincode,
            building,
            area,
            landmark,
            townCity,
            state
        }, { transaction });
        
        if (!address || !address.id) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: 'Invalid address information',
            });
        }

        const clinic = await Clinic.create({
            name,
            addressId: address.id,
            fee,
            openingTime,
            closingTime,
            userId,
        }, { transaction });

        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: 'Clinic information saved successfully',
        });

    } catch(error) {
        console.error('Error saving clinic information:', error);
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
}


const getClinicInformation = async (req: Request, res: Response) => {
    try {
        const clinics = await Clinic.findAll({
            include: [
                {
                    model: Address,
                    attributes: ['pincode', 'building', 'area', 'landmark', 'townCity', 'state'],
                },
            ],
        });

        if (!clinics || clinics.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No clinic information found',
            });
        }

        return res.status(200).json({
            success: true,
            clinics,
        });
    } catch (error) {
        console.error('Error fetching clinic information:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};


const getDoctorInformation = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User does not exist',
            });
        }

        const doctor = await Doctor.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                    include: [Address],
                },
            ],
        });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                error: 'Doctor information not found for the provided userId',
            });
        }

        return res.status(200).json({
            success: true,
            user: user,
            doctor: doctor,
        });
    } catch (error) {
        console.error('Error fetching doctor information:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
};

const getPatientInformation = async(req: Request, res: Response) => {
    try{
        const userId = req.params.userId;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User does not exist',
            });
        }

        return res.status(200).json({
            success: true,
            user: user,
        });
    } catch(error){
        console.error('Error fetching patient information:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }
} 

export { saveDoctorInformation, savePatientInformation, saveClinicInformation , getPatientInformation, getDoctorInformation, getClinicInformation };
