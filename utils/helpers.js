module.exports = {
    // takes timestamp
    format_date: (date) => {
        //converts to month + date + year
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${
            new Date(date).getFullYear()
            }`;
    },
};