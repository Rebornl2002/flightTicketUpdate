import ticketDetail from '../models/ticketDetail.js';
import moment from 'moment';

//Create ticketDetail

export const createticketDetail = async (req, res) => {
    const newticketDetail = new ticketDetail(req.body);
    try {
        const saveticketDetail = await newticketDetail.save();
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: saveticketDetail,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create. Try again ',
        });
    }
};

//update ticket

export const updateticketDetail = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedticketDetail = await ticketDetail.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedticketDetail,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update. Try again ',
        });
    }
};

//delete ticket

export const deleteticketDetail = async (req, res) => {
    const id = req.params.id;
    try {
        await ticketDetail.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Successfully deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete. Try again ',
        });
    }
};

export const getTicketDetailByCodeTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const ticketDetailSearch = await ticketDetail.find({ CodeTicketGeneral: id });
        console.log(ticketDetailSearch);

        res.status(200).json({
            success: true,
            message: 'Successfully',
            data: ticketDetailSearch,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketDetailBySearchCodeTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const ticketDetailSearch = await ticketDetail.find({ CodeTicket: id });
        console.log('dataSearch', ticketDetailSearch);

        res.status(200).json({
            success: true,
            message: 'Successfully',
            data: ticketDetailSearch,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketDetailByFlightNumber = async (req, res) => {
    const id = req.params.id;
    try {
        const ticketDetailSearch = await ticketDetail.find({ FlightNumber: id }, { ID_Card: 1 });

        res.status(200).json({
            success: true,
            message: 'Successfully',
            data: ticketDetailSearch,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketDetailByFlightNumberRoundTrip = async (req, res) => {
    const id = req.params.id;
    const returnFlight = req.query.roundTrip;
    try {
        const ticketDetailSearch = await ticketDetail.find(
            {
                $or: [
                    { FlightNumber: id },
                    { FlightNumber: returnFlight },
                    { FlightNumberReturn: id, TypeFlight: 'Roundtrip' },
                    { FlightNumberReturn: returnFlight, TypeFlight: 'Roundtrip' },
                ],
            },
            { ID_Card: 1 },
        );

        console.log(req.query);
        res.status(200).json({
            success: true,
            message: 'Successfully',
            data: ticketDetailSearch,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

//getAll ticket

export const getAllticketDetail = async (req, res) => {
    try {
        const ticketDetail = await ticketDetail.find({});

        if (ticketDetail.length > 0) {
            res.status(200).json({
                success: true,
                count: ticketDetail.length,
                message: 'Successfully',
                data: ticketDetail,
            });
        } else {
            throw new Error('No tickets found'); // Throw an error when tickets.length is <= 0
        }
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};
