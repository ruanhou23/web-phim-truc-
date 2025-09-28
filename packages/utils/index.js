module.exports = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString("en-US");
    },
    generateUniqueId: () => {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    },
    validateMovieData: (data) => {
        const { title, description, videoUrl } = data;
        if (!title || !description || !videoUrl) {
            throw new Error("All fields are required: title, description, videoUrl");
        }
        return true;
    }
};