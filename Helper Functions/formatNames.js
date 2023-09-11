
const formatNames = (array) => {
    const formattedNames = array.map((obj) => {
        
        const formattedName = obj.name.split(' ').map((item) => item[0].toUpperCase() + item.slice(1)).join(' ');

        return {
            ...obj.toObject(),
            name: formattedName
        };
    });

    return formattedNames;
}

module.exports = formatNames;