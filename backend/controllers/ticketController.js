import Ticket from '../models/ticket.js';
import moment from 'moment';

//Create new ticket

export const createTicket = async (req, res) => {
    const newTicket = new Ticket(req.body);

    try {
        const saveTicket = await newTicket.save();
        res.status(200).json({
            success: true,
            message: 'Successfully created',
            data: saveTicket,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};

//update ticket

export const updateTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true },
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedTicket,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};

//update seat ticket

// export const updateSeat = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const updatedTicket = await Ticket.findByIdAndUpdate(
//       id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Successfully updated",
//       data: updatedTicket,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update. Try again ",
//     });
//   }
// };

//delete ticket

export const deleteTicket = async (req, res) => {
    const id = req.params.id;
    try {
        await Ticket.findByIdAndDelete(id);

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

//getSingle ticket

export const getSingleTicket = async (req, res) => {
    const id = req.params.id;
    try {
        const ticket = await Ticket.findById(id);

        res.status(200).json({
            success: true,
            message: 'Successfully',
            data: ticket,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

//getAll ticket

export const getAllTicket = async (req, res) => {
    //for pagination
    // const page = parseInt(req.query.page);

    try {
        const tickets = await Ticket.find({});
        // .skip(page * 5)
        // .limit(5);

        if (tickets.length > 0) {
            res.status(200).json({
                success: true,
                count: tickets.length,
                message: 'Successfully',
                data: tickets,
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

//get ticket by search
export const getTicketBySearch = async (req, res) => {
    //here 'i' means case sensitive
    const AirportFrom = new RegExp(req.query.AirportFrom, 'i');
    const AirportTo = new RegExp(req.query.AirportTo, 'i');
    // const DateGo = new Date(req.query.DateGo);
    const DateGo = new Date(req.query.DateGo);
    // const DateReturn = new Date(req.query.DateReturn);

    console.log(AirportFrom);

    const DateReturn = '2024-01-02T14:30';
    // console.log(DateReturn);
    // const DateReturn = "01-02-2024";

    const formattedDateReturn = new Date(DateReturn).toISOString();

    // console.log(formattedDateReturn);

    // console.log("Convert Date:" + moment(DateGo).utc().format("YYYY-mm-DD"));
    try {
        // console.log("anh nghi dep trai", DateGo);

        // const tickets = await Ticket();
        // console.log(tickets);

        const tickets = await Ticket.find({
            AirportFrom,
            AirportTo,
            // DateGo: {
            //   $gte: new Date(DateGo),
            // },
            DateGo,
            // Roundtrip: {
            //   DateReturn: DateReturn,
            // },
            //function filter in mongdb: { DateGo: { $eq:ISODate("2024-01-01T17:00:00.000Z") } }
        });

        // console.log(tickets);
        // const ticket = tickets.map((ticket) => ticket.Roundtrip.DateReturn);
        // console.log(ticket);

        // const tickets = await Ticket.find({ Duration: { $gte: Duration } });
        // console.log(data);

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

//Fetch this for Oneway
export const getTicketBySearchCompany = async (req, res) => {
    //here 'i' means case sensitive
    const AirportFrom = new RegExp(req.query.AirportFrom, 'i');
    const AirportTo = new RegExp(req.query.AirportTo, 'i');

    const DateGo = new Date(req.query.DateGo);
    const AirlineCode = new RegExp(req.query.AirlineCode, 'i');
    console.log('thoi xong anh roi', AirlineCode);

    try {
        const tickets = await Ticket.find({
            AirportFrom,
            AirportTo,
            DateGo,
            AirlineCode,
        });

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

//Fetch this for Roundtrip
export const getTicketBySearchCompanyAndDuration = async (req, res) => {
    //here 'i' means case sensitive
    const AirportFrom = new RegExp(req.query.AirportFrom, 'i');
    const AirportTo = new RegExp(req.query.AirportTo, 'i');

    const DateGo = new Date(req.query.DateGo);
    const AirlineCode = new RegExp(req.query.AirlineCode, 'i');
    const Duration = parseInt(req.query.Duration, 10); // Assuming the Duration is provided as a query parameter

    try {
        const tickets = await Ticket.find({
            AirportFrom,
            AirportTo,
            DateGo,
            AirlineCode,
            Duration: { $lte: Duration }, // Filter for documents with Duration lower than the specified value
        });

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketBySearchDuration = async (req, res) => {
    //here 'i' means case sensitive
    const AirportFrom = new RegExp(req.query.AirportFrom, 'i');
    const AirportTo = new RegExp(req.query.AirportTo, 'i');

    const DateGo = new Date(req.query.DateGo);
    const Duration = parseInt(req.query.Duration, 10); // Assuming the Duration is provided as a query parameter

    try {
        const tickets = await Ticket.find({
            AirportFrom,
            AirportTo,
            DateGo,
            Duration: { $lte: Duration }, // Filter for documents with Duration lower than the specified value
        });

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

//get ticket by day
export const getTicketByTodayOfCompany = async (req, res) => {
    const DateGo = new Date(req.query.DateGo);
    const airlineCode = new RegExp(`^${req.query.AirlineCode}$`);

    try {
        const tickets = await Ticket.find({
            DateGo,
            AirlineCode: airlineCode,
            // Roundtrip: {
            //   DateReturn: DateReturn,
            // },
            //function filter in mongdb: { DateGo: { $eq:ISODate("2024-01-01T17:00:00.000Z") } }
        });

        console.log(tickets);
        // const ticket = tickets.map((ticket) => ticket.Roundtrip.DateReturn);
        // console.log(ticket);

        // const tickets = await Ticket.find({ Duration: { $gte: Duration } });
        // console.log(data);

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketCompletedAll = async (req, res) => {
    const LandingTime = new Date(req.query.LandingTime);

    try {
        const currentDate = new Date();

        const tickets = await Ticket.find({
            LandingTime: { $lt: currentDate },
        });

        console.log(tickets);

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

const getMonth = () => {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setMonth(currentMonthStart.getMonth(), 0);
    currentMonthStart.setHours(0, 0, 0, 0);
    console.log(currentMonthStart);

    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1, 0);
    currentMonthEnd.setHours(23, 59, 59, 999);
    console.log(currentMonthEnd);

    return {
        currentMonthStart: currentMonthStart,
        currentMonthEnd: currentMonthEnd,
    };
};

export const getTicketIncompletedAll = async (req, res) => {
    const LandingTime = new Date(req.query.LandingTime);

    try {
        const currentDate = new Date();

        const tickets = await Ticket.find({
            LandingTime: { $gt: currentDate },
        });

        console.log(tickets);

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketIncompletedMonthNowOfCompany = async (req, res) => {
    const LandingTime = new Date(req.query.LandingTime);

    const currentDate = new Date();
    const currentMonthEnd = getMonth().currentMonthEnd;
    const airlineCode = new RegExp(`^${req.query.AirlineCode}$`);

    try {
        const tickets = await Ticket.find({
            LandingTime: { $gte: currentDate, $lt: currentMonthEnd },
            AirlineCode: airlineCode,
        });

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getTicketCompletedMonthNowOfCompany = async (req, res) => {
    const LandingTime = new Date(req.query.LandingTime);

    const currentDate = new Date();
    const currentMonthStart = getMonth().currentMonthStart;

    const airlineCode = new RegExp(`^${req.query.AirlineCode}$`);

    try {
        const tickets = await Ticket.find({
            LandingTime: { $gte: currentMonthStart, $lt: currentDate },
            AirlineCode: airlineCode,
        });

        res.status(200).json({
            success: true,
            message: 'Successfully found search',
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Not found ',
        });
    }
};

export const getAllTicketOfCompany = async (req, res) => {
    //for pagination
    // const page = parseInt(req.query.page);

    const airlineCode = new RegExp(`^${req.query.AirlineCode}$`);

    try {
        const tickets = await Ticket.find({
            AirlineCode: airlineCode,
        });

        if (tickets.length > 0) {
            res.status(200).json({
                success: true,
                count: tickets.length,
                message: 'Successfully',
                data: tickets,
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
